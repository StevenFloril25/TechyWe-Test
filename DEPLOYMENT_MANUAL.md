# 📋 Manual de Deployment - Products API
**Project**: Products API - Technical Evaluation

---

## 🚀 API Deployment

### Project Information
- **Repository**: `https://github.com/StevenFloril25/TechyWe-Test`
- **Branch**: `main` (or `dev` for development)
- **Node.js**: 18+ (recommended)
- **Framework**: NestJS
- **Database**: MySQL 8.0+
- **ORM**: TypeORM


## ⚙️ Configuration

### Environment Variables (.env)
Rename the `.env.example` file to `.env` and add the necessary settings:

```env
# Application Configuration
NODE_ENV=production
PORT=3000

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=your_user
DB_PASSWORD=your_password
DB_NAME=nest_products

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
```

### Database Setup
```sql
CREATE DATABASE nest_products CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 📊 Expected Results

### What you should see after deployment:

1. **PM2 Status**: Service running without errors
2. **API Response**: `http://localhost:3000/api` shows Swagger documentation
3. **Database**: Connected successfully
4. **Logs**: No error messages

### Test the deployment:
```bash
# Check if API is running
curl http://localhost:3000/api

# Test user registration
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🔗 API Endpoints - Technical Details

### Authentication Endpoints

#### 1. Register User
- **Method**: `POST`
- **URL**: `/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response** (200):
```json
{
  "id": "uuid-string",
  "email": "user@example.com"
}
```
- **Validation**: Email format, password min 6 chars

#### 2. Login User
- **Method**: `POST`
- **URL**: `/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response** (200):
```json
{
  "access_token": "jwt-token-string"
}
```
- **Validation**: Email/password match

#### 3. Get User Profile
- **Method**: `GET`
- **URL**: `/auth/my-profile`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response** (200):
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### 4. Update User Profile
- **Method**: `PUT`
- **URL**: `/auth/my-profile`
- **Headers**: `Authorization: Bearer <jwt_token>`, `Content-Type: application/json`
- **Body**:
```json
{
  "email": "newemail@example.com"
}
```
- **Response** (200): Updated user object

### Products Endpoints

#### 1. Get All Products
- **Method**: `GET`
- **URL**: `/products`
- **Headers**: None required
- **Response** (200):
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "stock": 10,
    "category": "Electronics",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### 2. Get Product by ID
- **Method**: `GET`
- **URL**: `/products/:id`
- **Headers**: None required
- **Response** (200): Single product object
- **Error** (404): Product not found

#### 3. Create Product
- **Method**: `POST`
- **URL**: `/products`
- **Headers**: `Authorization: Bearer <jwt_token>`, `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "stock": 10,
  "category": "Electronics"
}
```
- **Validation**:
  - `name`: Required, not empty
  - `price`: Required, positive number
  - `stock`: Optional, positive integer
  - `category`: Optional, string
  - `description`: Optional, string
- **Response** (201): Created product object
- **Error** (409): Product name already exists

#### 4. Update Product
- **Method**: `PATCH`
- **URL**: `/products/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`, `Content-Type: application/json`
- **Body**: Partial product data
```json
{
  "price": 89.99,
  "stock": 15
}
```
- **Response** (200): Updated product object
- **Error** (404): Product not found

#### 5. Delete Product
- **Method**: `DELETE`
- **URL**: `/products/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response** (204): No content
- **Error** (404): Product not found

#### 6. Get Products by Category
- **Method**: `GET`
- **URL**: `/products/category/:category`
- **Headers**: None required
- **Response** (200): Array of products in category

#### 7. Get Products in Stock
- **Method**: `GET`
- **URL**: `/products/in-stock`
- **Headers**: None required
- **Response** (200): Array of products with stock > 0

---

## 🔐 Security Details

### JWT Token Format
- **Algorithm**: HS256
- **Expiration**: 24 hours (configurable)
- **Payload**:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Protected Routes
- All `POST`, `PATCH`, `DELETE` operations on products
- User profile operations
- Requires valid JWT token in `Authorization` header

### Error Responses
```json
{
  "statusCode": 400,
  "message": ["validation error messages"],
  "error": "Bad Request"
}
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);
```

### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  category VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_category (category),
  INDEX idx_stock (stock)
);
```

---

## 🚨 Error Codes

- **200**: Success
- **201**: Created
- **204**: No Content
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **404**: Not Found
- **409**: Conflict (duplicate data)
- **500**: Internal Server Error

---

**Deployment completed! 🎉**

The API will be available at: `http://localhost:3000`
