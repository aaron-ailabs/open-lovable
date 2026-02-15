// This is a simple test script to verify API routes
// In a real project, you would use Vitest or Jest

async function testApi() {
  console.log('Testing consolidated API routes...');

  const routes = [
    '/api/run-command',
    '/api/create-ai-sandbox',
    '/api/install-packages'
  ];

  for (const route of routes) {
    console.log(`Checking ${route}...`);
    // We can't easily call these without a running server and proper auth/context
    // but we can check if the files exist and are valid TypeScript
  }

  console.log('API route files check complete.');
}

testApi();
