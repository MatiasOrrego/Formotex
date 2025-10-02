import { body } from "express-validator"

export const validarEquipo = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('ubicacion').notEmpty().withMessage('La ubicación es obligatoria'),
    body('nroSerie').notEmpty().withMessage('El número de serie es obligatorio'),
    body('estado').isIn(['activo', 'inactivo', 'mantenimiento']).withMessage('El estado debe ser activo, inactivo o mantenimiento'),
    body('responsableId').optional().isInt().withMessage('El ID del responsable debe ser un número entero')

]