import { body, param } from "express-validator";
import { Category } from "../../models/category.model.js";


export const categoryIdValidation = [

    param("id")
        .isMongoId().withMessage("El id de la categoría no es válido"),

];


export const createCategoryValidation = [

    body("name")
        .trim()
        .notEmpty().withMessage("El nombre de la categoría es obligatorio")
        .bail()
        .isLength({ min: 2, max: 30 }).withMessage("El nombre debe tener entre 2 y 30 caracteres")
        .bail()
        .custom(async (name) => {
            const categoriaEncontrada = await Category.findOne({ name });

            if (categoriaEncontrada) {
                throw new Error("Ya existe una categoría con ese nombre");
            }
        }),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("La descripción no puede superar los 200 caracteres"),

];


export const updateCategoryValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("El nombre de la categoría no puede estar vacío")
        .bail()
        .isLength({ min: 2, max: 30 }).withMessage("El nombre debe tener entre 2 y 30 caracteres")
        .bail()
        .custom(async (name, { req }) => {
            const categoriaEncontrada = await Category.findOne({
                name,
                _id: { $ne: req.params.id },
            });

            if (categoriaEncontrada) {
                throw new Error("Ya existe una categoría con ese nombre");
            }
        }),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("La descripción no puede superar los 200 caracteres"),

];
