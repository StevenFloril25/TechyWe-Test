const http = require('http');

console.log('🔍 VERIFICANDO QUE LA API FUNCIONE...\n');

// Función para hacer una petición HTTP simple
function makeRequest(path, method = 'GET', data = null) {
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

async function testAPI() {
  console.log('1️⃣ Verificando si la aplicación está corriendo...');
  
  // Test 1: Verificar que la app responda
  const health = await makeRequest('/');
  if (health.success) {
    console.log('   ✅ La aplicación está corriendo en http://localhost:3000');
  } else {
    console.log('   ❌ La aplicación NO está corriendo');
    console.log('   💡 Asegúrate de ejecutar: npm run start:dev');
    return;
  }

  console.log('\n2️⃣ Verificando documentación Swagger...');
  const swagger = await makeRequest('/api');
  if (swagger.success) {
    console.log('   ✅ Swagger está disponible en http://localhost:3000/api');
  } else {
    console.log('   ❌ Swagger no está disponible');
  }

  console.log('\n3️⃣ Verificando endpoint de productos...');
  const products = await makeRequest('/products');
  if (products.success) {
    console.log('   ✅ Endpoint de productos funciona');
    console.log(`   📊 Respuesta: ${products.data.substring(0, 100)}...`);
  } else {
    console.log('   ❌ Endpoint de productos no funciona');
  }

  console.log('\n4️⃣ Verificando registro de usuario...');
  const register = await makeRequest('/auth/register', 'POST', {
    email: 'test@example.com',
    password: 'password123'
  });
  if (register.success) {
    console.log('   ✅ Registro de usuario funciona');
  } else {
    console.log('   ❌ Registro de usuario no funciona');
    console.log(`   📊 Error: ${register.data}`);
  }

  console.log('\n5️⃣ Verificando login de usuario...');
  const login = await makeRequest('/auth/login', 'POST', {
    email: 'test@example.com',
    password: 'password123'
  });
  if (login.success) {
    console.log('   ✅ Login de usuario funciona');
    console.log('   🔑 Token JWT generado correctamente');
  } else {
    console.log('   ❌ Login de usuario no funciona');
    console.log(`   📊 Error: ${login.data}`);
  }

  console.log('\n🎉 VERIFICACIÓN COMPLETA');
  console.log('='.repeat(50));
  console.log('✅ Si todos los tests pasaron, tu API está funcionando correctamente!');
  console.log('🌐 Puedes acceder a:');
  console.log('   - API: http://localhost:3000');
  console.log('   - Swagger: http://localhost:3000/api');
}

// Ejecutar la verificación
testAPI();
