import { verifyToken } from "../helpers/jwt.helper.js"
import { User } from "../models/user.model.js";



export const authMiddleware = async (req, res, next) => {
    try {
        
        const token = req.cookies["token"];

        if(!token) {
            return res.status(401).json({ message: "No autorizado"})
        }

        
        const decoded = verifyToken(token);

        
        const user = await User.findOne({ _id: decoded.id, deletedAt: null });
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado o dado de baja" });
        }



    } catch (error) {
        
    }
}