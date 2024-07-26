import { config } from "../config/config.js";
import transporter from "../config/mailing.js";
import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: config.USER,
            to,
            subject,
            html,
        });
        console.log('Email enviado: ', info.messageId);
    } catch (error) {
        console.error('Error al enviar email: ', error);
    }
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: email,
            from: config.EMAIL_USER,
            subject: "Restablecimiento de contraseña",
            text: `Estás recibiendo este correo porque tú (o alguien más) ha solicitado restablecer la contraseña de tu cuenta.\n\n
                Por favor, haz clic en el siguiente enlace o cópialo y pégalo en tu navegador para completar el proceso:\n\n
                ${resetUrl}\n\n
                Si no solicitaste este cambio, por favor ignora este correo y tu contraseña permanecerá igual.\n`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error enviando el correo de restablecimiento: ", error);
    }
};