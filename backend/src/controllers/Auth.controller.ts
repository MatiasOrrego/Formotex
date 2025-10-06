import type {Request, Response} from 'express';
import * as S from '../services/Auth.service.js';

export const registrar = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const usuario = await S.registrar(nombre, email, password, rol);
        return res.status(201).json(usuario);
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        console.log('🔐 Intento de login:');
        console.log('   Email:', email);
        console.log('   Password recibido:', password ? 'SÍ' : 'NO');
        
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email y contraseña son requeridos',
                recibido: { email: !!email, password: !!password }
            });
        }

        const resultado = await S.login(email, password);
        return res.status(200).json(resultado);
    } catch (error) {
        console.error('❌ Error en login:', (error as Error).message);
        return res.status(400).json({ error: (error as Error).message });
    }
}
