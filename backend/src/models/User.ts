import { DataTypes, Model } from "sequelize";
import type { CreationOptional } from "sequelize";
import { sequelize } from "../config/db";

export enum rol {
    ADMIN = 'admin',
    USER = 'user'
}

interface UsuarioAtributos {
    id: number;
    nombre: string;
    email: string;
    password: string;
    rol: rol;
}

interface UsuarioCreacion extends Omit<UsuarioAtributos, 'id' | 'rol'> {
    id?: CreationOptional<number>;
    rol?: CreationOptional<rol>;
}

export class Usuario extends Model<UsuarioAtributos, UsuarioCreacion> 
implements UsuarioAtributos {
    public id!: number;
    public nombre!: string;
    public email!: string;
    public password!: string;
    public rol!: rol;

    // Timestamps opcionales
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Usuario.init({
id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM(...Object.values(rol)),
        allowNull: false,
        defaultValue: rol.USER
    }
}, {
    sequelize,
    tableName: 'usuarios',
    modelName: 'Usuario'
});