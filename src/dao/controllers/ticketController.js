import { request, response } from "express";
import { cartModel } from "../models/carts.js";
import { ticketModel } from "../models/ticket.js";
import { productModel } from "../models/products.js";
import { sendEmail } from "../../services/mailingService.js";
import { CustomError } from "../../utils/customError.js";
import { ERROR_TYPES } from "../../utils/errorTypes.js";
import logger from "../../config/logger.js";

export const createTicket = async (req = request, res = response) => {
    const { cid } = req.params;
    const user = req.user;

    try {
        if (!user) {
            logger.error("Usuario no autenticado");
            return res.status(401).json({ msg: "Usuario no autenticado" });
        }

        logger.debug("Usuario autenticado", user);

        const cart = await cartModel.findById(cid).populate('products.id');

        if (!cart) {
            logger.error(`El carrito con id ${cid} no existe`);
            CustomError.createError(
                "CartError",
                `El carrito con id ${cid} no existe`,
                ERROR_TYPES.CART_NOT_FOUND.message,
                ERROR_TYPES.CART_NOT_FOUND.code
            );
        }

        logger.debug("Carrito encontrado", cart);

        let totalPrice = 0;
        const ticketProducts = [];
        const notProcessedProducts = [];

    
        for (const item of cart.products) {
            logger.debug("Procesando producto en el carrito", item);

            try {
                const product = await productModel.findById(item.id._id);
                const quantity = item.quantity;

                if (!product) {
                    logger.warn(`Producto con id ${item.id._id} no encontrado`);
                    notProcessedProducts.push(item.id._id);
                    continue; 
                }

                logger.debug("Producto encontrado", product);

                if (product.stock >= quantity) {
                    product.stock -= quantity;
                    await product.save();

                    const price = product.price;
                    totalPrice += price * quantity;


                    ticketProducts.push({
                        productId: product._id,
                        quantity,
                        price,
                        title: product.title,
                        description: product.description,
                    });

                    logger.debug("Producto agregado al ticket", {
                        productId: product._id,
                        quantity,
                        price,
                        title: product.title,
                        description: product.description,
                    });
                } else {
                    logger.warn(`Producto con id ${item.id._id} no tiene suficiente stock`);
                    notProcessedProducts.push(item.id._id);
                }
            } catch (error) {
                logger.error(`Error al procesar producto con id ${item.id._id}: ${error.message}`);
                notProcessedProducts.push(item.id._id);
            }
        }

        if (ticketProducts.length === 0) {
            logger.error("No se pudieron procesar los productos debido a falta de stock");
            CustomError.createError(
                "StockError",
                "No se pudieron procesar los productos debido a falta de stock",
                ERROR_TYPES.OUT_OF_STOCK.message,
                ERROR_TYPES.OUT_OF_STOCK.code
            );
        }


        const newTicket = new ticketModel({
            user: user._id,
            cart: cid,
            totalPrice,
            products: ticketProducts
        });


        await newTicket.save();

        logger.debug("Ticket creado y guardado en la base de datos", newTicket);

        cart.products = cart.products.filter(item => notProcessedProducts.includes(item.id._id));
        await cart.save();

        logger.debug("Carrito actualizado después de crear el ticket", cart);

        return res.json({ msg: 'Ticket creado y correo enviado correctamente', ticket: newTicket, notProcessedProducts });
    } catch (error) {
        logger.error('Error al crear el ticket:', error);
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
        logger.error('Error al eliminar el ticket:', error);
        return res.status(error.code || 500).json({ msg: error.message });
    }
};
