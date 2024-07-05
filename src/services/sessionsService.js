
import UserDTO from "../dao/DTOs/sessionsDTO.js";

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
