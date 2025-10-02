import { body } from "express-validator";

export const validarRegistro = [
    body('email').isEmail().withMessage('El email debe ser válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('rol').optional().isIn(['admin', 'user']).withMessage('El rol debe ser admin o user')
]

export const validarLogin = [
    body('email').isEmail().withMessage('El email debe ser válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
]