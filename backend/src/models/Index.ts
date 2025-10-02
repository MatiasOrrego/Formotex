import { sequelize } from "../config/db.js";
import { Usuario } from "./User.js";
import { Equipo } from "./Equipo.js";

export const IniciarBd = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida con éxito.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};
