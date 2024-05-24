import { Router } from 'express';
import passport from 'passport';

export const router = Router()


router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/error"}), (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({payload: "Login exitoso!", usuario: req.user})
})

router.get("/github", passport.authenticate("github", {failureRedirect: "/api/sessions/error"}), (req, res)=>{
    
})

router.get("/callbackGithub", passport.authenticate("github", {failureRedirect: "/api/sessions/error"}), (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({payload: "Login exitoso!", usuario: req.user})
})

router.get("/error", (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({error: "Error en la operación"})
})

router.post("/registro", passport.authenticate("registro", {failureRedirect: "/api/sessions/error"}), (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({payload: "Registro exitoso!", usuario: req.user})
})

router.get("/logout", (req, res) => {
    req.session.destroy(e => {
        if (e) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                }
            )

        }
    })

    res.setHeader('Content-Type', 'application/json');
    res.redirect('/login')
    // return res.status(200).json({ payload: "Logout Exitoso...!!!" });
})

export default router