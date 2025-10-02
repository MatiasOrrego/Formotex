import {Equipo} from "../models/Equipo";

export const ListarTodos = async () => {
    return Equipo.findAll({include: ['responsable']});
}

export const ObtenerPorId = async (id: number) => {
    return Equipo.findByPk(id, {include: ['responsable']});
}

export const Crear = async (data: Partial<Equipo>) => Equipo.create(data as any);

export const Actualizar = async (id: number, data: Partial<Equipo>) => {
    const equipo = await Equipo.findByPk(id);
    if (!equipo) throw new Error("Equipo no encontrado");
    return equipo.update(data);
}

export const Eliminar = async (id: number) => {
    const equipo = await Equipo.findByPk(id);
    if (!equipo) throw new Error("Equipo no encontrado");
    return equipo.destroy();
}
