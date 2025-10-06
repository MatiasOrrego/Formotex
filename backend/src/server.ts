import app from './app.js';
import { sequelize } from './config/db.js';
import { IniciarBd } from './models/Index.js';
import { Usuario, rol } from './models/User.js';
import bcrypt from 'bcrypt';

const PORT = process.env.PORT || 3000;


const iniciarServidor = async () => {
    try {
      
        console.log(' Conectando a la base de datos...');
        await IniciarBd();
        
        
        console.log(' Sincronizando modelos con la base de datos...');
        await sequelize.sync({ 
        });
        console.log(' Modelos sincronizados correctamente');
        
        // Crear usuario administrador por defecto
        await crearAdminPorDefecto();
        
        const server = app.listen(PORT, () => {
            console.log(` Servidor ejecutándose en puerto ${PORT}`);
            console.log(` URL: http://localhost:${PORT}`);
            console.log(` Salud del servidor: http://localhost:${PORT}/health`);
            console.log(` API Base: http://localhost:${PORT}/api`);
            console.log(` Rutas de Auth: http://localhost:${PORT}/api/auth`);
            console.log(` Rutas de Equipos: http://localhost:${PORT}/api/equipos`);
            console.log('-----------------------------------');
            console.log(` Entorno: ${process.env.NODE_ENV || 'development'}`);
        });

        const manejarCierreGraceful = (señal: string) => {
            console.log(`\n Recibida señal ${señal}. Cerrando servidor...`);
            
            server.close(async () => {
                console.log(' Servidor HTTP cerrado');
                
                try {
                    await sequelize.close();
                    console.log(' Conexión a la base de datos cerrada');
                    console.log(' Servidor cerrado correctamente');
                    process.exit(0);
                } catch (error) {
                    console.error(' Error al cerrar la conexión de la base de datos:', error);
                    process.exit(1);
                }
            });
        };

        process.on('SIGTERM', () => manejarCierreGraceful('SIGTERM'));
        process.on('SIGINT', () => manejarCierreGraceful('SIGINT'));

        process.on('unhandledRejection', (reason, promise) => {
            console.error(' Promesa rechazada no manejada:', promise, 'razón:', reason);
            process.exit(1);
        });

        process.on('uncaughtException', (error) => {
            console.error(' Excepción no capturada:', error);
            process.exit(1);
        });

    } catch (error) {
        console.error(' Error al iniciar el servidor:', error);
        
        if (error instanceof Error) {
            console.error('Mensaje:', error.message);
            console.error('Stack:', error.stack);
        }
        
        
        if ((error as any).name === 'SequelizeConnectionError') {
            console.error(' Error de conexión a la base de datos. Verifica:');
            console.error('   - Que PostgreSQL esté ejecutándose');
            console.error('   - Que las credenciales en .env sean correctas');
            console.error('   - Que la base de datos exista');
        }
        
        process.exit(1);
    }
};


/**
 * Crea un usuario administrador por defecto si no existe ninguno
 * Esto facilita el primer uso de la aplicación
 */
const crearAdminPorDefecto = async (): Promise<void> => {
    try {
        // Verificar si ya existe un administrador
        const adminExiste = await Usuario.findOne({ 
            where: { rol: rol.ADMIN } 
        });
        
        if (!adminExiste) {
            console.log(' Creando usuario administrador por defecto...');
            
            const passwordHash = await bcrypt.hash('admin123', 10);
            
            const nuevoAdmin = await Usuario.create({
                nombre: 'Administrador Formotex',
                email: 'admin@formotex.com',
                password: passwordHash,
                rol: rol.ADMIN
            });
            
            console.log(' Usuario administrador creado exitosamente!');
            console.log(' Credenciales por defecto:');
            console.log(`    Email: ${nuevoAdmin.email}`);
            console.log('    Contraseña: admin123');
            console.log('    Rol: Administrador');
            console.log('  ¡IMPORTANTE! Cambia estas credenciales en producción');
            console.log('');
        } else {
            console.log(' Usuario administrador ya existe');
        }
    } catch (error) {
        console.error(' Error al crear usuario administrador por defecto:', error);
        // No detener el servidor por este error
    }
};


// Ejecutar el servidor
iniciarServidor().catch((error) => {
    console.error(' Error fatal al iniciar el servidor:', error);
    process.exit(1);
});

export default app;
