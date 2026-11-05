import { Router } from "express";
import authRouter from "./auth.router.js";
import eventsRouter from "./events.router.js";
import usersRouter from "./users.router.js";
import categoriesRouter from "./categories.router.js";



const mainRouter = Router();


mainRouter.get('/test', (req, res) => {
    res.send("Ok")
    res.json("Ok")
})


mainRouter.use('/api/', authRouter);
mainRouter.use('/api/', eventsRouter )
mainRouter.use('/api/', usersRouter )
mainRouter.use('/api/', categoriesRouter )





export default mainRouter;
