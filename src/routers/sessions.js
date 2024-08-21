import { Router } from "express";
import passport from "passport";
import { auth } from "../middleware/auth.js";
import { login, getCurrentUser, githubLogin, githubCallback, handleError, register, logout, changeUserRole, deleteUser, uploadDocuments, } from "../services/sessionsService.js";
// import multer from "../utils/multerConfig.js"
import upload from "../utils/multerConfig.js";
const router = Router();

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/error" }),
    login
);

router.get("/current", auth([ 'admin','user', "premium"]), getCurrentUser);


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

router.get("/logout", logout);

router.put("/premium/:uid", auth(['admin','user','premium']), changeUserRole);

router.delete("/:id", auth(['admin', 'user']),deleteUser)


router.post("/:uid/documents", auth(['admin','user','premium']), upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'productsImage', maxCount: 1 },
    { name: 'Comprobante de domicilio'},
    { name: 'Identificacion' },
    { name: 'Comprobante de estado de cuenta'}
]), uploadDocuments);


// (docType === "Identificación"||docType === "Comprobante de domicilio"||docType === "Comprobante de estadod de cuenta" ) 

export default router;