import { request, response } from "express";
import { productModel } from "./models/products.js";
import { addProductService, deleteProductService, getProductByIdService, getProductsService, updateProductService } from "../services/productsManagerDBService.js";

export const getProducts = async (req = request, res = response) => {
    try {
        const result = await  getProductsService({...req.query})   
        return res.json( {result });

    } catch (error) {
        // return res.status(500).json({ msg: 'Hablar con Admin ' })
    }
}

export const getProductById = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const product = await getProductByIdService(pid)
        
        if (!product)
            return res.status(404).json({ msg: `Producto con id ${pid} no existe` })
        return res.json({ product });
    } catch (error) {
        console.log('getProductById => ', error)
        return res.status(500).json({ msg: 'Hablar con Admin ' })
    }
}

export const addProduct = async (req = request, res = response) => {
    try {
        const { title, description, price, code, stock, category,  } = req.body;

        
        if (!title, !description, !price, !code, !stock, !category)
            return res.status(404).json({ msg: 'All parameters are required [title, description, price, code, stock, category]' });

        const product = await addProductService({...req.body})

        return res.json({ product });

    } catch (error) {
        return res.status(500).json({ msg: 'Talk to an administrator' })
    }
}

export const updateProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const { _id, ...rest } = req.body;
        const product = await updateProductService(pid, rest);

        if (product)
            return res.json({ msg: 'Product Updated', product });
        return res.status(404).json({ msg: `The product with id ${pid} could not be updated` })
    } catch (error) {
        return res.status(500).json({ msg: 'Talk to an administrator' })
    }
}

export const deleteProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const product = await deleteProductService(pid)
        if (product)
            return res.json({ msg: 'Product Deleted', product });
        return res.status(404).json({ msg: `The product with id ${pid} could not be deleted` })
    } catch (error) {
        console.log('deleteProduct => ', error)
        return res.status(500).json({ msg: 'Talk to an administrator' })
    }
}

