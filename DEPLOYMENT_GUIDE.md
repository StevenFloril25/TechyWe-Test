# 🚀 API Deployment Guide - Products API

**Products API (NestJS + TypeORM + MySQL + JWT)**

- **Repository**: https://github.com/StevenFloril25/TechyWe-Test
- **Branch**: `main` (o `dev` para desarrollo)
- **Pull request**: [coloca aquí el link del PR a desplegar]

---

## 📋 Steps

### a. Review & Merge

1. **Revisar el PR** indicado y merge a la rama de producción (`main`)
2. **Crear tag semántico** después del merge:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0 - Complete Products API"
   git push origin v1.0.0
   ```

### b. Access the server

Conectar por SSH al servidor destinado a la API:

```bash
ssh user@your-server-ip
```

**Verificar recursos del servidor:**
```bash
# Espacio en disco
df -h

# RAM disponible
free -h

# Conectividad a MySQL
mysql -h 127.0.0.1 -u your_user -p -e "SELECT 1;"
```

### c. Locate into the project folder

**Si el repo ya existe:**
```bash
cd /srv/products-api
git fetch --all --tags
git checkout main
git pull --ff-only
```

**Si es primera vez:**
```bash
sudo mkdir -p /srv/products-api && cd /srv/products-api
git clone https://github.com/StevenFloril25/TechyWe-Test .
```

### d. Install & Build

```bash
# Verificar Node.js (18+ recomendado)
node -v
npm -v

# Instalar dependencias
npm ci

# Build del proyecto
npm run build
```

### e. Environment variables (.env)

Crear/actualizar archivo `.env` (no commitear):

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

# CORS Configuration (opcional)
CORS_ORIGIN=*
```

**Confirmar que coincidan con la instancia MySQL productiva.**

### f. Database Setup

**Crear la base de datos si no existe:**
```sql
CREATE DATABASE nest_products CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Las tablas se crearán automáticamente** con TypeORM `synchronize: true` en desarrollo.

**Para producción, considerar migraciones:**
```bash
# Si tienes migraciones configuradas
npm run migration:run
```

### g. Start/Reload service

**Con PM2 (recomendado):**

```bash
# Instalar PM2 globalmente si no está instalado
npm install -g pm2

# Iniciar la aplicación
pm2 start dist/main.js --name products-api

# Si ya existe, recargar
pm2 reload products-api
pm2 save

# Verificar estado
pm2 status
pm2 logs products-api
```

**Con systemd (alternativa):**

Crear archivo `/etc/systemd/system/products-api.service`:

```ini
[Unit]
Description=Products API
After=network.target mysql.service

[Service]
WorkingDirectory=/srv/products-api
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /srv/products-api/dist/main.js
Restart=always
RestartSec=10
User=www-data
Group=www-data
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable products-api
sudo systemctl restart products-api
sudo systemctl status products-api
```

### h. Post-deploy checks

**1. Health/Swagger Check:**
```bash
curl http://localhost:3000/api
```
**Respuesta esperada**: Interfaz de Swagger debe cargar

**2. Health Check:**
```bash
curl http://localhost:3000/
```

**3. Auth Flow Test:**
```bash
# Registrar usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login y obtener token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**4. CRUD Test (con token):**
```bash
# Obtener productos
curl http://localhost:3000/products

# Crear producto (con token)
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"Test Product","description":"Test","price":99.99,"stock":10,"category":"Electronics"}'
```

**5. Revisar logs:**
```bash
# Con PM2
pm2 logs products-api --lines 200

# Con systemd
journalctl -u products-api -f
```

### i. Firewall / Reverse Proxy (opcional)

**Abrir puerto 3000:**
```bash
sudo ufw allow 3000
```

**O publicar detrás de NGINX:**

Crear `/etc/nginx/sites-available/products-api`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/products-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Forzar HTTPS con Let's Encrypt:**
```bash
sudo certbot --nginx -d your-domain.com
```

### j. Monitoring & Rollback

**Monitorear:**
```bash
# Con PM2
pm2 monit

# Con systemd
journalctl -u products-api -f
```

**Si hay incidentes - Rollback:**
```bash
# Ir a tag anterior
git checkout <prev_tag>

# Reinstalar y rebuild
npm ci
npm run build

# Recargar servicio
pm2 reload products-api
# o
sudo systemctl restart products-api
```

---

## 🔗 Quick Reference (Endpoints principales)

### Authentication
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` → recibe `access_token`
- `GET /auth/my-profile` (requiere token)
- `PUT /auth/my-profile` (requiere token)

### Products
- `GET /products` - Obtener todos los productos
- `GET /products/:id` - Obtener producto por ID
- `GET /products/category/:category` - Productos por categoría
- `GET /products/in-stock` - Productos en stock
- `POST /products` (requiere token) - Crear producto
- `PATCH /products/:id` (requiere token) - Actualizar producto
- `DELETE /products/:id` (requiere token) - Eliminar producto

### Header de seguridad:
```
Authorization: Bearer <token>
```

---

## ✅ Pre‑Deployment Checklist

- [ ] PR revisado, aprobado y mergeado a la rama de prod
- [ ] Tag creado y anotado
- [ ] `.env` actualizado en el servidor
- [ ] Base de datos creada y accesible
- [ ] Dependencias instaladas (`npm ci`)
- [ ] Build exitoso (`npm run build`)
- [ ] Servicio iniciado (PM2/systemd)
- [ ] Swagger accesible (`http://server:3000/api`)
- [ ] Smoke tests OK (auth + CRUD)
- [ ] Logs sin errores críticos
- [ ] Firewall/NGINX configurado (si aplica)

---

## 🚨 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verificar MySQL
sudo systemctl status mysql
mysql -u your_user -p -e "SHOW DATABASES;"
```

### Error: "Port 3000 already in use"
```bash
# Verificar qué usa el puerto
sudo netstat -tlnp | grep :3000
# o
sudo lsof -i :3000
```

### Error: "JWT_SECRET not defined"
```bash
# Verificar variables de entorno
cat .env
echo $JWT_SECRET
```

### Error: "Permission denied"
```bash
# Verificar permisos
sudo chown -R www-data:www-data /srv/products-api
sudo chmod -R 755 /srv/products-api
```

---

## 📊 Monitoring Commands

```bash
# Estado del servicio
pm2 status
# o
sudo systemctl status products-api

# Logs en tiempo real
pm2 logs products-api -f
# o
journalctl -u products-api -f

# Uso de recursos
pm2 monit
# o
htop

# Verificar endpoints
curl -f http://localhost:3000/api || echo "API down"
```

---

**¡Deployment completado! 🎉**

La API estará disponible en:
- **Local**: `http://localhost:3000`
- **Swagger**: `http://localhost:3000/api`
- **Producción**: `http://your-domain.com` (si configurado)
