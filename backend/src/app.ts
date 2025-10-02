import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Importar rutas
import { RoutesAuth } from './routes/Auth.routes.js';
import { RoutesEquipo } from './routes/Equipo.routes.js';

// Importar middlewares
import { manejarError } from './middlewares/Error.js';

// Crear aplicación Express
const app = express();

// Middlewares de seguridad
app.use(helmet());

// Configurar CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta de salud del servidor
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Configurar rutas de la API
const apiPrefix = process.env.API_PREFIX || '/api';
const apiVersion = process.env.API_VERSION || 'v1';

app.use(`${apiPrefix}/${apiVersion}/auth`, RoutesAuth);
app.use(`${apiPrefix}/${apiVersion}/equipos`, RoutesEquipo);

// Ruta 404 para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.originalUrl} no existe`,
        availableRoutes: {
            auth: `${apiPrefix}/${apiVersion}/auth`,
            equipos: `${apiPrefix}/${apiVersion}/equipos`,
            health: '/health'
        }
    });
});

// Middleware de manejo de errores (debe ir al final)
app.use(manejarError);

export default app;
