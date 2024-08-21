import app from '../src/app.js'; // Ajusta la ruta según tu estructura
import { expect } from 'chai';
import mongoose from 'mongoose';
import { config } from '../src/config/config.js'; // Ajusta la ruta según tu estructura
import supertestSession from 'supertest-session';

let session;
let userId;

before(async () => {
    session = supertestSession(app);
});

after(async () => {
    await mongoose.disconnect();
    
});

beforeEach(async () => {
    console.log("TEST DE REGISTRO!".bgCyan)
    const response = await session
        .post('/api/sessions/registro')
        .send({
            nombre: 'Test',
            email: 'testuser@example.com',
            password: 'password123',
            age: 25
        });
        
    expect(response.status).to.equal(200);
    userId = response.body.usuario._id;

    const loginResponse = await session
        .post('/api/sessions/login')
        .send({
            email: 'testuser@example.com',
            password: 'password123'
        });
    expect(loginResponse.status).to.equal(200);
});

afterEach(async () => {
    console.log(`${userId}`.bgBlue)
    const response = await session.delete(`/api/sessions/${userId}`);
    console.log("DELETED FROM AFTER EACH".red)
    expect(response.status).to.equal(200);
    expect(response.body.user).to.equal('deleted user');
});

describe('Sessions Endpoints', () => {


    describe('POST /api/sessions/registro', () => {
                it('should return an error if email is already in use', async () => {
            const response = await session
                .post('/api/sessions/registro')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                    nombre: 'Another User',
                    age: 30
                });
            expect(response.status).to.equal(302);
            expect(response.header.location).to.equal("/api/sessions/error");
        });
    });

    

    describe('POST /api/sessions/login', () => {
        it('should log in a user successfully', async () => {
            const response = await session
                .post('/api/sessions/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123'
                });
            expect(response.status).to.equal(200);
            expect(response.body.payload).to.equal('Login exitoso!');
        });

        it('should return an error if credentials are incorrect', async () => {
            const response = await session
                .post('/api/sessions/login')
                .send({
                    email: 'nonexistentuser@example.com',
                    password: 'wrongpassword'
                });
                
            expect(response.status).to.equal(302);
            expect(response.header.location).to.equal("/api/sessions/error");
        });
    });

    


    describe('GET /api/sessions/current', () => {
        it('should get the current user', async () => {
            const response = await session
                .get('/api/sessions/current');
            expect(response.status).to.equal(200);
            expect(response.body.userDTO.email).to.equal('testuser@example.com');
        });
    });

});
