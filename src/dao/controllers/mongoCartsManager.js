import { request, response } from "express";
import { addProductInCartService, createCartService, deleteCartService, deleteProductsInCartService, getCartByIdService, updateProductsInCartService } from "../../services/cartsServiceDB.js";

export const getCartById = async (req = request, res = response) => {
    try {
        const { cid } = req.params;
        console.log(`getCartById => cid: ${cid}`);
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
        console.log(`createCart`);
        const carrito = await createCartService();
        return res.json({ msg: 'Cart Created', carrito });
    } catch (error) {
        return res.status(500).json({ msg: 'Talk to an administrator' });
    }
};

export const addProductInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;
        console.log(`addProductInCart => cid: ${cid}, pid: ${pid}`);
        const carrito = await addProductInCartService(cid, pid);
        return res.json({ msg: 'Cart updated!', carrito });
    } catch (error) {
        return res.status(500).json({ msg: 'Talk to an administrator' });
    }
};

export const deleteProductsInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;
        console.log(`deleteProductsInCart => cid: ${cid}, pid: ${pid}`);
        const carrito = await deleteProductsInCartService(cid, pid);
        let msgOk = `The product with id ${pid} was successfully deleted`;
        if (carrito)
            return res.json({ carrito, msgOk });
        return res.status(404).json({ msg: `The cart with id ${cid} does not exist` });
    } catch (error) {
        console.log('deleteProductsInCart => ', error);
        return res.status(500).json({ msg: 'Talk to an administrator' });
    }
};

export const updateProductsInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        console.log(`updateProductsInCart => cid: ${cid}, pid: ${pid}, quantity: ${quantity}`);
        const carrito = await updateProductsInCartService(cid, pid, quantity);
        if (carrito)
            return res.json({ carrito });
    } catch (error) {
        console.log('updateProductsInCart => ', error);
        return res.status(500).json({ msg: 'Talk to an administrator' });
    }
};

export const deleteCart = async (req = request, res = response) => {
    try {
        const { cid } = req.params;
        console.log(`deleteCart => cid: ${cid}`);
        const carrito = await deleteCartService(cid);
        if (carrito) {
            return res.json({ msg: `Products in Cart ${cid} were deleted` });
        }
        return res.status(404).json({ msg: `The cart with id ${cid} does not exist` });
    } catch (error) {
        console.log('deleteCart => ', error);
        return res.status(500).json({ msg: 'Talk to an administrator' });
    }
};
