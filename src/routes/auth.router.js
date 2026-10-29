import { Router } from "express";


const authRouter =  Router();


/*
POST /api/auth/register → Registro de usuario con perfil embebido. (público)
● POST /api/auth/login → Login con JWT enviado como cookie segura. (público)
● GET /api/auth/profile → Perfil del usuario autenticado. (usuario autenticado)
● PUT /api/auth/profile → Actualizar el perfil embebido del usuario autenticado. (usuario
autenticado)
● POST /api/auth/logout → Logout limpiando la cookie de autenticación. (usuario
autenticado)

*/


authRouter.post('/auth', )
authRouter.post('/auth',)
authRouter.get('/auth',)
authRouter.put('/auth',)
authRouter.post('/auth',)
