import { body } from "express-validator";
import { User } from "../../models/user.model";
import mongoose from "mongoose";


export const registerValidation =  [

    body('username')
        .trim()
        .notEmpty().withMessage()
        .bail()
        .isLength({ min: 3, max: 20 }).withMessage()
        .bail()
        .isAlphanumeric().withMessage()
        .custom( async ( username) => {

            const usernameEncontrado = await mongoose.findOne({ username })

            if ( usernameEncontrado ) {
                throw new Error("El username ya esta existe")
            }

        } ),

    body('email')
        .trim()
        .notEmpty().withMessage("Falta el email")
        .bail()
        .isEmail().withMessage("Debe ser un email")
        .custom( async (email) => {

            const emailEncontrado = mongoose.findOne({ email })

            if(emailEncontrado) {
                throw new Error("El email ya esta en uso")
            }

        }  ),

    body('password')
        .trim()
        .notEmpty().withMessage("Falta el email")
        .bail()
        .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
        .withMessage("mínimo 8 caracteres, con al menos una mayúscula, una minúscula y un número."),

    
    body('role')
        .trim()
        .notEmpty().withMessage("Falta el email")
        .bail()
        .isIn(['user', 'admin'])
        .withMessage('El rol debe ser user o admin'),


    body('profile.firstName')
        .trim()
        .notEmpty().withMessage()
        .isLength({ min: 2, max: 50})
        .isAlpha("es-ES", { ignore: " " }).withMessage("frist name Solo caracteres"),
        
    body('profile.lastName')
        .trim()
        .notEmpty().withMessage()
        .isLength({ min: 2, max: 50})
        .isAlpha("es-ES", { ignore: " " }).withMessage("lastname Solo caracteres "),
    
    body('profile.birthDate')
        .trim()
        .notEmpty().withMessage()
        .isISO8601().withMessage("Formato de fecha invalido YYYY-MM-DD"),

    body("profile.phone")
        .optional()
        .isNumeric().withMessage("El teléfono solo puede contener números")
        .bail()
        .isLength({ min: 8, max: 15 }).withMessage("")

]



export const loginValidaton = [

    body("username")
        .trim()
        .notEmpty().withMessage("El username es obligatorio"),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria"),

] 



