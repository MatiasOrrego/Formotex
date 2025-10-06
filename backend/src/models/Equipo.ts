import { DataTypes, Model } from "sequelize";
import type { CreationOptional } from "sequelize";
import { sequelize } from "../config/db.js";
import { Usuario } from "./User.js";

export enum EstadoEquipo {
    DISPONIBLE = 'disponible',
    ASIGNADO = 'asignado',
    MANTENIMIENTO = 'mantenimiento',
    BAJA = 'baja'
}

interface EquipoAtributos {
    id: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    estado: EstadoEquipo;
    ResponsableId: number; 
}

interface EquipoCreacion extends Omit<EquipoAtributos, 'id' | 'estado' | 'ResponsableId'> {
    id?: CreationOptional<number>;
    estado?: CreationOptional<EstadoEquipo>;
    ResponsableId?: number;
}

export class Equipo extends Model<EquipoAtributos, EquipoCreacion> 
implements EquipoAtributos {
    declare id: number;
    declare nombre: string;
    declare descripcion: string;
    declare ubicacion: string;
    declare estado: EstadoEquipo;
    declare ResponsableId: number;

    // Timestamps opcionales
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;   
}

Equipo.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM(...Object.values(EstadoEquipo)),
        allowNull: false,
        defaultValue: EstadoEquipo.DISPONIBLE
    },
    ResponsableId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Usuario,
            key: 'id'
        }
    }
}, {
    sequelize,
    tableName: 'equipos',
    modelName: 'Equipo'
});
