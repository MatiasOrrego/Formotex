import { Router } from "express";
import * as Eq from "../controllers/Equipo.controller.js";
import { autenticarJWT } from "../middlewares/Auth.js";
import { requiereRol } from "../middlewares/Roles.js";
import { rol } from "../models/User.js";
import {validarEquipo} from "../validators/Equipo.validators.js";

export const RoutesEquipo = Router();

RoutesEquipo.use(autenticarJWT);

RoutesEquipo.get('/', Eq.listar);
RoutesEquipo.get('/:id', Eq.detalle);

RoutesEquipo.post('/', requiereRol(rol.ADMIN), validarEquipo, Eq.crear);
RoutesEquipo.put('/:id', validarEquipo, Eq.actualizar);
RoutesEquipo.delete('/:id', Eq.eliminar);