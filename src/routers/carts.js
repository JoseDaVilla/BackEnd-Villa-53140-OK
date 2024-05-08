import { Router } from "express"
import { getCartById , createCart, addProductInCart} from "../dao/mongoCartsManager.js";





const router = Router();

router.get('/:cid', getCartById)

router.post('/', createCart)

router.post('/:cid/product/:pid', addProductInCart)

export default router;