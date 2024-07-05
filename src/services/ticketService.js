import CartRepository from "../repository/cartRepository.js";
import productsRepository from "../repository/productsRepository.js"; 
import ticketRepository from "../repository/ticketRepository.js";


export const purchaseCartService = async (cid, email) => {
    const cart = await CartRepository.getCartById(cid);
    console.log(cid)
    if (!cart) throw new Error("Cart not found");

    let totalAmount = 0;
    const productsToBuy = [];
    const productsNotProcessed = [];

    for (const item of cart.products) {
        const product = await productsRepository.getProductById(item.pid);
        if (product.stock >= item.quantity) {
            totalAmount += product.price * item.quantity;
            productsToBuy.push(item);
            await productsRepository.updateProduct(item.pid, { stock: product.stock - item.quantity });
        } else {
            productsNotProcessed.push(item.pid);
        }
    }

    if (productsToBuy.length > 0) {
        const ticketData = {
            amount: totalAmount,
            purchaser: username
        };
        await ticketRepository.createTicket(ticketData);
    }

    cart.products = cart.products.filter(item => productsNotProcessed.includes(item.pid));
    await cart.save();

    return {
        message: "Compra procesada",
        productsNotProcessed
    };
}
