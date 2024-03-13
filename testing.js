import { ProductManager } from "./productManager.js";

ProductManager

const producto = new ProductManager();

console.log(producto.addProduct("Parlantes", "Sony", 7000, 'https://img1.com', "12asd23", 45));

console.log(producto.addProduct("Audifonos", "Logitec", 2000, 'https://img2.com', "132atgs", 23));

console.log(producto.addProduct("Teclado", "Logitec", 4000, 'https://img3.com', "50masd2", 5));


console.log(producto.getProductById(3));
