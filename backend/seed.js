import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from './src/models/User.js';
import Sweet from './src/models/Sweet.js';
import connectDB from './src/config/db.js';

connectDB();

const importData=async()=>{
    try{
        await User.deleteMany();
        await Sweet.deleteMany();
        console.log('Data cleared...');

        const user=await User.create({
            username:'ganeshdornala',
            email:'ganeshdornala2003@gmail.com',
            password:'Hello123',
            isAdmin:true
        });

        console.log('Admin User Created: ganeshdornala2003@gmail.com / Hello123');

        const sweets=[
            {
                name:'Gulab Jamun',
                category:'Syrup Based',
                price:5,
                quantity:50
            },
            {
                name:'Kaju Katli',
                category:'Dry Fruit',
                price:15,
                quantity:20
            },
            {
                name:'Rasgulla',
                category:'Syrup Based',
                price:4,
                quantity:30
            },
            {
                name:'Mysore Pak',
                category:'Ghee Based',
                price:8,
                quantity:10
            },
            {
                name:'Jalebi',
                category:'Fried',
                price:3,
                quantity:0
            }
        ];

        await Sweet.insertMany(sweets);
        console.log('Sweets Added...');

        console.log('Data Imported Successfully!');
        process.exit();
    }catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();