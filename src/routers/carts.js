import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addProductInCart, createCart, deleteCart, deleteProductsInCart, getCartById, updateProductsInCart } from "../dao/controllers/mongoCartsManager.js";
import { createTicket, deleteTicket } from "../dao/controllers/ticketController.js";



const router = Router();

router.get('/:cid', auth(['admin', 'user']), getCartById);
router.post('/', auth(['admin', 'user']), createCart);
router.post('/:cid/product/:pid', auth(['admin', 'user']), addProductInCart);
router.delete('/:cid/products/:pid', auth(['admin', 'user']), deleteProductsInCart);
router.put('/:cid/products/:pid', auth(['admin', 'user']), updateProductsInCart);
router.delete('/:cid', auth(['admin', 'user']), deleteCart);
router.post('/:cid/purchase', auth(['user', 'admin']), createTicket )
router.delete('/delete/:tid',auth(['user', 'admin']), deleteTicket);

export default router;
