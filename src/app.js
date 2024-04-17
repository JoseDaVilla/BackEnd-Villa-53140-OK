import express from "express";
import { engine } from "express-handlebars";
import { Server } from 'socket.io';
import productsRouter from "./routers/products.js";
import cartsRouter from "./routers/carts.js";
import views from "./routers/views.js";
import __dirname from "./utils.js"; // Importa __dirname desde utils.js
import path from "path"; 
import ProductManager from "./productManager.js";

const p = new ProductManager(); 
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! Establece la ruta para los archivos estáticos.
//! Error al intentar generar la ruta con __dirname a public, por eso quito el dirname y ya todo corre bien.

app.use(express.static('public'));

//! Configura el motor de vistas Handlebars.
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//! Rutas para la API.
app.use('/', views);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// //! Ruta para la página de inicio.
// app.get('/', (req, res) => {
//     return res.render('inicio');
// });

//! Aca incio el servidor HTTP.
const expressServer = app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});

//! Inicia el servidor de Socket.IO en el mismo servidor HTTP.
const socketServer = new Server(expressServer);

// ! Manejo las conexiones de Socket.IO.
socketServer.on('connection', socket => {
    console.log('Usuario conectado desde el frontend');
    const productos = p.getProducts()
    socket.emit('productos' , productos);

    socket.on('agregarProducto', producto=>{
        const result = p.addProduct({...producto})
        console.log(result)
    })
});

