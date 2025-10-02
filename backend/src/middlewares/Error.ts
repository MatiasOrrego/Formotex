import type { NextFunction, Request, Response } from "express";

export const manejarError = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
}
