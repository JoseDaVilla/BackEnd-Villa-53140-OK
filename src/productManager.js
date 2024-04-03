
import fs from "fs"

class ProductManager {

    #products;
    #path;
    static idProducto = 0



    constructor() {
        this.#path = './src/data/productos.json'
        this.#products = this.#leerProductosInFile();
    }

    #asignarIdProducto() {
        let id = 1;
        if (this.#products.length != 0)
            id = this.#products[this.#products.length - 1].id + 1;
        return id;
    }

    #leerProductosInFile() {
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
            fs.writeFileSync(this.#path, JSON.stringify(this.#products))

        } catch (error) {
            console.log(`Ocurrió un error al momento de guardar el archivo de productos, ${error}`)
        }
    }

    addProduct(title, description, price, thumbnails = [], code, stock, category, status = true) {

        let result = "Ocurrió un error!";

        if (!title || !description || !price || !code || !stock || !category)
            result = 'Todos los parametros son requeridos [title, description, price, code, stock, category]';

        else {

            const codeRepetido = this.#products.some(p => p.code == code)
            if (codeRepetido)
                result = `El codigo ${code} ya se encuentra registrado en otro producto`

            else {
                ProductManager.idProducto = ProductManager.idProducto + 1;

                const id = this.#asignarIdProducto();

                const nuevoProducto = {
                    id,
                    title,
                    description,
                    price,
                    thumbnails,
                    code,
                    stock,
                    category,
                    status
                }
                this.#products.push(nuevoProducto);
                this.#guardarArchivo();
                result = {
                    msg: 'Producto agregado exitosamente!',

                    producto: nuevoProducto
                }
            }

        }

        return result;
    }

    getProducts(limit = 0) {
        limit = Number(limit);
        if (limit > 0)
            return this.#products.slice(0, limit);
        return this.#products;
    }

    updateProduct(id, propiedadesProductos) {
        let result = `El producto con id ${id} no existe`

        const index = this.#products.findIndex(p => p.id === id)

        if (index !== -1) {
            const { id, ...rest } = propiedadesProductos;
            const propiedadesPermitidas = ['title', 'description', 'price', 'code', 'thumbnails', 'status', 'stock', 'category']

            const propiedadesActualizadas = Object.keys(rest)
            .filter(propiedad => propiedadesPermitidas.includes(propiedad))

            .reduce((obj,key)=>{
                obj[key]= rest[key];
                return obj;            
            }, {});

            this.#products[index] = { ...this.#products[index], ...propiedadesActualizadas }
            this.#guardarArchivo();
            result = {
                msg: 'Producto actualizado',
                producto: this.#products[index]
            }
        }
        return result;
    }

    deleteProduct(id) {
        let msg = `El producto con id ${id} no existe`;

        const index = this.#products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.#products = this.#products.filter(p => p.id !== id);
            this.#guardarArchivo();
            msg = `Producto ${id} Eliminado ...!!!`;
        }

        console.log(msg);
        return msg;
    }


    getProductById(id) {
        let status = false;
        let resp = `El producto con id ${id} no existe!`

        const producto = this.#products.find((p) => p.id == id);
        if (producto) {
            status = true;
            resp = producto
        } 
        return {status, resp}
    }

}

export default ProductManager