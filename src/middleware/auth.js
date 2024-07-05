export const auth = (roles = []) => {
    return (req, res, next) => {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            console.log('No autenticado');
            return res.status(401).json({ message: 'No autenticado' });
        }

        const user = req.user;
        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(403).json({ message: 'Usuario no encontrado' });
        }

        if (!roles.includes(user.rol)) {
            console.log(`No autorizado: se requiere rol ${roles}`);
            return res.status(403).json({ message: 'No autorizado' });
        }

        console.log(`Autorizado: ${user.email} con rol ${user.rol}`);
        next();
    };
};
