import type { NextFunction, Request, Response } from "express";

export const manejarError = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('🚨 Error capturado:', err);
    
    // Error de JSON malformado
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            error: 'JSON malformado',
            mensaje: 'El JSON enviado tiene errores de sintaxis',
            detalles: 'Verifica que tengas todas las comas, llaves y comillas correctas',
            ejemploCorreto: {
                nombre: "Juan Pérez",
                email: "juan@formotex.com", 
                password: "password123",
                rol: "admin"
            }
        });
    }
    
    // Error de validación
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Error de validación',
            mensaje: err.message,
            errores: err.errors
        });
    }
    
    // Error genérico
    res.status(err.status || 500).json({ 
        error: 'Error interno del servidor',
        mensaje: err.message || 'Algo salió mal'
    });
}
