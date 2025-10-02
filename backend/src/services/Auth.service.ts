import { Usuario, rol } from "../models/User.js";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registrar = async (nombre: string, email: string, password: string, rolUsuario?: rol) => {
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
        throw new Error('Email ya existe');
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    return Usuario.create({ 
        nombre, 
        email, 
        password: hashPassword, 
        rol: rolUsuario || rol.USER 
    });
}

export const login = async (email: string, password: string) => {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
        throw new Error('Email no encontrado');
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
        throw new Error('Contraseña incorrecta');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET no está configurado');
    }

    const payload = { 
        sub: usuario.id.toString(),
        rol: usuario.rol,
        email: usuario.email 
    };
    
    const token = jwt.sign(
        payload, 
        jwtSecret, 
        { expiresIn: '24h' }
    );
    
    return { 
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        }, 
        token 
    };
}