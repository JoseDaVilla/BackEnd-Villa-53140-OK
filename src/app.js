

const express = require('express');
const ProductManager = require('./productManager');

const app = express();
const PORT = 3000;

app.get('/products', async (req, res) => {
    const {limit} = req.query;
    console.log(limit)
    const p = new ProductManager();
    const productos = await p.getProducts(limit);
    return res.json({ productos });
});

app.get('/products/:pid',(req,res)=>{
    const {pid} = req.params;
    const p = new ProductManager();
    const producto = p.getProductById(Number(pid));
    console.log(pid)
    return res.json({producto});
})

app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});