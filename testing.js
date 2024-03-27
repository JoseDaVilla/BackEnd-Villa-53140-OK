const ProductManager = require("./src/productManager")

const producto = new ProductManager();

console.log(producto.addProduct("Parlantes", "Sony", 7000, 'https://img1.com', "12asd23", 45));

console.log(producto.addProduct("Audifonos", "Logitec", 2000, 'https://img2.com', "132atgs", 23));

console.log(producto.addProduct("Teclado", "Logitec", 4000, 'https://img3.com', "50masd2", 5));

console.log(producto.addProduct("Parlantes", "Sony", 7000, 'https://img1.com', "12asd2333", 45));

console.log(producto.addProduct("Audifonos", "Logitec", 2000, 'https://img2.com', "132312atgs", 23));

console.log(producto.addProduct("Teclado", "Logitec", 4000, 'https://img3.com', "50mas12312d2", 5));


// const test = {
//     "id": 312,
//     "title": "sabana",
//     "description": "asus",
//     "price": 23,
//     "thumbnail": "https://img3.com",
//     "stock": 5
// }

// console.log(producto.updateProduct(3,test))

// console.log(producto.deleteProduct(2))