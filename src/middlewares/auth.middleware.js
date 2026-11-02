import { verifyToken } from "../helpers/jwt.helper.js"
import { User } from "../models/user.model.js";



export const authMiddleware = async (req, res, next) => {
    try {
        
        const token = req.cookies["token"];

        if(!token) {
            return res.status(401).json({ message: "No autorizado"})
        }

        
        const decoded = verifyToken(token);

        
        // Se busca solo entre los usuarios que existen
        const user = await User.findOne({ _id: decoded.id, deletedAt: null });
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado o dado de baja" });
        }


        req.user = {
            id: user._id.toString(),
            username: user.username,
            role: user.role
        }

        
        next()


    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });        
    }
}