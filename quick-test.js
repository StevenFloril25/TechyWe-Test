const http = require('http');

function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message,
        status: 0
      });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runQuickTests() {
  console.log('🚀 VERIFICACIÓN RÁPIDA DE LA API');
  console.log('='.repeat(50));

  // Test 1: Health check
  console.log('\n1. Verificando conectividad...');
  const health = await testEndpoint('/');
  console.log(`   ${health.success ? '✅' : '❌'} Health Check - Status: ${health.status}`);

  // Test 2: Swagger docs
  console.log('\n2. Verificando documentación Swagger...');
  const swagger = await testEndpoint('/api');
  console.log(`   ${swagger.success ? '✅' : '❌'} Swagger Docs - Status: ${swagger.status}`);

  // Test 3: Products endpoint
  console.log('\n3. Verificando endpoint de productos...');
  const products = await testEndpoint('/products');
  console.log(`   ${products.success ? '✅' : '❌'} Get Products - Status: ${products.status}`);

  // Test 4: Auth endpoint
  console.log('\n4. Verificando endpoint de autenticación...');
  const auth = await testEndpoint('/auth/register', 'POST', {
    email: 'test@example.com',
    password: 'password123'
  });
  console.log(`   ${auth.success ? '✅' : '❌'} Auth Register - Status: ${auth.status}`);

  console.log('\n' + '='.repeat(50));
  console.log('🎉 VERIFICACIÓN COMPLETA');
  
  if (health.success && swagger.success) {
    console.log('✅ La API está funcionando correctamente');
    console.log('🌐 Puedes acceder a:');
    console.log('   - API: http://localhost:3000');
    console.log('   - Swagger: http://localhost:3000/api');
  } else {
    console.log('❌ La API no está respondiendo correctamente');
  }
}

// Ejecutar pruebas
setTimeout(() => {
  runQuickTests();
}, 3000); // Esperar 3 segundos para que la app se inicie
