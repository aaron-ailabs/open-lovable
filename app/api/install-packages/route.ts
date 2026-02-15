import { NextRequest, NextResponse } from 'next/server';
import { InstallPackagesSchema } from '@/lib/validations';
import { ValidationError, AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';

declare global {
  var activeSandbox: any;
  var activeSandboxProvider: any;
  var sandboxData: any;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = InstallPackagesSchema.safeParse(body);
    if (!validation.success) {
      const details = validation.error.format();
      logger.warn('Validation failed for install-packages', { details });
      throw new ValidationError('Invalid request data', details);
    }

    const { packages } = validation.data;
    
    // Validate and deduplicate package names
    const validPackages = [...new Set(packages)]
      .filter(pkg => pkg && pkg.trim() !== '')
      .map(pkg => pkg.trim());
    
    if (validPackages.length === 0) {
      throw new ValidationError('No valid package names provided');
    }
    
    // Get active sandbox provider
    const provider = global.activeSandboxProvider;
    
    if (!provider) {
      logger.warn('No active sandbox provider available for package installation');
      throw new AppError('No active sandbox provider available', 400, 'NO_SANDBOX_PROVIDER');
    }
    
    logger.info('Installing packages', { packages: validPackages });
    
    // Create a response stream for real-time updates
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    // Function to send progress updates
    const sendProgress = async (data: any) => {
      const message = `data: ${JSON.stringify(data)}\n\n`;
      await writer.write(encoder.encode(message));
    };
    
    // Start installation in background
    (async (providerInstance) => {
      try {
        await sendProgress({ 
          type: 'start', 
          message: `Installing ${validPackages.length} package${validPackages.length > 1 ? 's' : ''}...`,
          packages: validPackages 
        });
        
        // Stop any existing development server first
        await sendProgress({ type: 'status', message: 'Stopping development server...' });
        
        try {
          // Try to kill any running dev server processes
          await providerInstance.runCommand('pkill -f vite');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a bit
        } catch (killError) {
          // It's OK if no process is found
          logger.debug('No existing dev server found to stop', { error: killError });
        }
        
        // Check which packages are already installed
        await sendProgress({ 
          type: 'status', 
          message: 'Checking installed packages...' 
        });
        
        let packagesToInstall = validPackages;
        
        try {
          // Read package.json to check existing dependencies
          let packageJsonContent = '';
          try {
            packageJsonContent = await providerInstance.readFile('package.json');
          } catch (error) {
            logger.warn('Error reading package.json', { error });
          }
          if (packageJsonContent) {
            const packageJson = JSON.parse(packageJsonContent);
            
            const dependencies = packageJson.dependencies || {};
            const devDependencies = packageJson.devDependencies || {};
            const allDeps = { ...dependencies, ...devDependencies };
            
            const alreadyInstalled = [];
            const needInstall = [];
            
            for (const pkg of validPackages) {
              // Handle scoped packages
              const pkgName = pkg.startsWith('@') ? pkg : pkg.split('@')[0];
              
              if (allDeps[pkgName]) {
                alreadyInstalled.push(pkgName);
              } else {
                needInstall.push(pkg);
              }
            }
            
            packagesToInstall = needInstall;
            
            if (alreadyInstalled.length > 0) {
              await sendProgress({ 
                type: 'info', 
                message: `Already installed: ${alreadyInstalled.join(', ')}` 
              });
            }
          }
        } catch (error) {
          logger.error('Error checking existing packages', error);
          // If we can't check, just try to install all packages
          packagesToInstall = validPackages;
        }
        
        if (packagesToInstall.length === 0) {
          await sendProgress({ 
            type: 'success', 
            message: 'All packages are already installed',
            installedPackages: [],
            alreadyInstalled: validPackages
          });
          
          // Restart dev server
          await sendProgress({ type: 'status', message: 'Restarting development server...' });
          
          await providerInstance.restartViteServer();
          
          await sendProgress({ 
            type: 'complete', 
            message: 'Dev server restarted!',
            installedPackages: []
          });
          
          return;
        }
        
        // Install only packages that aren't already installed
        await sendProgress({ 
          type: 'info', 
          message: `Installing ${packagesToInstall.length} new package(s): ${packagesToInstall.join(', ')}`
        });
        
        // Install packages using provider method
        const installResult = await providerInstance.installPackages(packagesToInstall);
        
        // Get install output - ensure stdout/stderr are strings
        const stdout = String(installResult.stdout || '');
        const stderr = String(installResult.stderr || '');
        
        if (stdout) {
          const lines = stdout.split('\n').filter(line => line.trim());
          for (const line of lines) {
            if (line.includes('npm WARN')) {
              await sendProgress({ type: 'warning', message: line });
            } else if (line.trim()) {
              await sendProgress({ type: 'output', message: line });
            }
          }
        }
        
        if (stderr) {
          const errorLines = stderr.split('\n').filter(line => line.trim());
          for (const line of errorLines) {
            if (line.includes('ERESOLVE')) {
              await sendProgress({ 
                type: 'warning', 
                message: `Dependency conflict resolved with --legacy-peer-deps: ${line}` 
              });
            } else if (line.trim()) {
              await sendProgress({ type: 'error', message: line });
            }
          }
        }
        
        if (installResult.exitCode === 0) {
          logger.info('Packages installed successfully', { packages: packagesToInstall });
          await sendProgress({ 
            type: 'success', 
            message: `Successfully installed: ${packagesToInstall.join(', ')}`,
            installedPackages: packagesToInstall
          });
        } else {
          logger.error('Package installation failed', new Error(stderr), { packages: packagesToInstall });
          await sendProgress({ 
            type: 'error', 
            message: 'Package installation failed' 
          });
        }
        
        // Restart development server
        await sendProgress({ type: 'status', message: 'Restarting development server...' });
        
        try {
          await providerInstance.restartViteServer();
          
          // Wait a bit for the server to start
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          await sendProgress({ 
            type: 'complete', 
            message: 'Package installation complete and dev server restarted!',
            installedPackages: packagesToInstall
          });
        } catch (error) {
          logger.error('Failed to restart dev server after installation', error);
          await sendProgress({ 
            type: 'error', 
            message: `Failed to restart dev server: ${(error as Error).message}` 
          });
        }
        
      } catch (error) {
        const errorMessage = (error as Error).message;
        logger.error('Background package installation failed', error);
        if (errorMessage && errorMessage !== 'undefined') {
          await sendProgress({ 
            type: 'error', 
            message: errorMessage
          });
        }
      } finally {
        await writer.close();
      }
    })(provider);
    
    // Return the stream
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
    
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.statusCode }
      );
    }

    logger.error('Unexpected error in install-packages', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}