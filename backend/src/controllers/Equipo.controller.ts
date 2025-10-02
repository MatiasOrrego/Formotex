import type { Request, Response } from "express";
import * as S from '../services/Equipo.service';


export const listar = async (req: Request, res: Response) => {
    const usuario = (req as any).usuario;
    if (usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
    try {
        const equipos = await S.ListarTodos();
        return res.status(200).json(equipos);
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }

}

export const detalle = async (req: Request, res: Response) => {
    const usuario = (req as any).usuario;
    const equipoDetalle = await S.ObtenerPorId(Number(req.params.id));
    if (!equipoDetalle) {
        return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }
    if (usuario.rol !== 'admin' && equipoDetalle.ResponsableId !== usuario.sub) {
        return res.status(403).json({ mensaje: 'Acceso denegado' });
    }

    return res.status(200).json(equipoDetalle);

}

export const crear = async (req: Request, res: Response) => {
    const equipo = await S.Crear(req.body);
    return res.status(201).json(equipo);
}

export const actualizar = async (req: Request, res: Response) => {
    const usuario = (req as any).usuario;
    const equipoExistente = await S.ObtenerPorId(Number(req.params.id));    
    if (!equipoExistente) {
        return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }
    if (usuario.rol !== 'admin' && equipoExistente.ResponsableId !== usuario.sub) {
        return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
    const equipoActualizado = await S.Actualizar(Number(req.params.id), req.body);
    return res.status(200).json(equipoActualizado);
}

export const eliminar = async (req: Request, res: Response) => {
    const usuario = (req as any).usuario;
    const equipoExistente = await S.ObtenerPorId(Number(req.params.id));
    if (!equipoExistente) {
        return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }
    if (usuario.rol !== 'admin' && equipoExistente.ResponsableId !== usuario.sub) {
        return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
    await S.Eliminar(Number(req.params.id));
    return res.status(204).send();
}
