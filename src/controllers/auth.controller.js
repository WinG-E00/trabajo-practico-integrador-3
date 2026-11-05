import { matchedData } from "express-validator";
import { User } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";


const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
};


export const authRegisterController = async (req, res) => {
    try {
        const { username, email, role, password, profile } = matchedData(req, {
            locations: ["body"],
        });

        const passwordHasheada = await hashPassword(password);
        const usuarioCreado = await User.create({
            username,
            email,
            password: passwordHasheada,
            role,
            profile,
        });

        const usuarioSeguro = usuarioCreado.toObject();
        delete usuarioSeguro.password;

        return res.status(201).json({
            msg: "Usuario creado con éxito",
            data: usuarioSeguro,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ msg: "El username o email ya está en uso" });
        }

        return res.status(500).json({
            msg: "Error interno del servidor",
            error: error.message,
        });
    }
};


export const authLoginController = async (req, res) => {
    try {
        const { username, password } = matchedData(req, {
            locations: ["body"],
        });

        const usuario = await User.findOne({ username, deletedAt: null });

        if (!usuario) {
            return res.status(401).json({ msg: "Credenciales inválidas" });
        }

        const passwordValida = await comparePassword(password, usuario.password);

        if (!passwordValida) {
            return res.status(401).json({ msg: "Credenciales inválidas" });
        }

        const token = generateToken({
            id: usuario._id,
            username: usuario.username,
            role: usuario.role,
        });

        res.cookie("token", token, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 60,
        });

        return res.status(200).json({ msg: "Login exitoso" });
    } catch (error) {
        return res.status(500).json({
            msg: "Error interno del servidor",
            error: error.message,
        });
    }
};


export const getProfile = async (req, res) => {
    try {
        const usuario = await User.findOne({
            _id: req.user.id,
            deletedAt: null,
        })
            .select("-password")
            .populate({
                path: "events",
                match: { deletedAt: null },
                select: "title description startDate endDate capacity status price location categories",
                populate: [
                    { path: "organizer", select: "_id username email" },
                    { path: "categories", select: "name description" },
                ],
            });

        if (!usuario) {
            return res.status(404).json({ msg: "No se encontró el usuario" });
        }

        return res.status(200).json({
            msg: "Se obtuvo el perfil correctamente",
            data: usuario,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Error interno del servidor",
            error: error.message,
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { profile = {} } = matchedData(req, {
            locations: ["body"],
        });

        if (Object.keys(profile).length === 0) {
            return res.status(400).json({
                msg: "No se enviaron datos del perfil para actualizar",
            });
        }

        const cambios = Object.fromEntries(
            Object.entries(profile).map(([campo, valor]) => [`profile.${campo}`, valor])
        );

        const usuarioActualizado = await User.findOneAndUpdate(
            { _id: req.user.id, deletedAt: null },
            { $set: cambios },
            { new: true, runValidators: true }
        ).select("-password");

        if (!usuarioActualizado) {
            return res.status(404).json({ msg: "No se encontró el usuario" });
        }

        return res.status(200).json({
            msg: "Se actualizó el perfil correctamente",
            data: usuarioActualizado.profile,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Error interno del servidor",
            error: error.message,
        });
    }
};


export const logoutController = async (req, res) => {
    try {
        res.clearCookie("token", cookieOptions);

        return res.status(200).json({ msg: "Logout realizado con éxito" });
    } catch (error) {
        return res.status(500).json({
            msg: "Error interno del servidor",
            error: error.message,
        });
    }
};
