import { matchedData } from "express-validator";
import { Category } from "../models/category.model.js";
import { Event } from "../models/event.model.js";


export const crearCategoria = async (req, res) => {
    try {
        const data = matchedData(req, { locations: ["body"] });
        const categoria = await Category.create(data);

        return res.status(201).json({
            msg: "Se creó correctamente la categoría",
            data: categoria,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ msg: "Ya existe una categoría con ese nombre" });
        }

        return res.status(500).json({
            msg: "Hubo un error al crear la categoría",
            error: error.message,
        });
    }
};


export const listarCategorias = async (req, res) => {
    try {
        const categorias = await Category.find().sort({ name: 1 });

        return res.status(200).json({
            msg: "Se obtuvieron las categorías correctamente",
            data: categorias,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Hubo un error al obtener las categorías",
            error: error.message,
        });
    }
};


export const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const categoria = await Category.findById(id).populate({
            path: "events",
            populate: [
                { path: "organizer", select: "_id username email" },
                { path: "categories", select: "name description" },
            ],
        });

        if (!categoria) {
            return res.status(404).json({ msg: "No existe una categoría con ese id" });
        }

        return res.status(200).json({
            msg: "Se obtuvo correctamente la categoría",
            data: categoria,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Hubo un error al obtener la categoría",
            error: error.message,
        });
    }
};


export const actualizarCategoria = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const data = matchedData(req, { locations: ["body"] });

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ msg: "No se enviaron datos para actualizar" });
        }

        const categoriaActualizada = await Category.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!categoriaActualizada) {
            return res.status(404).json({ msg: "No existe una categoría con ese id" });
        }

        return res.status(200).json({
            msg: "Se actualizó correctamente la categoría",
            data: categoriaActualizada,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ msg: "Ya existe una categoría con ese nombre" });
        }

        return res.status(500).json({
            msg: "Hubo un error al actualizar la categoría",
            error: error.message,
        });
    }
};


export const eliminarCategoria = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const categoria = await Category.findById(id);

        if (!categoria) {
            return res.status(404).json({ msg: "No existe una categoría con ese id" });
        }

        await Event.updateMany(
            { categories: id },
            { $pull: { categories: id } }
        );

        const categoriaEliminada = await Category.findByIdAndDelete(id);

        return res.status(200).json({
            msg: "Categoría eliminada y quitada de los eventos correctamente",
            data: categoriaEliminada,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Hubo un error al eliminar la categoría",
            error: error.message,
        });
    }
};
