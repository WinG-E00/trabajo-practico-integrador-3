import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { actualizarCategoria, crearCategoria, eliminarCategoria, listarCategorias, obtenerCategoriaPorId } from "../controllers/categories.controller.js";
import { validate } from "../middlewares/validate.js";
import { categoryIdValidation, createCategoryValidation, updateCategoryValidation } from "../middlewares/validators/categories.validators.js";

const categoriesRouter =  Router()

/*
Categories:
Listo● POST /api/categories → Crear una categoría. (solo admin) Listo
Listo● GET /api/categories → Listar las categorías. (usuario autenticado)
En proceso ● GET /api/categories/:id → Obtener una categoría con el virtual populate events.
(usuario autenticado)
● PUT /api/categories/:id → Actualizar una categoría. (solo admin)
● DELETE /api/categories/:id → Eliminar una categoría con eliminación en cascada.
(solo admin)
*/


categoriesRouter.post('/categories', authMiddleware, adminMiddleware, createCategoryValidation, validate, crearCategoria);
categoriesRouter.get('/categories/', authMiddleware,listarCategorias);
categoriesRouter.get('/categories/:id', authMiddleware, categoryIdValidation, validate, obtenerCategoriaPorId);
categoriesRouter.put('/categories/:id', authMiddleware, adminMiddleware, categoryIdValidation, updateCategoryValidation, validate, actualizarCategoria);
categoriesRouter.delete('/categories/:id', authMiddleware, adminMiddleware, categoryIdValidation, validate, eliminarCategoria);


export default categoriesRouter;
