import {
    getProductsService,
    getProductByIdService,
    addProductService,
    updateProductService,
    deleteProductService
} from "../../services/productsManagerDBService.js";

export const getProducts = async (req, res) => {
    try {
        const products = await getProductsService(req.query);
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ message: "Error al obtener productos", error });
    }
};

export const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await getProductByIdService(pid);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).json({ message: "Error al obtener producto por ID", error });
    }
};

export const addProduct = async (req, res) => {
    const productData = req.body;
    try {
        const newProduct = await addProductService(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ message: "Error al agregar producto", error });
    }
};

export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    const updateData = req.body;
    try {
        const updatedProduct = await updateProductService(pid, updateData);
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ message: "Error al actualizar producto", error });
    }
};

export const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await deleteProductService(pid);
        res.json({deletedProduct});
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ message: "Error al eliminar producto", error });
    }
};
