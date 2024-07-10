import { request, response } from "express";
import { cartModel } from "../models/carts.js";
import { ticketModel } from "../models/ticket.js";
import { productModel } from "../models/products.js";
import { sendEmail } from "../../services/mailingService.js";
import { CustomError } from "../../utils/customError.js";
import { ERROR_TYPES } from "../../utils/errorTypes.js";



export const createTicket = async (req = request, res = response) => {
    const { cid } = req.params;
    const user = req.user;

    try {
        //! OBTENER CARRITO CON DETALLES DE LOS PRODUCTOS
        const cart = await cartModel.findById(cid).populate('products.id');

        if (!cart) {
            CustomError.createError(
                "CartError",
                `El carrito con id ${cid} no existe`,
                ERROR_TYPES.CART_NOT_FOUND.message,
                ERROR_TYPES.CART_NOT_FOUND.code
            );
        }

        let totalPrice = 0;
        const ticketProducts = [];
        const notProcessedProducts = [];

        // ! CONSTRUCCIÓN DE LA LISTA DE PRODUCTOS Y DE LOS QUE NO FUERON PROCESADOS

        for (const item of cart.products) {
            const product = await productModel.findById(item.id._id); //? Para obtener el producto completo desde la base de datos
            const quantity = item.quantity;

            if (!product) {
                notProcessedProducts.push(item.id._id);
                continue; // ? SALTAR EN CASO DE QUE NO SE ENCUENTRE EN LA BASE DE DATOS
            }

            if (product.stock >= quantity) {
                product.stock -= quantity;
                await product.save();

                const price = product.price;
                totalPrice += price * quantity;

                //? AGREGAR LOS DETALLES DEL PRODUCTO EN UN ARRAY AL TICKET

                ticketProducts.push({
                    productId: product._id,
                    quantity,
                    price,
                    title: product.title,
                    description: product.description,
                });
            } else {
                notProcessedProducts.push(item.id._id);
            }
        }

        if (ticketProducts.length === 0) {
            CustomError.createError(
                "StockError",
                "No se pudieron procesar los productos debido a falta de stock",
                ERROR_TYPES.OUT_OF_STOCK.message,
                ERROR_TYPES.OUT_OF_STOCK.code
            );
        }

        //! CREACIÓN DEL TICKET
        const newTicket = new ticketModel({
            user: user._id,
            cart: cid,
            totalPrice,
            products: ticketProducts
        });

        //? GUARDAR EN MONGO
        await newTicket.save();

        //! LOGICA DE PRODUCTOS (PARA SABER CUALES SE PUDIERON AGREGAR Y CUALES NO)
        cart.products = cart.products.filter(item => notProcessedProducts.includes(item.id._id));
        await cart.save();

        // const emailHtml = `
        // <h1>Nueva compra realizada</h1>
        // <p>Usuario con el id ha realizado una compra </p>
        // <p>Descripción: ${user}</p>
        // <p>Precio: ${totalPrice}</p>
        // `;
        // await sendEmail('josecool_vv2010@hotmail.com', 'Nuevo Producto Agregado', emailHtml);

        return res.json({ msg: 'Ticket creado y correo enviado correctamente', ticket: newTicket, notProcessedProducts });
    } catch (error) {
        console.error('Error al crear el ticket:', error);
        return res.status(error.code || 500).json({ msg: error.message });
    }
};

export const deleteTicket = async (req = request, res = response) => {
    const { tid } = req.params;

    try {
        const ticket = await ticketModel.findByIdAndDelete(tid);

        if (!ticket) {
            CustomError.createError(
                "TicketError",
                `El ticket con id ${tid} no existe`,
                ERROR_TYPES.PRODUCT_NOT_FOUND.message,
                ERROR_TYPES.PRODUCT_NOT_FOUND.code
            );
        }

        return res.json({ msg: 'Ticket eliminado correctamente -- APTO PARA REALIZAR UNA NUEVA COMPRA', ticket });
    } catch (error) {
        console.error('Error al eliminar el ticket:', error);
        return res.status(error.code || 500).json({ msg: error.message });
    }
};
