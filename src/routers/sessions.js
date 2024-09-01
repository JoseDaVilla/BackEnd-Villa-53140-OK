import { Router } from "express";
import passport from "passport";
import { auth } from "../middleware/auth.js";
import { login, getCurrentUser, githubLogin, githubCallback, handleError, register, logout, changeUserRole, deleteUser, uploadDocuments, getAllUsers, deleteInactiveUsers, } from "../services/sessionsService.js";
// import multer from "../utils/multerConfig.js"
import upload from "../utils/multerConfig.js";
import { userModel } from "../dao/models/user.model.js";
import { sendEmail } from "../services/mailingService.js";
import logger from "../config/logger.js";
const router = Router();

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/error" }),
    login
);

router.get("/current", auth(['admin', 'user', "premium"]), getCurrentUser);


router.get("/github", passport.authenticate("github", { failureRedirect: "/api/sessions/error" }),
    githubLogin
);

router.get("/callbackGithub", passport.authenticate("github", { failureRedirect: "/api/sessions/error" }),
    githubCallback
);

router.get("/error", handleError);

router.post("/registro", passport.authenticate("registro", { failureRedirect: "/api/sessions/error" }),
    register
);

router.get('/usuarios', getAllUsers)

router.get("/logout", logout);

router.put("/premium/:uid", auth(['admin', 'user', 'premium']), changeUserRole);

router.delete("/:id", auth(['admin', 'user']), deleteUser)


router.post("/:uid/documents", auth(['admin', 'user', 'premium']), upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'productsImage', maxCount: 1 },
    { name: 'Comprobante de domicilio' },
    { name: 'Identificacion' },
    { name: 'Comprobante de estado de cuenta' }
]), uploadDocuments);

// router.delete('/usuarios/inactivos', async (req, res) => {
//     const twoDaysAgo = new Date();
//     twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

//     const fiveMinutesAgo = new Date();
//     fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

//     try {
//         const usersToDelete = await userModel.find({
//             rol: { $ne: 'admin' },
//             last_connection: { $lt: twoDaysAgo }
//             // last_connection: { $lt: fiveMinutesAgo }
//         });

//         await userModel.deleteMany({
//             _id: { $in: usersToDelete.map(user => user._id) }
//         });

//         usersToDelete.forEach(async (user) => {
//             const subject = 'Cuenta eliminada por inactividad';
//             const html = `<p>Estimado/a <b>${user.nombre}</b>,</p>
//                             <p><b> Tu cuenta ha sido eliminada debido a inactividad durante los últimos 2 días.</b></p>`;
//             await sendEmail(user.email, subject, html);
//             logger.info(`Usuarios con correo electronico ${user.email} han sido eliminados por inactividad. Correo electronico ha sido enviado`)
//         });

//         res.status(200).send({ message: 'Usuarios inactivos eliminados y correos enviados.' });
//     } catch (error) {
//         logger.error('Error al eliminar usuarios inactivos: ', error);
//         res.status(500).send({ error: 'Error al eliminar usuarios inactivos.' });
//     }
// });

// TODO TEST DE ELIMINAR USUARIOS INACTIVOS

router.delete('/usuarios/inactivos', deleteInactiveUsers);


export default router;
