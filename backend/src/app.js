import express from 'express';
import cors from 'cors';
import sweetsRoutes from './routes/sweetsRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app=express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("Sweet Shop API is running...");
});

app.use('/api/sweets',sweetsRoutes);
app.use('/api/auth',authRoutes);

export default app;