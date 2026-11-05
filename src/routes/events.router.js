import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { actualizarEventosYcategorias, crearEvent, eliminarEvento, listarEventos, listarEventosDelUsuario, listarEventosPorId } from "../controllers/events.controller.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdmin.middleware.js";
import { validate } from "../middlewares/validate.js";
import { createEventValidation, eventIdValidation, updateEventValidation } from "../middlewares/validators/events.validators.js";

const eventsRouter =  Router();

/*

● POST /api/events → Crear un evento con sus categorías; el organizador es el usuario
autenticado. (usuario autenticado)
● GET /api/events → Listar los eventos con populate de organizer y categories. (usuario
autenticado)
● GET /api/events/my → Listar los eventos del usuario logueado. (usuario autenticado)
● GET /api/events/:id → Obtener un evento con populate de organizer y categories.
(usuario autenticado)
● PUT /api/events/:id → Actualizar un evento y sus categorías. (solo organizador o
admin)
● DELETE /api/events/:id → Eliminación física de un evento. (solo organizador o
admin)
G
*/


eventsRouter.post('/events', authMiddleware, createEventValidation, validate, crearEvent);
eventsRouter.get('/events/', authMiddleware, listarEventos);
eventsRouter.get('/events/my', authMiddleware,  listarEventosDelUsuario);
eventsRouter.get('/events/:id', authMiddleware, eventIdValidation, validate, listarEventosPorId);
eventsRouter.put('/events/:id', authMiddleware, eventIdValidation, updateEventValidation, validate, ownerOrAdminMiddleware, actualizarEventosYcategorias);
eventsRouter.delete('/events/:id', authMiddleware, eventIdValidation, validate, ownerOrAdminMiddleware, eliminarEvento);



export default eventsRouter;
