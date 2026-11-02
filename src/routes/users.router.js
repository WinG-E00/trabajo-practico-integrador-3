import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { actualizarUnUsuario, eliminarUsuario, getAllUsers, obtenerUnUsuarioPorId } from "../controllers/user.controller.js";

const usersRouter =  Router()



/*

● GET /api/users → Listar los usuarios activos con el virtual populate events. (solo
admin)
● GET /api/users/:id → Obtener un usuario activo con sus eventos. (solo admin)
● PUT /api/users/:id → Actualizar un usuario. (solo admin)
● DELETE /api/users/:id → Eliminación lógica del usuario con eliminación en cascada de
sus eventos. (solo admin)

*/



usersRouter.get('/user', adminMiddleware,  getAllUsers);
usersRouter.get('users/:id',obtenerUnUsuarioPorId );
usersRouter.put('/users/:id', adminMiddleware, actualizarUnUsuario);
usersRouter.delete('/users/:id', adminMiddleware, eliminarUsuario)





