import { Router } from "express";
import { authLoginController, authRegisterController, getProfile, logoutController, updateProfile } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { loginValidaton, registerValidation, updateValidation } from "../middlewares/validators/auth.validators.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const authRouter =  Router();


/*
POST /api/auth/register → Registro de usuario con perfil embebido. (público)
● POST /api/auth/login → Login con JWT enviado como cookie segura. (público)
● GET /api/auth/profile → Perfil del usuario autenticado. (usuario autenticado)
● PUT /api/auth/profile → Actualizar el perfil embebido del usuario autenticado. (usuario
autenticado)
● POST /api/auth/logout → Logout limpiando la cookie de autenticación. (usuario
autenticado)


authRouter.post('/auth',)



*/

authRouter.post('/auth/register', registerValidation , validate ,authRegisterController)
authRouter.post('/auth/login', loginValidaton , validate , authLoginController )
authRouter.get('/auth/profile', authMiddleware, getProfile);
authRouter.put('/auth/profile', authMiddleware, updateValidation, updateProfile)
authRouter.post('/auth', authMiddleware, logoutController );


