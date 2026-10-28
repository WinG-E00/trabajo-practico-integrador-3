import { Router } from "express";



const mainRouter = Router();


mainRouter.get('/test', (req, res) => {
    res.send("Ok")
    res.json("Ok")
})


export default mainRouter;