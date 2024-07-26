import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { UsersManagerMongo as UsuariosManager } from "../dao/controllers/UserManagerDB.js";
import { createCartService } from "../services/cartsServiceDB.js";
import { generaHash, validatePassword } from "../utils.js";
import UserDTO from "../dao/DTOs/sessionsDTO.js";
import { config } from "./config.js";

const usuariosManager = new UsuariosManager();

export const initPassport = () => {
    passport.use(
        "github",
        new github.Strategy(
            {
                clientID: config.clientID,
                clientSecret: config.clientSecret,
                callbackURL: config.callbackURL,
            },
            async (ta, tr, profile, done) => {
                try {
                    
                    let email = profile._json.email;
                    let nombre = profile._json.name;
                    if (!email) {
                        return done(null, false);
                    }
                    let usuario = await usuariosManager.getBy({ email });
                    if (!usuario) {
                        usuario = await usuariosManager.create({
                            nombre, email, profile,
                        });
                        usuario = await usuariosManager.getBy({ email });
                        const carrito = await createCartService();
                        usuario.cart = carrito._id;
                        await usuariosManager.update({ email }, { cart: carrito._id });
                    }
                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "registro",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email"
            },
            async (req, username, password, done) => {
                try {
                    let { nombre, age } = req.body;
                    if (!nombre) {
                        return done(null, false);
                    }

                    let existe = await usuariosManager.getBy({ email: username });
                    if (existe) {
                        return done(null, false);
                    }

                    password = generaHash(password);

                    let usuario = await usuariosManager.create({ nombre, age, email: username, password });
                    const carrito = await createCartService();
                    usuario.cart = carrito._id;
                    await usuariosManager.update({ email: username }, { cart: carrito._id });

                    const userDTO = new UserDTO(usuario);

                    return done(null, userDTO);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done) => {
                try {
                    if (username == "adminCoder@coder.com" && password == "adminCod3r123") {
                        let usuario = {
                            _id: "664a79992bfb5d2b228a8f9", nombre: "admin", email: username,
                            carrito: { _id: "6684bcfca12ca8e5db86e2ad" }, rol: "admin"
                        }

                        return done(null, usuario);
                    }

                    let usuario = await usuariosManager.getBy({ email: username });
                    if (!usuario) {
                        return done(null, false);
                    }

                    if (!validatePassword(password, usuario.password)) {
                        return done(null, false);
                    }

                    if (!usuario.cart) {
                        const carrito = await createCartService();
                        usuario.cart = carrito._id;
                        await usuariosManager.update({ email: username }, { cart: carrito._id });
                    }

                    const userDTO = new UserDTO(usuario);
                    

                    return done(null, userDTO);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((userDTO, done) => {
        
        return done(null, userDTO._id); 
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            let usuario;
            if (id === "664a79992bfb5d2b228a8f9") {
                usuario = {
                    _id: "664a79992bfb5d2b228a8f9", nombre: "admin", email: "adminCoder@coder.com",
                    cart: { _id: "6684bcfca12ca8e5db86e2ad" }, rol: "admin"
                };
            } else {
                usuario = await usuariosManager.getBy({ _id: id });
            }
    
            
    
            if (!usuario) {
                return done(null, false); 
            }
    
            const userDTO = new UserDTO(usuario);
            
    
            return done(null, userDTO); 
        } catch (error) {
            return done(error); 
        }
    });}
