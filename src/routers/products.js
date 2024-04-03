import {Router} from "express"
import ProductManager from "../productManager.js";



const router = Router()

router.get('/', async (req, res) => {
    const {limit} = req.query;
    console.log(limit)
    const p = new ProductManager();
    const productos = await p.getProducts(limit);
    return res.json({ productos });
});

router.get('/:pid',(req,res)=>{
    const {pid} = req.params;
    const p = new ProductManager();
    const producto = p.getProductById(Number(pid));
    console.log(pid)
    return res.json({producto});
})

router.post('/', (req,res)=>{
    const {title, description, price, thumbnails, code, stock, category, status} = req.body;
    const p = new ProductManager();
    const result = p.addProduct(title, description, price, thumbnails, code, stock, category, status)
    return res.json({result});
});

router.put('/:pid', (req,res)=>{
    const {pid} = req.params;
    const p = new ProductManager();
    const result = p.updateProduct(Number(pid), req.body)
    return res.json({result});
})

router.delete('/:pid', (req,res)=>{
    const {pid} = req.params
    const p = new ProductManager();
    const result = p.deleteProduct(Number(pid), req.body)
    return res.json({result});
})


export default router