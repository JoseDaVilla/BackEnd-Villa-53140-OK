
import fs from "fs"
import ProductManager from "./productManager.js";

class CartsManager {

    #carts;
    #path;
    static idProducto = 0



    constructor() {
        this.#path = './src/data/carritos.json'
        this.#carts = this.#leerCarritosInFile();
    }

    #asignarIdCart() {
        let id = 1;
        if (this.#carts.length != 0)
            id = this.#carts[this.#carts.length - 1].id + 1;
        return id;
    }

    #leerCarritosInFile() {
        try {
            if (!fs.existsSync('./data')) {
                fs.mkdirSync('./data');
            }

            if (fs.existsSync(this.#path))
                return JSON.parse(fs.readFileSync(this.#path, 'utf-8'))

            return [];
        } catch (error) {
            console.log(`Ocurrió un errror al momento de leer el archivo de productos, ${error}`)
        }
    }

    #guardarArchivo() {
        try {
            fs.writeFileSync(this.#path, JSON.stringify(this.#carts))

        } catch (error) {
            console.log(`Ocurrió un error al momento de guardar el archivo de productos, ${error}`)
        }
    }

    createCart() {
        const newCart = {
            id: this.#asignarIdCart(),
            products: []
        };

        this.#carts.push(newCart);
        this.#guardarArchivo();

        return newCart;
    }

    getCartById(id) {
        // Not found
        const producto = this.#carts.find((p) => p.id == id);
        if (producto) {
            return producto;
        } else return `Not Found del producto con id ${id}`;
    }

    addProductInCart(cid, pid) {
        let result = `El carrito con id ${cid} no existe...!`;
        const indexCarrito = this.#carts.findIndex(c => c.id === cid);

        if (indexCarrito !== -1) {
            const indexProductoInCart = this.#carts[indexCarrito].products.findIndex(p => p.id === pid); 
        const productManager = new ProductManager(); 
        const producto = productManager.getProductById(pid); 

            if (producto.status && indexProductoInCart === -1) {
                this.#carts[indexCarrito].products.push({id: pid, "quantity":1});
                this.#guardarArchivo();
                result = 'Productos agregados al carrito'
            }

            else if(producto.status && indexProductoInCart !== -1){
                ++this.#carts[indexCarrito].products[indexProductoInCart].quantity;
                this.#guardarArchivo();
                result = 'Productos agregados al carrito'
            }
            else{
                result = `El producto con id ${pid} no existe...!`
            }
        }

        return result;
    }

}

export default CartsManager