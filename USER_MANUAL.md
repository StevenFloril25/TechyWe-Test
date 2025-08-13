# 📚 Manual de Usuario - Products API

## 🎯 ¿Qué es esta API?

Esta es una **API RESTful** para gestionar productos con autenticación JWT. Te permite:
- ✅ Crear, leer, actualizar y eliminar productos
- ✅ Registrarte e iniciar sesión
- ✅ Gestionar tu perfil de usuario
- ✅ Buscar productos por categoría o stock

---

## 🚀 Inicio Rápido

### 1. Verificar que la API esté funcionando
```bash
GET http://localhost:3000/api
```
**Respuesta esperada**: Interfaz de Swagger (documentación interactiva)

### 2. Registrar un usuario
```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "tuemail@ejemplo.com",
  "password": "tucontraseña123"
}
```

### 3. Iniciar sesión
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "tuemail@ejemplo.com",
  "password": "tucontraseña123"
}
```

---

## 🔐 Autenticación

### ¿Qué es JWT?
JWT (JSON Web Token) es como un "carnet de identidad digital" que te permite acceder a funciones protegidas.

### Cómo obtener tu token JWT:

#### Paso 1: Registrarte
```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "usuario@ejemplo.com"
}
```

#### Paso 2: Iniciar sesión
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

#### Paso 3: Usar el token
Guarda el `access_token` y úsalo en el header `Authorization`:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📦 Gestión de Productos

### Ver todos los productos
```http
GET http://localhost:3000/products
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "iPhone 15 Pro",
    "description": "Último iPhone con características avanzadas",
    "price": 999.99,
    "stock": 50,
    "category": "Electronics",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Ver un producto específico
```http
GET http://localhost:3000/products/1
```

### Buscar productos por categoría
```http
GET http://localhost:3000/products/category/Electronics
```

### Ver productos en stock
```http
GET http://localhost:3000/products/in-stock
```

### Crear un nuevo producto (Requiere autenticación)
```http
POST http://localhost:3000/products
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json

{
  "name": "MacBook Pro M3",
  "description": "Laptop profesional con chip M3",
  "price": 1999.99,
  "stock": 25,
  "category": "Electronics"
}
```

### Actualizar un producto (Requiere autenticación)
```http
PATCH http://localhost:3000/products/1
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json

{
  "price": 1899.99,
  "stock": 20
}
```

### Eliminar un producto (Requiere autenticación)
```http
DELETE http://localhost:3000/products/1
Authorization: Bearer <tu_token_jwt>
```

---

## 👤 Gestión de Perfil

### Ver mi perfil (Requiere autenticación)
```http
GET http://localhost:3000/auth/my-profile
Authorization: Bearer <tu_token_jwt>
```

**Respuesta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "usuario@ejemplo.com",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Actualizar mi perfil (Requiere autenticación)
```http
PUT http://localhost:3000/auth/my-profile
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json

{
  "email": "nuevoemail@ejemplo.com"
}
```

---

## 🛠️ Cómo usar con Postman

### Configuración inicial:

1. **Crear una nueva colección** llamada "Products API"
2. **Configurar variables de entorno**:
   - `base_url`: `http://localhost:3000`
   - `jwt_token`: (se llenará automáticamente)

### Configurar el token automáticamente:

1. **En el request de login**, ve a la pestaña "Tests"
2. **Agrega este código**:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("jwt_token", response.access_token);
}
```

3. **En requests protegidos**, usa en el header:
```
Authorization: Bearer {{jwt_token}}
```

### Ejemplo de colección en Postman:

#### 1. Auth - Register
- **Method**: POST
- **URL**: `{{base_url}}/auth/register`
- **Body**: 
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

#### 2. Auth - Login
- **Method**: POST
- **URL**: `{{base_url}}/auth/login`
- **Body**: 
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- **Tests**: (código para guardar token)

#### 3. Get All Products
- **Method**: GET
- **URL**: `{{base_url}}/products`

#### 4. Create Product
- **Method**: POST
- **URL**: `{{base_url}}/products`
- **Headers**: `Authorization: Bearer {{jwt_token}}`
- **Body**: 
```json
{
  "name": "Test Product",
  "description": "This is a test product",
  "price": 99.99,
  "stock": 10,
  "category": "Electronics"
}
```

---

## 📋 Códigos de Respuesta

### Respuestas exitosas:
- **200 OK**: Operación completada correctamente
- **201 Created**: Recurso creado exitosamente
- **204 No Content**: Operación exitosa sin contenido (DELETE)

### Errores comunes:
- **400 Bad Request**: Datos inválidos o faltantes
- **401 Unauthorized**: Token JWT inválido o faltante
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto (ej: email ya existe)

### Ejemplo de error:
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "price must be a positive number"
  ],
  "error": "Bad Request"
}
```

---

## 🔍 Validaciones

### Para crear/actualizar productos:
- **name**: Requerido, no puede estar vacío
- **price**: Requerido, debe ser un número positivo
- **stock**: Opcional, debe ser un número entero positivo
- **category**: Opcional, texto libre
- **description**: Opcional, texto libre

### Para registro/login:
- **email**: Requerido, formato de email válido
- **password**: Requerido, mínimo 6 caracteres

### Para actualizar perfil:
- **email**: Opcional, formato de email válido

---

## 💡 Consejos y Mejores Prácticas

### 1. Gestión de tokens:
- **Guarda el token** después del login
- **El token expira** en 24 horas
- **Si recibes 401**, haz login nuevamente

### 2. Manejo de errores:
- **Siempre verifica** los códigos de respuesta
- **Lee los mensajes de error** para entender qué pasó
- **Usa validaciones** antes de enviar datos

### 3. Organización:
- **Usa colecciones** en Postman para organizar requests
- **Configura variables** para URLs y tokens
- **Documenta** tus requests con descripciones

### 4. Testing:
- **Prueba primero** los endpoints públicos
- **Luego prueba** los endpoints protegidos
- **Verifica** que las respuestas sean correctas

---

## 🚨 Solución de Problemas

### La API no responde:
1. Verifica que esté corriendo: `http://localhost:3000/api`
2. Revisa los logs del servidor
3. Verifica la configuración de la base de datos

### Error 401 Unauthorized:
1. Verifica que el token esté en el header
2. Asegúrate de que el token no haya expirado
3. Haz login nuevamente para obtener un nuevo token

### Error 400 Bad Request:
1. Revisa el formato de los datos enviados
2. Verifica que todos los campos requeridos estén presentes
3. Asegúrate de que los tipos de datos sean correctos

### Error 404 Not Found:
1. Verifica que la URL sea correcta
2. Asegúrate de que el ID del recurso exista
3. Revisa la documentación de endpoints

---

## 📞 Soporte

Si tienes problemas o preguntas:

1. **Revisa la documentación Swagger**: `http://localhost:3000/api`
2. **Verifica los logs** del servidor
3. **Consulta este manual** de usuario
4. **Contacta al equipo** de desarrollo

---

## 🎉 ¡Listo para usar!

Ahora tienes todo lo necesario para usar la API de productos. Recuerda:

- ✅ **Registrarte** antes de usar funciones protegidas
- ✅ **Guardar el token JWT** después del login
- ✅ **Usar el token** en el header Authorization
- ✅ **Verificar respuestas** y manejar errores
- ✅ **Organizar** tus requests en Postman

¡Disfruta usando la API! 🚀
