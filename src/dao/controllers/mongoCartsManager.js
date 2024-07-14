import { request, response } from "express";
import { addProductInCartService, createCartService, deleteCartService, deleteProductsInCartService, getCartByIdService, updateProductsInCartService } from "../../services/cartsServiceDB.js";
import logger from "../../config/logger.js";

export const getCartById = async (req = request, res = response) => {
    try {
        const { cid } = req.params;
        logger.debug(`getCartById => cid: ${cid}`);
        const carrito = await getCartByIdService(cid);
        if (carrito)
            return res.json({ carrito });
        return res.status(404).json({ msg: `The cart with id ${cid} does not exist` });
    } catch (error) {
        return res.status(500).json({ msg: 'Talk to an administrator' });
    }
};

export const createCart = async (req = request, res = response) => {
    try {
        logger.debug(`createCart`);
        const carrito = await createCartService();
        return res.json({ msg: 'Cart Created', carrito });
    } catch (error) {
        logger.error('createCart => ', error);
        return res.status(500).json({ msg: 'Talk to an administrator' });
    }
};

export const addProductInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;
        
        logger.debug(`addProductInCart => cid: ${cid}, pid: ${pid}`);
        const carrito = await addProductInCartService(cid, pid);
        return res.json({ msg: 'Cart updated!', carrito });
    } catch (error) {
        logger.error('addProductInCart => ', error);
        return res.status(500).json({ msg: 'Talk to an administrator' });
    }
};

export const deleteProductsInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;
        logger.debug(`deleteProductsInCart => cid: ${cid}, pid: ${pid}`);
        const carrito = await deleteProductsInCartService(cid, pid);
        let msgOk = `The product with id ${pid} was successfully deleted`;
        if (carrito)
            return res.json({ carrito, msgOk });
        return res.status(404).json({ msg: `The cart with id ${cid} does not exist` });
    } catch (error) {
        logger.error('deleteProductsInCart => ', error);
        return res.status(500).json({ msg: 'Talk to an administrator' });
    }
};

export const updateProductsInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        logger.debug(`updateProductsInCart => cid: ${cid}, pid: ${pid}, quantity: ${quantity}`);
        const carrito = await updateProductsInCartService(cid, pid, quantity);
        if (carrito)
            return res.json({ carrito });
    } catch (error) {
        logger.error('updateProductsInCart => ', error);
        return res.status(500).json({ msg: 'Talk to an administrator' });
    }
};

export const deleteCart = async (req = request, res = response) => {
    try {
        const { cid } = req.params;
        logger.debug(`deleteCart => cid: ${cid}`);
        const carrito = await deleteCartService(cid);
        if (carrito) {
            return res.json({ msg: `Products in Cart ${cid} were deleted` });
        }
        return res.status(404).json({ msg: `The cart with id ${cid} does not exist` });
    } catch (error) {
        logger.debug('deleteCart => ', error);
        return res.status(500).json({ msg: 'Talk to an administrator' });
    }
};
