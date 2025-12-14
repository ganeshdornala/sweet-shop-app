import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

// Connect to a test database before running tests
beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI; 
    if(!mongoUri){
        throw new Error("MONGO_URI no defined in .env");
    }
    await mongoose.connect(mongoUri);
});

// Close connection after tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('GET /api/sweets', () => {
    it('should return all sweets', async () => {
        const res = await request(app).get('/api/sweets');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('GET /api/sweets/search', () => {
    it('should search sweets by price range', async () => {
        // Test searching for cheap sweets (under 10)
        const res = await request(app).get('/api/sweets/search?maxPrice=10');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});