import logger from "../config/logger.js";
import CartRepository from "../repository/cartRepository.js";
import productsRepository from "../repository/productsRepository.js";

export const getCartByIdService = async (cid) => {
    try {
        
        return await CartRepository.getCartById(cid);
    } catch (error) {
        logger.error("getCartByIdService => ", error);
        throw error;
    }
};

export const createCartService = async () => {
    try {
        
        return await CartRepository.createCart();
    } catch (error) {
        logger.error("createCartService => ", error);
        throw error;
    }
};

export const addProductInCartService = async  (userId, cid, pid) => {
    try {
        
        const product = await productsRepository.getProductById(pid);

        if (product.owner.toString() === userId.toString()) {
            throw new Error("Los usuarios premium no pueden agregar sus propios productos al carrito.");
        }

        return await CartRepository.addProductToCart(cid, pid);
    } catch (error) {
        logger.error("addProductInCartService => ", error);
        throw error;
    }
};

export const deleteProductsInCartService = async (cid, pid) => {
    try {
        
        return await CartRepository.deleteProductFromCart(cid, pid);
    } catch (error) {
        logger.error("deleteProductsInCartService => ", error);
        throw error;
    }
};

export const updateProductsInCartService = async (cid, pid, quantity) => {
    try {
        
        return await CartRepository.updateProductQuantityInCart(cid, pid, quantity);
    } catch (error) {
        logger.error("updateProductsInCartService => ", error);
        throw error;
    }
};

export const deleteCartService = async (cid) => {
    try {
        return await CartRepository.deleteCart(cid);
    } catch (error) {
        logger.error("deleteCartService => ", error);
        throw error;
    }
};
