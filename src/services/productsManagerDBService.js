import ProductRepository from "../repository/productsRepository.js";

export const getProductsService = async (params) => {
    try {
        return await ProductRepository.getProducts(params);
    } catch (error) {
        console.log("getProductsService => ", error);
        throw error;
    }
};

export const getProductByIdService = async (pid) => {
    try {
        return await ProductRepository.getProductById(pid);
    } catch (error) {
        console.log("getProductByIdService => ", error);
        throw error;
    }
};

export const addProductService = async (productData) => {
    try {
        return await ProductRepository.addProduct(productData);
    } catch (error) {
        console.log("addProductService => ", error);
        throw error;
    }
};

export const updateProductService = async (pid, updateData) => {
    try {
        return await ProductRepository.updateProduct(pid, updateData);
    } catch (error) {
        console.log("updateProductService => ", error);
        throw error;
    }
};

export const deleteProductService = async (pid) => {
    try {
        return await ProductRepository.deleteProduct(pid);
    } catch (error) {
        console.log("deleteProductService => ", error);
        throw error;
    }
};
