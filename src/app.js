import express from "express";
import { engine } from "express-handlebars";
import { Server } from 'socket.io';
import productsRouter from "./routers/products.js";
import cartsRouter from "./routers/carts.js";
import views from "./routers/views.js";
import sessionsRouter from "./routers/sessions.js"
import __dirname from "./utils.js";
import path from "path";
import sessions from 'express-session'
import { dbConnection } from "./database/config.js";
import { messageModel } from "./dao/models/messages.js";
import { addProductService, getProductsService } from "./services/productsManagerDBService.js";
import { auth } from "./middleware/auth.js";
import { initPassport } from "./config/passport.config.js";
import passport from "passport";


// const p = new ProductManager(); 
const app = express();
const PORT = 3000;
const URL_MONGO_DB = 'mongodb+srv://josedvilla18:ecommerce-villa@ecommerce.avwlkz3.mongodb.net/ecommerce'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//? Establece la ruta para los archivos estáticos.
//? Error al intentar generar la ruta con __dirname a public, por eso quito el dirname y ya todo corre bien.

app.use(express.static('public'));

app.use(sessions({

    secret: '22Dntoasm2',
    resave: true,
    saveUninitialized: true
}))

initPassport()
app.use(passport.initialize())

app.use(passport.session()) //? Only for sessions used

// Configura el motor de vistas Handlebars.
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas para la API.
app.use('/', views);
app.use('/api/products',auth, productsRouter);
app.use('/api/carts',auth, cartsRouter);


app.use("/api/sessions", sessionsRouter)


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

    const {payload} = await getProductsService({})
    const productos = payload;
    socket.emit('productos', payload);

    socket.on('agregarProducto', async (producto) => {
        
        console.log(producto)
        const newProduct = await addProductService({...producto})
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