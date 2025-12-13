import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Sweet from '../src/models/Sweet.js';

afterAll(async()=>{
    await mongoose.connection.close();
});

describe('GET /api/sweets',()=>{
    it('should return a list of sweets',async()=>{
        const res=await request(app).get('/api/sweets');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should allow user to purchase a sweet',async()=>{
        const user=await User.create({
            username:'buyer',
            email:'buyer@example.com',
            password:'password123'
        });
        const loginRes=await request(app).post('/api/auth/login').send({
            email:'buyer@example.com',
            password:'password123'
        });
        const token=loginRes.body.token;
        const sweet=await Sweet.create({
            name:'Ladoo',
            category:'Traditional',
            price:10,
            quantity:5
        });
        const res=await request(app)
            .post(`/api/sweets/${sweet._id}/purchase`)
            .set('Authorization',`Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toEqual(4);
    });
});