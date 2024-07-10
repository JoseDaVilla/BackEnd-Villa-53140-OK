import {
    getProductsService,
    getProductByIdService,
    addProductService,
    updateProductService,
    deleteProductService
} from "../../services/productsManagerDBService.js";
import { CustomError } from "../../utils/customError.js";
import { ERROR_TYPES } from "../../utils/errorTypes.js";




export const getProducts = async (req, res, next) => {
    try {
        const products = await getProductsService(req.query);
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    const { pid } = req.params;
    try {
        const product = await getProductByIdService(pid);
        if (!product) {
            throw CustomError.createError(
                "ProductNotFoundError",
                `Producto con id ${pid} no encontrado`,
                ERROR_TYPES.PRODUCT_NOT_FOUND.message,
                ERROR_TYPES.PRODUCT_NOT_FOUND.code
            );
        }
        res.json(product);
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        next(error);
    }
};

export const addProduct = async (req, res, next) => {
    const productData = req.body;
    try {
        const newProduct = await addProductService(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error al agregar producto:", error);
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    const { pid } = req.params;
    const updateData = req.body;
    try {
        const updatedProduct = await updateProductService(pid, updateData);
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await deleteProductService(pid);
        res.json({ deletedProduct });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        next(error);
    }
};
