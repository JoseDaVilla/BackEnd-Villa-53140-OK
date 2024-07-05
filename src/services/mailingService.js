import { config } from "../config/config.js";
import transporter from "../config/mailing.js";

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
