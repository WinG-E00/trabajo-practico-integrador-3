import { matchedData } from "express-validator";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { comparePassword, hashPassword } from "../helpers/bcrypt.helper.js";



export const authRegisterController = async (req , res) => {
    
    try{

        const { username, email, role, password ,profile  } = matchedData(req);

        const passwordHasheada = await hashPassword(password)
        const usuarioCreado = await User.create({ username, email, password: passwordHasheada ,role, profile });

        const newUser = { passwordGuardada, ...user } = usuarioCreado.toJSON();



        return res.status(201).json({"msg": "Usuario creado con exito", "data":user})
    }catch(err){

        console.log(err);
        return res.status(500).json({
            msg: "Error interno del servidor",
        });

    }



};


export const authLoginController = async (req, res) => {
    try{

        const { username, password } = matchedData(req);

        const user = await User.findOne({username, deletedAt: null });
        
        if(!user){
            return res.status(401).json({ "msg": "Credenciales invalidas"})
        }

        const matchPassword = comparePassword(password, user.password)
        
        if(!matchPassword){
            return res.status(401).json({ "msg": "Credenciales invalidas"})
        }


        //General el token
        const token = generateToken({
            id: user._id,
            username: user.username,
            role: user.role,
        });


        //Guardar el token en el cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000*60*60
        });

        return res.status(200).json({ "msg": "Login Exitoso" })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            msg: "Error interno en el servidor"
        })
    }
}






export const getProfile = async () => {

}