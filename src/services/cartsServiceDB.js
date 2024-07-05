import CartRepository from "../repository/cartRepository.js";

export const getCartByIdService = async (cid) => {
    try {
        console.log(`getCartByIdService => cid: ${cid}`);
        return await CartRepository.getCartById(cid);
    } catch (error) {
        console.log("getCartByIdService => ", error);
        throw error;
    }
};

export const createCartService = async () => {
    try {
        console.log(`createCartService`);
        return await CartRepository.createCart();
    } catch (error) {
        console.log("createCartService => ", error);
        throw error;
    }
};

export const addProductInCartService = async (cid, pid) => {
    try {
        console.log(`addProductInCartService => cid: ${cid}, pid: ${pid}`);
        return await CartRepository.addProductToCart(cid, pid);
    } catch (error) {
        console.log("addProductInCartService => ", error);
        throw error;
    }
};

export const deleteProductsInCartService = async (cid, pid) => {
    try {
        console.log(`deleteProductsInCartService => cid: ${cid}, pid: ${pid}`);
        return await CartRepository.deleteProductFromCart(cid, pid);
    } catch (error) {
        console.log("deleteProductsInCartService => ", error);
        throw error;
    }
};

export const updateProductsInCartService = async (cid, pid, quantity) => {
    try {
        console.log(`updateProductsInCartService => cid: ${cid}, pid: ${pid}, quantity: ${quantity}`);
        return await CartRepository.updateProductQuantityInCart(cid, pid, quantity);
    } catch (error) {
        console.log("updateProductsInCartService => ", error);
        throw error;
    }
};

export const deleteCartService = async (cid) => {
    try {
        console.log(`deleteCartService => cid: ${cid}`);
        return await CartRepository.deleteCart(cid);
    } catch (error) {
        console.log("deleteCartService => ", error);
        throw error;
    }
};
