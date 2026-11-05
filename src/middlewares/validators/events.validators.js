import { body, param } from "express-validator";
import { Category } from "../../models/category.model.js";
import { Event } from "../../models/event.model.js";


const validateCategories = async (categories) => {
    if (!Array.isArray(categories)) {
        throw new Error("Las categorías deben enviarse en un array");
    }

    const idsValidos = categories.every((id) => /^[a-fA-F0-9]{24}$/.test(id));

    if (!idsValidos) {
        throw new Error("Todas las categorías deben tener un id válido");
    }

    const categoriasEncontradas = await Category.find({
        _id: { $in: categories },
    }).select("_id");

    if (categoriasEncontradas.length !== categories.length) {
        throw new Error("Una o más categorías no existen");
    }

    return true;
};


export const eventIdValidation = [

    param("id")
        .isMongoId().withMessage("El id del evento no es válido"),

];


export const createEventValidation = [

    body("title")
        .trim()
        .notEmpty().withMessage("El título es obligatorio")
        .bail()
        .isLength({ min: 3, max: 150 }).withMessage("El título debe tener entre 3 y 150 caracteres")
        .bail()
        .custom(async (title) => {
            const evento = await Event.findOne({ title });

            if (evento) {
                throw new Error("Ya existe un evento con ese título");
            }
        }),

    body("description")
        .trim()
        .notEmpty().withMessage("La descripción es obligatoria")
        .bail()
        .isLength({ min: 20 }).withMessage("La descripción debe tener al menos 20 caracteres"),

    body("startDate")
        .notEmpty().withMessage("La fecha de inicio es obligatoria")
        .bail()
        .isISO8601().withMessage("La fecha de inicio no es válida"),

    body("endDate")
        .notEmpty().withMessage("La fecha de finalización es obligatoria")
        .bail()
        .isISO8601().withMessage("La fecha de finalización no es válida")
        .bail()
        .custom((endDate, { req }) => {
            if (req.body.startDate && new Date(endDate) <= new Date(req.body.startDate)) {
                throw new Error("La fecha de finalización debe ser posterior a la fecha de inicio");
            }

            return true;
        }),

    body("capacity")
        .notEmpty().withMessage("La capacidad es obligatoria")
        .bail()
        .isInt({ min: 1 }).withMessage("La capacidad debe ser un entero mayor o igual a 1")
        .toInt(),

    body("price")
        .optional()
        .isFloat({ min: 0 }).withMessage("El precio debe ser un número mayor o igual a 0")
        .toFloat(),

    body("status")
        .optional()
        .isIn(["scheduled", "cancelled", "finished"]).withMessage("El estado del evento no es válido"),

    body("location.venue")
        .trim()
        .notEmpty().withMessage("El lugar del evento es obligatorio")
        .bail()
        .isLength({ min: 3, max: 100 }).withMessage("El lugar debe tener entre 3 y 100 caracteres"),

    body("location.address")
        .trim()
        .notEmpty().withMessage("La dirección es obligatoria")
        .bail()
        .isLength({ min: 5, max: 150 }).withMessage("La dirección debe tener entre 5 y 150 caracteres"),

    body("location.city")
        .trim()
        .notEmpty().withMessage("La ciudad es obligatoria")
        .bail()
        .isLength({ min: 2, max: 50 }).withMessage("La ciudad debe tener entre 2 y 50 caracteres"),

    body("categories")
        .optional()
        .isArray().withMessage("Las categorías deben enviarse en un array")
        .bail()
        .custom(validateCategories),

];


export const updateEventValidation = [

    body("title")
        .optional()
        .trim()
        .notEmpty().withMessage("El título no puede estar vacío")
        .bail()
        .isLength({ min: 3, max: 150 }).withMessage("El título debe tener entre 3 y 150 caracteres")
        .bail()
        .custom(async (title, { req }) => {
            const evento = await Event.findOne({
                title,
                _id: { $ne: req.params.id },
            });

            if (evento) {
                throw new Error("Ya existe un evento con ese título");
            }
        }),

    body("description")
        .optional()
        .trim()
        .notEmpty().withMessage("La descripción no puede estar vacía")
        .bail()
        .isLength({ min: 20 }).withMessage("La descripción debe tener al menos 20 caracteres"),

    body("startDate")
        .optional()
        .isISO8601().withMessage("La fecha de inicio no es válida"),

    body("endDate")
        .optional()
        .isISO8601().withMessage("La fecha de finalización no es válida")
        .bail()
        .custom((endDate, { req }) => {
            if (req.body.startDate && new Date(endDate) <= new Date(req.body.startDate)) {
                throw new Error("La fecha de finalización debe ser posterior a la fecha de inicio");
            }

            return true;
        }),

    body("capacity")
        .optional()
        .isInt({ min: 1 }).withMessage("La capacidad debe ser un entero mayor o igual a 1")
        .toInt(),

    body("price")
        .optional()
        .isFloat({ min: 0 }).withMessage("El precio debe ser un número mayor o igual a 0")
        .toFloat(),

    body("status")
        .optional()
        .isIn(["scheduled", "cancelled", "finished"]).withMessage("El estado del evento no es válido"),

    body("location.venue")
        .optional()
        .trim()
        .notEmpty().withMessage("El lugar no puede estar vacío")
        .bail()
        .isLength({ min: 3, max: 100 }).withMessage("El lugar debe tener entre 3 y 100 caracteres"),

    body("location.address")
        .optional()
        .trim()
        .notEmpty().withMessage("La dirección no puede estar vacía")
        .bail()
        .isLength({ min: 5, max: 150 }).withMessage("La dirección debe tener entre 5 y 150 caracteres"),

    body("location.city")
        .optional()
        .trim()
        .notEmpty().withMessage("La ciudad no puede estar vacía")
        .bail()
        .isLength({ min: 2, max: 50 }).withMessage("La ciudad debe tener entre 2 y 50 caracteres"),

    body("categories")
        .optional()
        .isArray().withMessage("Las categorías deben enviarse en un array")
        .bail()
        .custom(validateCategories),

];
