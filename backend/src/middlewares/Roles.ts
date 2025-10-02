import type { Request, Response, NextFunction } from "express";
import { rol } from "../models/User";

export const requiereRol = (...rolesPermitidos: rol[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const usuario = (req as any).usuario;
        if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }
        next();
    }
}