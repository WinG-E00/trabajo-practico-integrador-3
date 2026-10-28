import express from "express";
import cookieParser from "cookie-parser"
import "dotenv/config";
import initServer from "./src/config/database.js"
import mainRouter from "./src/routes/routerMain.router.js";



PORT = process.env.PORT


const app = express();



//Configuracion del express
app.use(express.json())
app.use(cors());
app.use(cookieParser())


// Router
app.use('/api', mainRouter);







const iniciarServidor = async () => {

    try {

        // Conectarse a mongodb
        initServer()
        console.log("Hubo un error al intentar conectarse con mongodb")

        // Levantar servidor
        app.listen(3000, () => {
            console.log("Se levanto el servidor de express")
        })


    } catch (error) {
        
        console.log("Hubo un error al intentar levantar el servidor")

    }


}