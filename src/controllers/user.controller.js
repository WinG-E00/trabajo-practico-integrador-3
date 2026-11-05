import { matchedData } from "express-validator";
import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js";


const populateEvents = {
    path: "events",
    populate: [
        { path: "organizer", select: "_id username email" },
        { path: "categories", select: "name description" },
    ],
};


export const getAllUsers = async (req, res) => {
    try {
        const usuarios = await User.find({ deletedAt: null })
            .select("-password")
            .populate(populateEvents);

        return res.status(200).json({
            msg: "Se obtuvieron todos los usuarios correctamente",
            data: usuarios,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener los usuarios",
            error: error.message,
        });
    }
};


export const obtenerUnUsuarioPorId = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });

        const usuario = await User.findOne({ _id: id, deletedAt: null })
            .select("-password")
            .populate(populateEvents);

        if (!usuario) {
            return res.status(404).json({ msg: "El usuario buscado no existe" });
        }

        return res.status(200).json({
            msg: "Se encontró el usuario",
            data: usuario,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener el usuario",
            error: error.message,
        });
    }
};


export const actualizarUnUsuario = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const { profile, ...data } = matchedData(req, { locations: ["body"] });
        const cambios = { ...data };

        if (profile) {
            for (const [campo, valor] of Object.entries(profile)) {
                cambios[`profile.${campo}`] = valor;
            }
        }

        if (Object.keys(cambios).length === 0) {
            return res.status(400).json({ msg: "No hay cambios para actualizar" });
        }

        const usuarioActualizado = await User.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: cambios },
            { new: true, runValidators: true }
        ).select("-password");

        if (!usuarioActualizado) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        return res.status(200).json({
            msg: "Usuario actualizado correctamente",
            data: usuarioActualizado,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ msg: "El username o email ya está en uso" });
        }

        return res.status(500).json({
            msg: "Hubo un error al actualizar el usuario",
            error: error.message,
        });
    }
};


export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });

        const usuarioEliminado = await User.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: { deletedAt: new Date() } },
            { new: true, runValidators: true }
        ).select("-password");

        if (!usuarioEliminado) {
            return res.status(404).json({ msg: "No se encontró el usuario" });
        }

        const resultadoEventos = await Event.deleteMany({ organizer: id });

        return res.status(200).json({
            msg: "Se eliminó lógicamente el usuario y se eliminaron sus eventos",
            data: {
                usuario: usuarioEliminado,
                eventosEliminados: resultadoEventos.deletedCount,
            },
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Hubo un error al eliminar el usuario",
            error: error.message,
        });
    }
};
