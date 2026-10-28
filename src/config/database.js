import mongoose from "mongoose";
import 'dotenv/config';


URI= process.env.MONGODB_URI;




const initServer = async () => {
    try {
    
        await mongoose.connect(URI)
        console.log("Se conecto a la base de datos de mongodb")
    
    } catch (error) {
        console.log("Hubo un error al intentar conectarse a la base de datos")
    }
}




export default initServer;