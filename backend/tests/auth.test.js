import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js'; // Ensure path is correct
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// 1. Connect to Database (Essential!)
beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
});

// 2. Clear Users before each test
beforeEach(async () => {
    await User.deleteMany({});
});

// 3. Close connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
    
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toBe('test@example.com');
    }, 10000); // Increased timeout to 10s

    it('should not register user with existing email', async () => {
        // First Register
        await request(app).post('/api/auth/register').send({
            username: 'user1',
            email: 'duplicate@example.com',
            password: '123'
        });

        // Try Registering Again
        const res = await request(app).post('/api/auth/register').send({
            username: 'user2',
            email: 'duplicate@example.com',
            password: '456'
        });

        expect(res.statusCode).toBe(400);
    }, 10000);

    it('should login user with valid credentials', async () => {
        // Create user
        await User.create({
            username: 'loginuser',
            email: 'login@example.com',
            password: 'password123' 
        });

        // Try Login
        const res = await request(app).post('/api/auth/login').send({
            email: 'login@example.com',
            password: 'password123'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    }, 10000);

});