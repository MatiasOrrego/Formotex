import { sequelize } from "../config/db";
import { Usuario } from "./User";
import { Equipo } from "./Equipo";

export const IniciarBd = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida con éxito.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};
