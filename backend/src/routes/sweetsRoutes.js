import express from 'express';
import {
    getSweets,
    getSweetById,
    searchSweets,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet
} from '../controllers/sweetsController.js';
import {protect,admin} from '../middleware/authMiddleware.js';

const router=express.Router();

router.get('/search',searchSweets);
router.get('/',getSweets);

router.post('/:id/purchase',protect,purchaseSweet);

router.post('/',protect,admin,createSweet);
router.put('/:id',protect,admin,updateSweet);
router.delete('/:id',protect,admin,deleteSweet);
router.post('/:id/restock',protect,admin,restockSweet);

router.get('/:id',getSweetById);

export default router;