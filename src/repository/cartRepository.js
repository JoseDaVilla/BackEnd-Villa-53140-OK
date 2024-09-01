import logger from "../config/logger.js";
import { cartModel } from "../dao/models/carts.js";

class CartRepository {
    async getCartById(cid) {
        try {
            return await cartModel.findById(cid).populate('products.id').lean();
        } catch (error) {
            logger.error('CartRepository.getCartById => ', error);
            throw error;
        }
    }

    async createCart() {
        try {
            return await cartModel.create({});
        } catch (error) {
            logger.error('CartRepository.createCart => ', error);
            throw error;
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) return null;

            const productInCart = cart.products.find(p => p.id.toString() === pid);
            if (productInCart) productInCart.quantity++;
            else cart.products.push({ id: pid, quantity: 1 });

            await cart.save();
            return cart;
        } catch (error) {
            logger.error('CartRepository.addProductToCart => ', error);
            throw error;
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) return null;
            console.log(cart)

            const productIndex = cart.products.findIndex(p => p.id.toString() === pid);
            console.log(productIndex)
            if (productIndex === -1) return null;

            cart.products.splice(productIndex, 1);
            await cart.save();
            return cart;
        } catch (error) {
            logger.error('CartRepository.deleteProductFromCart => ', error);
            throw error;
        }
    }

    async updateProductQuantityInCart(cid, pid, quantity) {
        try {
            if (!quantity || !Number.isInteger(quantity)) {
                throw new Error('La propiedad quantity es requerida y debe ser un número entero');
            }
            const cart = await cartModel.findOneAndUpdate(
                { _id: cid, 'products.id': pid },
                { $set: { 'products.$.quantity': quantity } },
                { new: true }
            );
            if (!cart) return null;
            return cart;
        } catch (error) {
            logger.error('CartRepository.updateProductQuantityInCart => ', error);
            throw error;
        }
    }

    async deleteCart(cid) {
        try {

            const cart = await cartModel.findById(cid);
            if (!cart) return null;

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            logger.error('CartRepository.deleteCart => ', error);
            throw error;
        }
    }
}

export default new CartRepository();
