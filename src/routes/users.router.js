import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { actualizarUnUsuario, eliminarUsuario, getAllUsers, obtenerUnUsuarioPorId } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { updateUserValidation, userIdValidation } from "../middlewares/validators/users.validators.js";

const usersRouter =  Router()



/*

● GET /api/users → Listar los usuarios activos con el virtual populate events. (solo
admin)
● GET /api/users/:id → Obtener un usuario activo con sus eventos. (solo admin)
● PUT /api/users/:id → Actualizar un usuario. (solo admin)
● DELETE /api/users/:id → Eliminación lógica del usuario con eliminación en cascada de
sus eventos. (solo admin)

*/



usersRouter.get('/users', authMiddleware, adminMiddleware, getAllUsers);
usersRouter.get('/users/:id', authMiddleware, adminMiddleware, userIdValidation, validate, obtenerUnUsuarioPorId);
usersRouter.put('/users/:id', authMiddleware, adminMiddleware, userIdValidation, updateUserValidation, validate, actualizarUnUsuario);
usersRouter.delete('/users/:id', authMiddleware, adminMiddleware, userIdValidation, validate, eliminarUsuario);



export default usersRouter;
