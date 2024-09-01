
import logger from "../config/logger.js";
import UserDTO from "../dao/DTOs/sessionsDTO.js";
import sessionsRepository from "../repository/sessionsRepository.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt'
import { sendEmail, sendPasswordResetEmail } from "./mailingService.js";
import fs from 'fs';
import path from 'path';
import { userModel } from "../dao/models/user.model.js";

export const login = async (req, res) => {
    try {
        await sessionsRepository.update({ _id: req.user._id }, { last_connection: new Date() });
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: "Login exitoso!", usuario: req.user });
    } catch (error) {
        logger.error("Error al actualizar la última conexión: ", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const logout = async (req, res) => {
    try {
        await sessionsRepository.update({ _id: req.user._id }, { last_connection: new Date() });
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
        res.status(200).json({message: `Usuario con id: ${req.user._id} a finalizado la sesión de manera exitosa`})
    
    } catch (error) {
        logger.error("Error al actualizar la última conexión: ", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const uploadDocuments = async (req, res) => {
    try {
        const { uid } = req.params;
        const files = req.files;
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ error: "No se han subido archivos" });
        }

        const documents = [];

        for (const key in files) {
            files[key].forEach(file => {
                documents.push({
                    name: file.fieldname,
                    reference: file.path
                });
            });
            
        }

        await sessionsRepository.update({ _id: uid }, { documents: [] });
        const updatedUser = await sessionsRepository.update({ _id: uid }, { $push: { documents: { $each: documents } } });
        return res.status(200).json({ message: "Documentos subidos exitosamente", usuario: updatedUser });

    } catch (error) {
        logger.error("Error al subir documentos: ", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};


export const changeUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await sessionsRepository.getBy({ _id: uid });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const requiredDocuments = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];
        const userDocuments = user.documents || [];

        const userDocumentNames = userDocuments.map(doc => doc.name);
        const missingDocuments = requiredDocuments.filter(doc => !userDocumentNames.includes(doc));

        if (missingDocuments.length > 0) {
            return res.status(400).json({ error: `Faltan los siguientes documentos para poder cambiar el rol: ${missingDocuments.join(", ")}` });
        }

        let newRole = '';
        if (user.rol === 'user') {
            newRole = 'premium';
        } else if (user.rol === 'premium') {
            newRole = 'user';
        } else {
            return res.status(400).json({ error: "El rol no es válido para esta operación" });
        }

        for (const document of userDocuments) {
            try {
                fs.unlinkSync(document.reference); // Eliminar archivo físico
                logger.info(`Archivo eliminado con exito  ${document.reference}: `);
            } catch (err) {
                logger.error(`Error al eliminar el archivo ${document.reference}: `, err);
            }
        }

        const updatedUser = await sessionsRepository.update(
            { _id: uid },
            { rol: newRole, documents: [] }
        );

        logger.info(`Rol del usuario ${user.email} actualizado a ${newRole}`);
        return res.status(200).json({ message: "Rol actualizado exitosamente", usuario: updatedUser });
    } catch (error) {
        logger.error("changeUserRole => ", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
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

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await sessionsRepository.deleteUser(userId);

        if (deletedUser) {
            logger.warn(`User with id ${userId} was deleted successfully`)
            return res.status(200).json({ user: "deleted user" });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        logger.error("Error en deleteUser: ", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getAllUsers = async(req,res)=>{
    try {
        const allUsers = await sessionsRepository.get()
        res.json(allUsers);
    } catch (error) {
        logger.error("Error al obtener usuarios - Error al obtener usuarios -", error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
}

export const deleteInactiveUsers = async (req, res) => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 1);

    try {
        const usersToDelete = await userModel.find({
            rol: { $ne: 'admin' },
            last_connection: { $lt: twoDaysAgo }
            // last_connection: { $lt: fiveMinutesAgo }
        });


        await userModel.deleteMany({
            _id: { $in: usersToDelete.map(user => user._id) }
        });


        usersToDelete.forEach(async (user) => {
            const subject = 'Cuenta eliminada por inactividad';
            const html = `<p>Estimado/a <b>${user.nombre}</b>,</p>
                            <p><b> Tu cuenta ha sido eliminada debido a inactividad durante los últimos 2 días.</b></p>`;
            await sendEmail(user.email, subject, html);
            logger.info(`Usuarios con correo electronico ${user.email} han sido eliminados por inactividad. Correo electronico ha sido enviado`)
        });

        res.status(200).send({ message: 'Usuarios inactivos eliminados y correos enviados.' });
    } catch (error) {
        logger.error('Error al eliminar usuarios inactivos: ', error);
        res.status(500).send({ error: 'Error al eliminar usuarios inactivos.' });
    }
};