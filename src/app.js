import express from "express";
import { engine } from "express-handlebars";
import { Server } from 'socket.io';
import productsRouter from "./routers/products.js";
import cartsRouter from "./routers/carts.js";
import views from "./routers/views.js";
import __dirname from "./utils.js";
import path from "path";
// import ProductManager from "./dao/productManager.js";
import { dbConnection } from "./database/config.js";
import { productModel } from "./dao/models/products.js";
import { messageModel } from "./dao/models/messages.js";

// const p = new ProductManager(); 
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//? Establece la ruta para los archivos estáticos.
//? Error al intentar generar la ruta con __dirname a public, por eso quito el dirname y ya todo corre bien.

app.use(express.static('public'));

// Configura el motor de vistas Handlebars.
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas para la API.
app.use('/', views);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

await dbConnection();

// Aca incio el servidor HTTP.
const expressServer = app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});

// Inicia el servidor de Socket.IO en el mismo servidor HTTP.
const socketServer = new Server(expressServer);

//  Manejo las conexiones de Socket.IO.
socketServer.on('connection', async (socket) => {

    console.log('Usuario conectado desde el frontend');

    const productos = await productModel.find();

    socket.emit('productos', productos);

    socket.on('agregarProducto', async (producto) => {
        // const result = p.addProduct({...producto})
        console.log(producto)
        const newProduct = await productModel.create({ ...producto })
        if (newProduct) {
            productos.push(newProduct);
            socket.emit('productos', productos)
        }

    //? socketServer.on('deleteAllProducts', async () => {
    //     console.log('products')
    //     await productModel.deleteMany()
    // })
    });


    //* Chat server

    const messages = await messageModel.find();
    
    console.log(messages)
    socket.emit('message', messages);

    socket.on('message', async data=> {
        const newMessage = await messageModel.create({...data});
        if (newMessage) {
            
            const messages = await messageModel.find().lean();
            socketServer.emit('messageLogs', messages)
            console.log('Usuario conectado desde el frontend');
        }
    });

    socket.on('delete', async()=>{
        await messageModel.deleteMany()
        
    }
    )
    socket.broadcast.emit('nuevo_user')
})