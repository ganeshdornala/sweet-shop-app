import express from 'express';
import {getSweets,purchaseSweet} from '../controllers/sweetsController.js';
import {protect} from '../middleware/authMiddleware.js';

const router=express.Router();

router.get('/',getSweets);
router.get('/protected-check',protect,(req,res)=>res.send('Access'));
router.post('/:id/purchase',protect,purchaseSweet);

export default router;