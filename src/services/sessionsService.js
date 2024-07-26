
import logger from "../config/logger.js";
import UserDTO from "../dao/DTOs/sessionsDTO.js";
import sessionsRepository from "../repository/sessionsRepository.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt'
import { sendPasswordResetEmail } from "./mailingService.js";

export const login = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "Login exitoso!", usuario: req.user });
};


export const getCurrentUser = (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json({userDTO});
};


export const githubLogin = (req, res) => {
    console.log("GitHub login service");
};

export const githubCallback = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "Login exitoso!", usuario: req.user });
};

export const handleError = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: "Error en la operación" });
};

export const register = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "Registro exitoso!", usuario: req.user });
};

export const logout = (req, res) => {
    req.session.destroy(e => {
        if (e) {
            console.error("Error al destruir la sesión:", e);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${e.message}`
            });
        }
    });
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/login');
};

export const changeUserRole = async (req, res) => {

    // TODO Este proceso solo lo puedo hacer desde Postman y solo el Admin puede cambiar el rol del usuario usando el endpoint 
    // TODO http://localhost:3000/api/sessions/premium/:uid  (Siendo _id: uid)

    try {
        const { uid } = req.params;

        
        const user = await sessionsRepository.getBy({ _id: uid });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        let newRole = '';
        if (user.rol === 'user') {
            newRole = 'premium';
        } else if (user.rol === 'premium') {
            newRole = 'user';
        } else {
            return res.status(400).json({ error: "El rol no es válido para esta operación" });
        }

        const updatedUser = await sessionsRepository.update({ _id: uid }, { rol: newRole });
        
        logger.info(`Rol del usuario ${user.email} actualizado a ${newRole}`);
        return res.status(200).json({ message: "Rol actualizado exitosamente", usuario: updatedUser });
    } catch (error) {
        logger.error("changeUserRole => ", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await sessionsRepository.getBy({ email });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // ! TOKEN NUEVO

        const token = crypto.randomBytes(20).toString('hex');
        const expirationTime = Date.now() + 3600000; // 1 hora

        await sessionsRepository.update({ email }, {
            resetPasswordToken: token,
            resetPasswordExpires: expirationTime
        });

        // ! Enviar correo 
        const resetUrl = `http://localhost:3000/reset-password/${token}`;
        await sendPasswordResetEmail(email, resetUrl);

        return res.status(200).json({ message: "Enlace de restablecimiento enviado" });
    } catch (error) {
        logger.error("Error en requestPasswordReset: ", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // ! Aqui encuentra el usuario con el token y tiempo de expiración que se creó al solicitar el reseteo 

        const user = await sessionsRepository.getBy({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Token inválido o expirado" });
        }

        // ! Comparación de la contraseña 

        const isSamePassword = bcrypt.compareSync(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ error: "La nueva contraseña no puede ser la misma que la anterior" });
        }

        //? Hasheo de la nueva contraseña
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        //TODO Actualizamos la contraseña

        await sessionsRepository.update({ _id: user._id }, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        });

        return res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        logger.error("Error en resetPassword: ", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};