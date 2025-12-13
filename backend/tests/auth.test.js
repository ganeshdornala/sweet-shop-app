import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';

beforeEach(async()=>{
    await User.deleteMany({});
});

afterAll(async()=>{
    await mongoose.connection.close();
});

describe('Auth Endpoints',()=>{
    it('should register a new user successfully',async()=>{
        const res=await request(app)
            .post('/api/auth/register')
            .send({
                username:'testuser',
                email:'test@example.com',
                password:'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should not register user with existing email',async()=>{
        await User.create({
            username:'user1',
            email:'test@example.com',
            password:'password123'
        });

        const res=await request(app)
            .post('/api/auth/register')
            .send({
                username:'user2',
                email:'test@example.com',
                password:'password456'
            });
        expect(res.statusCode).toEqual(400);
    });

    it('should login user with valid credentials',async()=>{
        await request(app).post('/api/auth/register').send({
            username:'loginuser',
            email:'login@example.com',
            password:'password123'
        });

        const res=await request(app).post('/api/auth/login').send({
            email:'login@example.com',
            password:'password123'
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail to access protected route without token',async()=>{
        const res=await request(app).get('/api/sweets/protected-check');
        expect(res.statusCode).toEqual(401);
    });
});