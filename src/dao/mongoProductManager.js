import { request,response } from "express";
import { productModel } from "./models/products.js";

export const getProducts = async(req=request, res = response)=>{
    try {
        const {limit} = req.query;
        // const products= await productModel.find().limit(Number(limit));
        // const total = await productModel.countDocuments();
        //?  Para mejor optimización

        const [products, total] = await Promise.all([productModel.find().limit(Number(limit)), productModel.countDocuments()])
        return res.json({total, products});
    } catch (error) {
        console.log('getProducts => ', error)
            return res.status(500).json({msg: 'Hablar con Admin '})
    }
}

export const getProductById = async(req=request, res = response)=>{
    try {
        const{pid} = req.params;
        const product= await productModel.find(pid);
        if(!product)
            return res.status(404).json({msg:`Producto con id ${pid} no existe`})
        return res.json({product});
    } catch (error) {
        console.log('getProductById => ', error)
            return res.status(500).json({msg: 'Hablar con Admin '})
    }
}

export const addProduct = async(req=request, res = response)=>{
    try {
        const {title, description, price, thumbnails, code, stock, category, status} = req.body;
        
        if (!title, !description, !price, !code, !stock,  !category)
            return res.status (404).json({msg:'All parameters are required [title, description, price, code, stock, category]'});

        const product = await productModel.create(req.body)

        return res.json({product});

    } catch (error) {
        console.log('addProduct => ', error)
            return res.status(500).json({msg: 'Talk to an administrator'})
    }
}

export const updateProduct = async(req=request, res = response)=>{
    try {
        const {pid}= req.params;
        const {_id, ...rest} = req.body;
        const product = await productModel.findByIdAndUpdate(pid, {...rest}, {new:true});

        if (product)
            return res.json({msg: 'Product Updated', product});
        return res.status(404).json({msg:`The product with id ${pid} could not be updated`})
    } catch (error) {
        console.log('updateProduct => ', error)
            return res.status(500).json({msg: 'Talk to an administrator'})
    }
}

export const deleteProduct = async(req=request, res = response)=>{
    try {
        const {pid}= req.params;
        const product = await productModel.findByIdAndDelete(pid);
        
        if (product)
            return res.json({msg: 'Product Deleted', product});
        return res.status(404).json({msg:`The product with id ${pid} could not be deleted`})
    } catch (error) {
        console.log('deleteProduct => ', error)
            return res.status(500).json({msg: 'Talk to an administrator'})
    }
}

