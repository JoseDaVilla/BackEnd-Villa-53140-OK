import { request, response } from "express";
import { cartModel } from "./models/carts.js";
import { addProductInCartService, createCartService, deleteCartService, deleteProductsInCartService, getCartByIdService, updateProductsInCartService } from "../services/cartsService.js";

export const getCartById = async (req = request, res = response) => {
    try {
        const { cid } = req.params;
        const carrito = await getCartByIdService(cid)
        if (carrito)
            return res.json({ carrito });
        return res.status(404).json({ msg: `The cart with id ${cid} does not exist` })
    } catch (error) {

        return res.status(500).json({ msg: 'Talk to an administrator' })
    }
}

export const createCart = async (req = request, res = response) => {
    try {
        const carrito = await createCartService({})
        return res.json({ msg: 'Cart Created', carrito })

    } catch (error) {
        return res.status(500).json({ msg: 'Talk to an administrator' })
    }
}

export const addProductInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;
        const carrito = await addProductInCartService(cid, pid)
        return res.json({ msg: 'Cart updated!', carrito })

    } catch (error) {
        return res.status(500).json({ msg: 'Talk to an administrator' })
    }
}

export const deleteProductsInCart = async (req = request, res = response) => {
    try {
        const { cid, pid} = req.params;

        const carrito = await deleteProductsInCartService(cid, pid)
        let msgOk = `The product with id ${pid} was succesfully deleted` 
        if (carrito)
            return res.json({ carrito, msgOk });
        return res.status(404).json({ msg: `The cart with id ${cid} does not exist` })

    } catch (error) {
        console.log('deleteProductsInCart => ', error)
        return res.status(500).json({ msg: 'Talk to an administrator' })

    }
}



export const updateProductsInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const carrito = await updateProductsInCartService(cid, pid, quantity)

        if (carrito) 
            return res.json({carrito})
    } catch (error) {
        console.log('updateProductsInCart => ', error)
        return res.status(500).json({ msg: 'Talk to an administrator' })

    }
}


export const deleteCart = async (req = request, res = response) => {
    try {
        const { cid } = req.params;
        const deleteCart =  deleteCartService(cid)

        if (deleteCart) {
            return res.json({msg: `Products in Cart ${cid} were deleted`})
        }

    } catch (error) {
        console.log('deleteCart => ', error)
        return res.status(500).json({ msg: 'Talk to an administrator' })

    }
}