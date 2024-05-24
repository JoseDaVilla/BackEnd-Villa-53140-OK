import mongoose from "mongoose";

const URL_MONGO_DB = 'mongodb+srv://josedvilla18:ecommerce-villa@ecommerce.avwlkz3.mongodb.net/ecommerce'

export const dbConnection = async () => {
    
    try {
        await mongoose.connect(URL_MONGO_DB)
        console.log('Conexión a la base de datos exitosa')
    } catch (error) {
        console.log(`Error al levantar la base de datos ${error}`)
        process.exit(1)
    }
}
