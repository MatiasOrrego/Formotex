#  **Formotex - Sistema de Gestión de Equipos**

##  **Características Principales**

- ✅ **Autenticación JWT** con roles de usuario (Admin/User)
- ✅ **CRUD completo** para gestión de equipos
- ✅ **Base de datos PostgreSQL** 
- ✅ **Usuario administrador automático** al primer inicio
- ✅ **TypeScript** para desarrollo

---

##  **Inicio Rápido**

### **Prerrequisitos**
- Node.js
- PostgreSQL
- Git

### **Instalación**

1. **Clonar el repositorio**
```bash
git clone https://github.com/MatiasOrrego/Formotex.git
cd Formotex/backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
```sql
-- En PostgreSQL
CREATE DATABASE "Inventario_db";
```

4. **Configurar variables de entorno**
```bash
# Esto se encuentra en el .env.example de igual manera
DB_NAME=Inventario_db
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=tu_jwt_secret_super_seguro_aqui
PORT=3000
NODE_ENV=development
```

5. **Compilar y ejecutar**
```bash
npm run build
npm start
```

### **¡Listo!** 
El servidor se iniciará en `http://localhost:3000` y creará automáticamente un usuario administrador:

```
👑 Usuario Administrador (Creado automáticamente)
📧 Email: admin@formotex.com
🔑 Contraseña: admin123
⚠️  Cambiar credenciales en producción
```

---

##  **Estructura del Proyecto**

```
Formotex/
├── backend/
│   ├── src/
│   │   ├── controllers/    
│   │   │   ├── Auth.controller.ts
│   │   │   └── Equipo.controller.ts
│   │   ├── models/       
│   │   │   ├── User.ts
│   │   │   ├── Equipo.ts
│   │   │   └── Index.ts
│   │   ├── routes/         
│   │   │   ├── Auth.routes.ts
│   │   │   └── Equipo.routes.ts
│   │   ├── services/      
│   │   │   ├── Auth.service.ts
│   │   │   └── Equipo.service.ts
│   │   ├── middlewares/   
│   │   │   ├── Auth.ts
│   │   │   ├── Error.ts
│   │   │   └── Roles.ts
│   │   ├── validators/   
│   │   │   ├── Auth.validators.ts
│   │   │   └── Equipo.validators.ts
│   │   ├── config/         
│   │   │   └── db.ts
│   │   ├── utils/        
│   │   │   └── Validacion.ts
│   │   ├── app.ts          
│   │   └── server.ts       
│   ├── dist/             
│   ├── package.json
│   └── tsconfig.json
└── README.md             
```

---

##  **Scripts Disponibles**

```bash
# Desarrollo con recarga automática
npm run dev

# Compilar TypeScript
npm run build

# Iniciar en producción
npm start

# Limpiar archivos compilados
npm run clean
```

---

##  **Ejemplos de Uso**

### **1. Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@formotex.com",
    "password": "admin123"
  }'
```

### **2. Crear Equipo**
```bash
curl -X POST http://localhost:3000/api/equipos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "nombre": "Dell OptiPlex 7070",
    "descripcion": "PC de escritorio para desarrollo",
    "ubicacion": "Sala de Desarrollo - Escritorio 5"
  }'
```

### **3. Listar Equipos**
```bash
curl -X GET http://localhost:3000/api/equipos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

##  **Sistema de Roles**


 **Admin** : ✅ Crear, leer, actualizar y eliminar equipos<br>✅ Registrar nuevos usuarios<br>✅ Acceso total a la API 
 
 **User** : ✅ Ver lista de equipos<br>✅ Ver detalles de equipos<br>❌ Crear/modificar equipos 

---

##  **Estados de Equipos**

Los equipos pueden tener los siguientes estados:

-  **`disponible`** - Equipo listo para usar (estado por defecto)
-  **`en_uso`** - Equipo actualmente en uso
-  **`mantenimiento`** - Equipo en mantenimiento
-  **`fuera_de_servicio`** - Equipo no operativo

---

### **Producción**
```bash
# Compilar
npm run build

# Iniciar
npm start
```

### **Error de Compilación TypeScript**
```bash
# Limpiar y recompilar
npm run clean
npm run build

# Verificar versión de Node.js
node --version  # Debe ser >= 18
```
---
