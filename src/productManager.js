const fs = require('fs');


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
            id = this.#products[this.#products.length - 1] .id + 1;
        return id;
    }

    #leerProductosInFile() {
        try {
            if (!fs.existsSync('./data')) {
                fs.mkdirSync('./data');}

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

    addProduct(title, description, price, thumbnail, code, stock) {

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return 'Todos los parametros son requeridos [title, description, price, thumbnail, code, stock]';
        }
        const codeRepetido = this.#products.some(p => p.code == code)
        if (codeRepetido)
            return `El codigo ${code} ya se encuentra registrado en otro producto`

        ProductManager.idProducto = ProductManager.idProducto + 1;

        const id = this.#asignarIdProducto();

        const nuevoProducto = {
            id: id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
        }
        this.#products.push(nuevoProducto)
        this.#guardarArchivo()
        return 'Producto agregado exitosamente!'
    }

    getProducts(limit = 0) {
        limit = Number(limit);
        if(limit > 0)
            return this.#products.slice(0,limit);
        return this.#products;
    }

    updateProduct(id, propiedadesProductos) {
        let msg = `El producto con id ${id} no existe`

        const index = this.#products.findIndex(p => p.id === id)

        if (index !== -1) {
            const { id, ...rest } = propiedadesProductos;
            this.#products[index] = { ...this.#products[index], ...rest }
            this.#guardarArchivo();
            msg = 'Producto actualizado...!!!'
        }
        return msg;
    }

    deleteProduct(id) {
        let msg = `El producto con id ${id} no existe`;
    
        const index = this.#products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.#products = this.#products.filter(p => p.id !== id);
            this.#guardarArchivo();
            msg = `Producto Eliminado ${id}...!!!`;
        }
    
        console.log(msg); 
        return msg; 
    }
    

    getProductById(id) {
        // Not found
        const producto = this.#products.find((p) => p.id == id);
        if (producto) {
            return producto;
        } else return `Not Found del producto con id ${id}`;
    }

}

module.exports = ProductManager