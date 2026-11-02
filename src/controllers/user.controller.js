import { matchedData } from "express-validator";
import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js";





export const getAllUsers = async (req, res) => {

    try {
        
        const usuarios = await User.find({ deletedAt: null }).select("-password").populate('Events');

        return res.status(200).json({msg: "Se obtuvieron todos los usuarios con exito", data: usuarios})

    } catch (error) {


        return res.status(500).json({msg: "Error al obtener todos los usuarios"}, error.message);
        

    }

} 




export const obtenerUnUsuarioPorId = async (req, res) => {
    try {

        const { id } =  matchedData(req, { locations: ['params']} );
        const usuarioEncontrado = await User.find({ _id: id, deletedAt: null }).select("-password")
        
        if(!usuarioEncontrado){
            return res.status({ msg: "El usuario buscado no existe", })
        }
        return res.status(200).json({msg:"Se encontro el usuario", data: usuarioEncontrado})

    } catch (error) {

        return res.status(500).json({msg: "Error al obtener el usuario"}, error.message);

    }

}




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
    return res.status(500).json({
      msg: "Hubo un error al intentar actualizar el usuario",
      error: error.message,
    });
  }
};


// controlador de actualizar con menos logica en caso de que profile no traiga nada
/*


export const actualizarUnUsuario = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const { profile, ...data } = matchedData(req, { locations: ["body"] });

    if (Object.keys(data).length === 0 && !profile) {
      return res.status(400).json({ msg: "No hay cambios para actualizar" });
    }

    const usuario = await User.findOne({ _id: id, deletedAt: null });

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    Object.assign(usuario, data);

    if (profile) {
      Object.assign(usuario.profile, profile);
    }

    await usuario.save();

    const usuarioRespuesta = usuario.toObject();
    delete usuarioRespuesta.password;

    return res.status(200).json({
      msg: "Usuario actualizado correctamente",
      data: usuarioRespuesta,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Hubo un error al intentar actualizar el usuario",
      error: error.message,
    });
  }
};



*/






export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const fechaEliminacion = new Date();

    const usuarioEliminado = await User.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: fechaEliminacion } },
      { new: true, runValidators: true }
    )
      .select("-password")
      .populate("Events", "_id");

    if (!usuarioEliminado) {
      return res.status(404).json({ msg: "No se encontró el usuario" });
    }

    const idEventos = usuarioEliminado.Events.map((evento) => evento._id);

    const resultadoEventos = await Event.updateMany(
      { _id: { $in: idEventos }, deletedAt: null },
      { $set: { deletedAt: fechaEliminacion } },
      { runValidators: true }
    );

    return res.status(200).json({
      msg: "Se eliminó correctamente el usuario y sus eventos",
      data: {
        usuario: usuarioEliminado,
        eventosActualizados: resultadoEventos.modifiedCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Hubo un error al intentar eliminar el usuario",
      error: error.message,
    });
  }
};
