const fs = require('fs');

// Read configuration
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Function to make HTTP request
async function ping(endpoint) {
  const startTime = Date.now();
  
  try {
    const options = {
      method: endpoint.method || 'GET',
      headers: endpoint.headers || {},
      signal: AbortSignal.timeout(config.timeout || 30000)
    };

    // Add body for POST requests
    if (endpoint.method === 'POST' && endpoint.body) {
      options.body = JSON.stringify(endpoint.body);
      // Set default Content-Type if not specified
      if (!options.headers['Content-Type']) {
        options.headers['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(endpoint.url, options);
    const duration = Date.now() - startTime;
    
    console.log(`✓ [${endpoint.name}] ${endpoint.method} ${endpoint.url}`);
    console.log(`  Status: ${response.status} ${response.statusText}`);
    console.log(`  Duration: ${duration}ms`);
    
    return {
      success: true,
      name: endpoint.name,
      status: response.status,
      duration
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(`✗ [${endpoint.name}] ${endpoint.method} ${endpoint.url}`);
    console.error(`  Error: ${error.message}`);
    console.error(`  Duration: ${duration}ms`);
    
    return {
      success: false,
      name: endpoint.name,
      error: error.message,
      duration
    };
  }
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log(`Pinger Service - ${new Date().toISOString()}`);
  console.log('='.repeat(60));
  console.log(`Total endpoints: ${config.endpoints.length}`);
  console.log('');

  const results = [];
  
  // Ping all endpoints
  for (const endpoint of config.endpoints) {
    const result = await ping(endpoint);
    results.push(result);
    console.log('');
  }

  // Summary
  console.log('='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Total: ${results.length} | Success: ${successful} | Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\nFailed endpoints:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }
  
  console.log('='.repeat(60));
  
  // Exit with error code if any pings failed
  if (failed > 0) {
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

