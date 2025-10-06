// Configurar variables de entorno ANTES de importar Sequelize
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar dotenv buscando el .env en la raíz del proyecto
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

import { Sequelize } from 'sequelize';

// Verificar que DATABASE_URL esté disponible
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está definida en las variables de entorno. Verifica tu archivo .env');
}

// Probar con parámetros separados para diagnosticar
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'inventario_db',
  process.env.DB_USER || 'postgres', 
  process.env.DB_PASSWORD || '181222',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: console.log,  // Activar logging para ver más detalles
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
