import { matchedData } from "express-validator";
import { Category } from "../models/category.model.js";
import { Event } from "../models/event.model.js";


const populateEvent = (query) => query
    .populate("organizer", "_id username email")
    .populate("categories", "name description");


const validateCategoryIds = async (categoryIds) => {
    if (!categoryIds || categoryIds.length === 0) {
        return true;
    }

    const categories = await Category.find({ _id: { $in: categoryIds } }).select("_id");
    return categories.length === categoryIds.length;
};


const buildEventChanges = (data) => {
    const changes = { ...data };

    if (changes.location) {
        const { location, ...eventFields } = changes;
        const locationFields = Object.fromEntries(
            Object.entries(location).map(([field, value]) => [`location.${field}`, value])
        );

        return { ...eventFields, ...locationFields };
    }

    return changes;
};


export const crearEvent = async (req, res) => {
    try {
        const data = matchedData(req, { locations: ["body"] });
        const categories = data.categories ?? [];

        if (!(await validateCategoryIds(categories))) {
            return res.status(400).json({ msg: "Una o más categorías no existen" });
        }

        const evento = await Event.create({
            ...data,
            categories,
            organizer: req.user.id,
        });

        return res.status(201).json({
            msg: "Evento creado correctamente",
            data: evento,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ msg: "Ya existe un evento con ese título" });
        }

        return res.status(500).json({
            msg: "Hubo un error al crear el evento",
            error: error.message,
        });
    }
};


export const listarEventos = async (req, res) => {
    try {
        const eventos = await populateEvent(Event.find());

        return res.status(200).json({
            msg: "Se obtuvieron los eventos correctamente",
            data: eventos,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Hubo un error al obtener los eventos",
            error: error.message,
        });
    }
};


export const listarEventosDelUsuario = async (req, res) => {
    try {
        const eventos = await populateEvent(Event.find({ organizer: req.user.id }));

        return res.status(200).json({
            msg: "Se obtuvieron los eventos del usuario correctamente",
            data: eventos,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Hubo un error al obtener los eventos del usuario",
            error: error.message,
        });
    }
};


export const listarEventosPorId = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const evento = await populateEvent(Event.findById(id));

        if (!evento) {
            return res.status(404).json({ msg: "No se encontró el evento" });
        }

        return res.status(200).json({
            msg: "Se obtuvo el evento correctamente",
            data: evento,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Hubo un error al obtener el evento",
            error: error.message,
        });
    }
};


export const actualizarEventosYcategorias = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const data = matchedData(req, { locations: ["body"] });
        const changes = buildEventChanges(data);

        if (Object.keys(changes).length === 0) {
            return res.status(400).json({ msg: "No se enviaron datos para actualizar" });
        }

        if (Object.hasOwn(data, "categories") && !(await validateCategoryIds(data.categories))) {
            return res.status(400).json({ msg: "Una o más categorías no existen" });
        }

        const eventoActual = await Event.findById(id);
        if (!eventoActual) {
            return res.status(404).json({ msg: "No se encontró el evento" });
        }

        const fechaInicio = changes.startDate ?? eventoActual.startDate;
        const fechaFin = changes.endDate ?? eventoActual.endDate;

        if (new Date(fechaFin) <= new Date(fechaInicio)) {
            return res.status(400).json({
                msg: "La fecha de finalización debe ser posterior a la fecha de inicio",
            });
        }

        const eventoActualizado = await Event.findByIdAndUpdate(
            id,
            { $set: changes },
            { new: true, runValidators: true }
        );

        if (!eventoActualizado) {
            return res.status(404).json({ msg: "No se encontró el evento" });
        }

        await eventoActualizado.populate([
            { path: "organizer", select: "_id username email" },
            { path: "categories", select: "name description" },
        ]);

        return res.status(200).json({
            msg: "Evento actualizado correctamente",
            data: eventoActualizado,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ msg: "Ya existe un evento con ese título" });
        }

        return res.status(500).json({
            msg: "Hubo un error al actualizar el evento",
            error: error.message,
        });
    }
};


export const eliminarEvento = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const eventoEliminado = await Event.findByIdAndDelete(id);

        if (!eventoEliminado) {
            return res.status(404).json({ msg: "No se encontró el evento" });
        }

        return res.status(200).json({
            msg: "Evento eliminado correctamente",
            data: eventoEliminado,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Hubo un error al eliminar el evento",
            error: error.message,
        });
    }
};
