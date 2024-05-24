import { Router } from "express"
import { getProductsService } from "../services/productsManagerDBService.js"
import { getCartByIdService } from "../services/cartsService.js"
import { auth } from "../middleware/auth.js"




const router = Router()

router.get('/',auth, async (req, res) => {

    const { payload } = await getProductsService({})
    return res.render('inicio', { productos: payload })
})

router.get('/realtimeproducts',auth,  (req, res) => {
    return res.render('realTimeProducts')
})

router.get('/chat', (req, res) => {
    return res.render('chat')
})

router.get('/products', auth, async (req, res) => {
    const result = await getProductsService({ ...req.query })
    return res.render('products', { result })
})

router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;
    const carrito = await getCartByIdService(cid)
    return res.render('cart', { carrito })
})

router.get('/registro',(req,res)=>{

    res.status(200).render('register')
})

router.get('/login',(req,res)=>{

    let {error}=req.query

    res.status(200)
    return res.render('login', {error})
})


export default router