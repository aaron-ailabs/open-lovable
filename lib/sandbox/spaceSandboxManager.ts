import { SandboxProvider } from './types';
import { SandboxFactory } from './factory';
import { logger } from '@/lib/logger';
import { SandboxError } from '@/lib/errors';

interface SandboxInfo {
  sandboxId: string;
  provider: SandboxProvider;
  createdAt: Date;
  lastAccessed: Date;
}

class SpaceSandboxManager {
  private sandboxes: Map<string, SandboxInfo> = new Map();
  private activeSandboxId: string | null = null;

  async getOrCreateProvider(sandboxId: string): Promise<SandboxProvider> {
    logger.debug('Getting or creating sandbox provider', { sandboxId });
    const existing = this.sandboxes.get(sandboxId);
    if (existing) {
      existing.lastAccessed = new Date();
      return existing.provider;
    }

    try {
      const provider = SandboxFactory.create();
      if (provider.constructor.name === 'E2BProvider') {
        const reconnected = await (provider as any).reconnect(sandboxId);
        if (reconnected) {
          logger.info('Successfully reconnected to E2B sandbox', { sandboxId });
          this.registerSandbox(sandboxId, provider);
          return provider;
        }
      }
      return provider;
    } catch (error) {
      logger.error('Error reconnecting to sandbox', error, { sandboxId });
      throw new SandboxError(`Failed to reconnect to sandbox: ${sandboxId}`, error);
    }
  }

  registerSandbox(sandboxId: string, provider: SandboxProvider): void {
    logger.info('Registering new sandbox', { sandboxId, provider: provider.constructor.name });
    this.sandboxes.set(sandboxId, {
      sandboxId,
      provider,
      createdAt: new Date(),
      lastAccessed: new Date()
    });
    this.activeSandboxId = sandboxId;
  }

  getActiveProvider(): SandboxProvider | null {
    if (!this.activeSandboxId) return null;
    const sandbox = this.sandboxes.get(this.activeSandboxId);
    if (sandbox) {
      sandbox.lastAccessed = new Date();
      return sandbox.provider;
    }
    return null;
  }

  async terminateSandbox(sandboxId: string): Promise<void> {
    const sandbox = this.sandboxes.get(sandboxId);
    if (sandbox) {
      try {
        logger.info('Terminating sandbox', { sandboxId });
        await sandbox.provider.terminate();
      } catch (error) {
        logger.error('Error terminating sandbox', error, { sandboxId });
      }
      this.sandboxes.delete(sandboxId);
      if (this.activeSandboxId === sandboxId) this.activeSandboxId = null;
    }
  }

  async terminateAll(): Promise<void> {
    logger.info('Terminating all active sandboxes', { count: this.sandboxes.size });
    const promises = Array.from(this.sandboxes.values()).map(sandbox => 
      sandbox.provider.terminate().catch(err => 
        logger.error('Error terminating sandbox in batch', err, { sandboxId: sandbox.sandboxId })
      )
    );
    await Promise.all(promises);
    this.sandboxes.clear();
    this.activeSandboxId = null;
  }
}

export const spaceSandboxManager = new SpaceSandboxManager();
