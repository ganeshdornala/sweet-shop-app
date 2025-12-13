import Sweet from '../models/Sweet.js';

export const getSweets=async(req,res)=>{
    try{
        const sweets=await Sweet.find({});
        res.json(sweets);
    }catch(error){
        res.status(500).json({
            message:"Server Error"
        });
    }
};

export const purchaseSweet=async(req,res)=>{
    try{
        const sweet=await Sweet.findById(req.params.id);
        if(sweet){
            if(sweet.quantity>0){
                sweet.quantity=sweet.quantity-1;
                const updatedSweet=await sweet.save();
                res.json(updatedSweet);
            }else{
                res.status(400).json({
                    message:"Sweet is out of stock"
                });
            }
        }else{
            res.status(404).json({
                message:"Sweet not found"
            });
        }
    }catch(error){
        res.status(500).json({
            message:'Server Error'
        });
    }
};