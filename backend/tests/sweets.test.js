import request from 'supertest';
import mongoose, { mongo } from 'mongoose';
import app from '../src/app.js';

afterAll(async()=>{
    await mongoose.connection.close();
});

describe('GET /api/sweets',()=>{
    it('should return a list of sweets',async()=>{
        const res=await request(app).get('/api/sweets');

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});