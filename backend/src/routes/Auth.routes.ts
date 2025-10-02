import { Router } from "express";
import { autenticarJWT } from "../middlewares/Auth.js";
import * as AuthController from "../controllers/Auth.controller.js";
import { validarCampos } from "../utils/Validacion.js";
import { requiereRol } from "../middlewares/Roles.js";
import { validarRegistro, validarLogin } from "../validators/Auth.validators.js";
import { rol } from "../models/User.js";

export const RoutesAuth = Router();

// Solo administradores pueden registrar nuevos usuarios
RoutesAuth.post('/register', 
    validarRegistro, 
    validarCampos, 
    autenticarJWT, 
    requiereRol(rol.ADMIN), 
    AuthController.registrar
);

// Login público
RoutesAuth.post('/login', 
    validarLogin, 
    validarCampos, 
    AuthController.login
);