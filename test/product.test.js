import { expect } from 'chai';
import supertest from 'supertest';
// import routerProduct from '../src/routers/products.js';
import app from '../src/app.js';
import { dbConnection } from '../src/database/config.js';
import supertestSession from 'supertest-session';

await dbConnection();

const request = supertestSession(app);

describe('Products API', () => {

    let token;
    let idProducto;
    before(async () => {
        const loginResponse = await request.post('/api/sessions/login')
            .send({
                "email": "adminCoder@coder.com", "password":"adminCod3r123"
            });

        token = loginResponse.body.token;
        console.log('Login Response:', loginResponse.body);
        token = loginResponse.body.token;
        console.log('Token:', token);
    });

    it('should return a list of products', async () => {
        const res = await request.get('/api/products');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
    });

    it('should return a product by ID', async () => {
        const productId = "668741a36d044d526dd5e12b";
        const res = await request.get(`/api/products/${productId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id', productId);
    });

    it('should create a new product', async () => {
        const newProduct = {
            
                "title": "test",
                "description": "Descripcion de test",
                "price": 1580,
                "code": "test",
                "stock": 47,
                "category":"Zapatos",
                "thumbnails":["https://test.com"]
        }
        ;

        const res = await request.post('/api/products')
            .send(newProduct)
            .set('Authorization', `Bearer ${token}`);

            idProducto = res.body._id
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');
        expect(res.body.title).to.equal(newProduct.title);
    });

    it('should update an existing product', async () => {
        const updatedData = {
            title: "Producto actualizado",
            price: 150
        };

        const res = await request.put(`/api/products/${idProducto}`)
            .send(updatedData)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id', idProducto);
        expect(res.body.title).to.equal(updatedData.title);
    });

    it('should delete a product by ID', async () => {

        const res = await request.delete(`/api/products/${idProducto}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
    });

    it('should handle invalid input when creating a product', async () => {
        const invalidProduct = {
            title: "",  //? Campo obligatorio vacío, debe arrojar un error
            description: "Descripción inválida"
        };

        const res = await request.post('/api/products')
            .send(invalidProduct)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(500);
    });

});
