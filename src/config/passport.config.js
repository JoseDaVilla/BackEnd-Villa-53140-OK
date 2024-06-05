import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { UsersManagerMongo as UsuariosManager } from "../dao/UserManagerDB.js";
import { createCartService } from "../services/cartsService.js";
import { generaHash, validatePassword } from "../utils.js";

const usuariosManager = new UsuariosManager();

export const initPassport = () => {
    passport.use(
        "github",
        new github.Strategy(
            {
                clientID: "Iv23liFjEWfEEEOY6BPa",
                clientSecret: "72f78552b53ac6d37db065de70c1d15131913056",
                callbackURL: "http://localhost:3000/api/sessions/callbackGithub",
            },
            async (ta, tr, profile, done) => {
                try {
                    console.log(profile);
                    let email = profile._json.email;
                    let nombre = profile._json.nombre;
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

                    return done(null, usuario);
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
                            _id: "idAdmin", nombre: "admin", email: username,
                            carrito: { _id: "6640d10f072c6b087155895c" }, rol: "admin"
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

                    delete usuario.password;
                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id);
    });

    passport.deserializeUser(async (id, done) => {
        let usuario;
        if (id === "idAdmin") {
            usuario = {
                _id: "idAdmin", nombre: "admin", email: "adminCoder@coder.com",
                carrito: { _id: "663980cad0e550982f0db3f1" }, rol: "admin"
            }
        } else {
            usuario = await usuariosManager.getBy({ _id: id });
        }
        return done(null, usuario);
    });
}
