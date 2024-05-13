import {Router} from "express"
import { getProductsService } from "../services/productsManagerDBService.js"
import { getCartByIdService } from "../services/cartsService.js"




const router = Router()

router.get ('/',  async (req,res)  => {
    
    // const productos = await productModel.find().lean();
    const { payload } = await getProductsService({})
    return res.render('inicio', {productos:payload})
})

router.get('/realtimeproducts', (req,res)=>{
    return res.render('realTimeProducts')
})

router.get('/chat', (req,res)=>{
    return res.render('chat')
})

router.get('/products', async (req,res)=>{
    const result = await getProductsService({...req.query})
    return res.render('products', {result})
})

router.get('/cart/:cid', async (req,res)=>{
    const {cid} = req.params;
    const carrito = await getCartByIdService(cid)
    return res.render('cart', {carrito})
})


export default router