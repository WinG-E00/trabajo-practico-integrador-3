import { body, param } from "express-validator";
import { User } from "../../models/user.model.js";


export const userIdValidation = [

    param("id")
        .isMongoId().withMessage("El id del usuario no es válido"),

];


export const updateUserValidation = [

    body("username")
        .optional()
        .trim()
        .notEmpty().withMessage("El username no puede estar vacío")
        .bail()
        .isLength({ min: 3, max: 20 }).withMessage("El username debe tener entre 3 y 20 caracteres")
        .bail()
        .isAlphanumeric().withMessage("El username solo puede contener letras y números")
        .bail()
        .custom(async (username, { req }) => {
            const usuarioEncontrado = await User.findOne({
                username,
                _id: { $ne: req.params.id },
            });

            if (usuarioEncontrado) {
                throw new Error("El username ya está en uso");
            }
        }),

    body("email")
        .optional()
        .trim()
        .notEmpty().withMessage("El email no puede estar vacío")
        .bail()
        .isEmail().withMessage("Debe ingresar un email válido")
        .bail()
        .custom(async (email, { req }) => {
            const usuarioEncontrado = await User.findOne({
                email,
                _id: { $ne: req.params.id },
            });

            if (usuarioEncontrado) {
                throw new Error("El email ya está en uso");
            }
        }),

    body("role")
        .optional()
        .isIn(["user", "admin"]).withMessage("El rol debe ser user o admin"),

    body("profile.firstName")
        .optional()
        .trim()
        .notEmpty().withMessage("El nombre no puede estar vacío")
        .bail()
        .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
        .bail()
        .isAlpha("es-ES", { ignore: " " }).withMessage("El nombre solo puede contener letras"),

    body("profile.lastName")
        .optional()
        .trim()
        .notEmpty().withMessage("El apellido no puede estar vacío")
        .bail()
        .isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres")
        .bail()
        .isAlpha("es-ES", { ignore: " " }).withMessage("El apellido solo puede contener letras"),

    body("profile.birthDate")
        .optional()
        .isISO8601().withMessage("La fecha de nacimiento debe tener un formato válido")
        .bail()
        .custom((birthDate) => {
            if (new Date(birthDate) > new Date()) {
                throw new Error("La fecha de nacimiento no puede ser futura");
            }

            return true;
        }),

    body("profile.phone")
        .optional()
        .isNumeric().withMessage("El teléfono solo puede contener números")
        .bail()
        .isLength({ min: 8, max: 15 }).withMessage("El teléfono debe tener entre 8 y 15 dígitos"),

];
