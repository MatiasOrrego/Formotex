import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { rol } from '../models/User';

export interface DatosJWT {sub: string, rol: rol}

export const autenticarJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DatosJWT;
        (req as any).usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido' });
    }
}