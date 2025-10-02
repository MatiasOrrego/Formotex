import { DataTypes, Model } from "sequelize";
import type { CreationOptional } from "sequelize";
import { sequelize } from "../config/db";
import { Usuario } from "./User";

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
    usuarioId?: number; 
}

interface EquipoCreacion extends Omit<EquipoAtributos, 'id' | 'estado' | 'usuarioId'> {
    id?: CreationOptional<number>;
    estado?: CreationOptional<EstadoEquipo>;
    usuarioId?: number;
}

export class Equipo extends Model<EquipoAtributos, EquipoCreacion> 
implements EquipoAtributos {
    public id!: number;
    public nombre!: string;
    public descripcion!: string;
    public ubicacion!: string;
    public estado!: EstadoEquipo;
    public usuarioId?: number;

    // Timestamps opcionales
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;   
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
    usuarioId: {
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
