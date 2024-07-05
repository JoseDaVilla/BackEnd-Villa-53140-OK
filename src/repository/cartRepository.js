import { cartModel } from "../dao/models/carts.js";

class CartRepository {
    async getCartById(cid) {
        try {
            console.log(`CartRepository.getCartById => cid: ${cid}`);
            return await cartModel.findById(cid);
        } catch (error) {
            console.log('CartRepository.getCartById => ', error);
            throw error;
        }
    }

    async createCart() {
        try {
            console.log(`CartRepository.createCart`);
            return await cartModel.create({});
        } catch (error) {
            console.log('CartRepository.createCart => ', error);
            throw error;
        }
    }

    async addProductToCart(cid, pid) {
        try {
            console.log(`CartRepository.addProductToCart => cid: ${cid}, pid: ${pid}`);
            const cart = await cartModel.findById(cid);
            if (!cart) return null;

            const productInCart = cart.products.find(p => p.id.toString() === pid);
            if (productInCart) productInCart.quantity++;
            else cart.products.push({ id: pid, quantity: 1 });

            await cart.save();
            return cart;
        } catch (error) {
            console.log('CartRepository.addProductToCart => ', error);
            throw error;
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            console.log(`CartRepository.deleteProductFromCart => cid: ${cid}, pid: ${pid}`);
            const cart = await cartModel.findById(cid);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(p => p.id.toString() === pid);
            if (productIndex === -1) return null;

            cart.products.splice(productIndex, 1);
            await cart.save();
            return cart;
        } catch (error) {
            console.log('CartRepository.deleteProductFromCart => ', error);
            throw error;
        }
    }

    async updateProductQuantityInCart(cid, pid, quantity) {
        try {
            console.log(`CartRepository.updateProductQuantityInCart => cid: ${cid}, pid: ${pid}, quantity: ${quantity}`);
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
            console.log('CartRepository.updateProductQuantityInCart => ', error);
            throw error;
        }
    }

    async deleteCart(cid) {
        try {
            console.log(`CartRepository.deleteCart => cid: ${cid}`);
            const cart = await cartModel.findById(cid);
            if (!cart) return null;

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.log('CartRepository.deleteCart => ', error);
            throw error;
        }
    }
}

export default new CartRepository();
