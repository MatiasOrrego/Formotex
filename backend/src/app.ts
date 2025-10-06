import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { RoutesAuth } from './routes/Auth.routes.js';
import { RoutesEquipo } from './routes/Equipo.routes.js';

import { manejarError } from './middlewares/Error.js';


const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

const apiPrefix = process.env.API_PREFIX || '/api';

app.use(`${apiPrefix}/auth`, RoutesAuth);
app.use(`${apiPrefix}/equipos`, RoutesEquipo);

// Middleware 404 para rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.originalUrl} no existe`,
        availableRoutes: {
            auth: `${apiPrefix}/auth`,
            equipos: `${apiPrefix}/equipos`,
            health: '/health'
        }
    });
});

app.use(manejarError);

export default app;
