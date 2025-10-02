// Configurar variables de entorno ANTES que cualquier otra importación
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar dotenv para que busque el .env en la raíz del proyecto
const envPath = join(__dirname, '..', '.env');
console.log('🔍 Buscando .env en:', envPath);
dotenv.config({ path: envPath });

// Debug de variables de entorno
console.log('🔧 Variables de entorno cargadas:');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado ✅' : 'No encontrado ❌');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'Configurado ✅' : 'No encontrado ❌');
console.log('   PORT:', process.env.PORT || 'No configurado');

import app from './app.js';
import { sequelize } from './config/db.js';
import { IniciarBd } from './models/Index.js';

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor
const iniciarServidor = async () => {
    try {
        // Conectar a la base de datos
        console.log('🔗 Conectando a la base de datos...');
        await IniciarBd();
        
        // Sincronizar modelos con la base de datos
        console.log('🔄 Sincronizando modelos con la base de datos...');
        await sequelize.sync({ 
            // alter: true // Usa esto en desarrollo para actualizar tablas
            // force: true // ⚠️ CUIDADO: Esto elimina y recrea todas las tablas
        });
        console.log('✅ Modelos sincronizados correctamente');
        
        // Iniciar servidor HTTP
        const server = app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`📊 Salud del servidor: http://localhost:${PORT}/health`);
            console.log(`🔧 API Base: http://localhost:${PORT}/api/v1`);
            console.log(`🔐 Rutas de Auth: http://localhost:${PORT}/api/v1/auth`);
            console.log(`📦 Rutas de Equipos: http://localhost:${PORT}/api/v1/equipos`);
            console.log('-----------------------------------');
            console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
        });

        // Manejar cierre graceful del servidor
        const manejarCierreGraceful = (señal: string) => {
            console.log(`\n📡 Recibida señal ${señal}. Cerrando servidor...`);
            
            server.close(async () => {
                console.log('🔌 Servidor HTTP cerrado');
                
                try {
                    await sequelize.close();
                    console.log('🗄️ Conexión a la base de datos cerrada');
                    console.log('👋 Servidor cerrado correctamente');
                    process.exit(0);
                } catch (error) {
                    console.error('❌ Error al cerrar la conexión de la base de datos:', error);
                    process.exit(1);
                }
            });
        };

        // Escuchar señales de cierre
        process.on('SIGTERM', () => manejarCierreGraceful('SIGTERM'));
        process.on('SIGINT', () => manejarCierreGraceful('SIGINT'));

        // Manejar errores no capturados
        process.on('unhandledRejection', (reason, promise) => {
            console.error('🚨 Promesa rechazada no manejada:', promise, 'razón:', reason);
            process.exit(1);
        });

        process.on('uncaughtException', (error) => {
            console.error('🚨 Excepción no capturada:', error);
            process.exit(1);
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        
        if (error instanceof Error) {
            console.error('Mensaje:', error.message);
            console.error('Stack:', error.stack);
        }
        
        // Detalles específicos de errores de base de datos
        if ((error as any).name === 'SequelizeConnectionError') {
            console.error('🗄️ Error de conexión a la base de datos. Verifica:');
            console.error('   - Que PostgreSQL esté ejecutándose');
            console.error('   - Que las credenciales en .env sean correctas');
            console.error('   - Que la base de datos exista');
        }
        
        process.exit(1);
    }
};

// Función para crear un usuario administrador por defecto (solo en desarrollo)
const crearAdminPorDefecto = async () => {
    try {
        const { Usuario, rol } = await import('./models/User.js');
        
        const adminExiste = await Usuario.findOne({ where: { rol: rol.ADMIN } });
        
        if (!adminExiste && process.env.NODE_ENV === 'development') {
            console.log('👤 Creando usuario administrador por defecto...');
            
            const bcrypt = await import('bcrypt');
            const passwordHash = await bcrypt.hash('admin123', 10);
            
            await Usuario.create({
                nombre: 'Administrador',
                email: 'admin@formotex.com',
                password: passwordHash,
                rol: rol.ADMIN
            });
            
            console.log('✅ Usuario administrador creado:');
            console.log('   📧 Email: admin@formotex.com');
            console.log('   🔑 Contraseña: admin123');
            console.log('   ⚠️  ¡Cambia estas credenciales en producción!');
        }
    } catch (error) {
        console.error('❌ Error al crear usuario administrador:', error);
    }
};

// Ejecutar cuando se llame directamente este archivo
if (require.main === module) {
    iniciarServidor().then(() => {
        // Crear admin por defecto después de que el servidor esté listo
        setTimeout(crearAdminPorDefecto, 1000);
    });
}

export default app;
