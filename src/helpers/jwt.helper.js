import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
    try {

        return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h", // Token válido por 1 hora
        // expiresIn: process.env.JWT_EXPIRES, // Alternativa desde .env
        });

    }catch(error){
        throw new Error("Error generando el token: " + error.message);
    }
}


export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);

    } catch (error){
        throw new Error("Error al verificar el token" + error.message);
    }
}