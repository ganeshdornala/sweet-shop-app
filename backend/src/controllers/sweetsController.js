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

export const searchSweets=async(req,res)=>{
    const {query,minPrice,maxPrice}=req.query;
    try{
        let dbQuery={};
        if(query){
            dbQuery.$or=[
                {
                    name:{
                        $regex:query,
                        $options:'i'
                    }
                },
                {
                    category:{
                        $regex:query,
                        $options:'i'
                    }
                }
            ];
        }
        if(minPrice||maxPrice){
            dbQuery.price={};
            if(minPrice){
                dbQuery.price.$gte=Number(minPrice);
            }
            if(maxPrice){
                dbQuery.price.$lte=Number(maxPrice);
            }
        }
        const sweets=await Sweet.find(dbQuery);
        res.json(sweets);
    }catch(error){
        res.status(500).json({
            message:'Server Error'
        });
    }
};

export const getSweetById=async(req,res)=>{
    try{
        const sweet=await Sweet.findById(req.params.id);
        if(sweet){
            res.json(sweet);
        }else{
            res.status(404).json({
                message:"Sweet not found"
            });
        }
    }catch(error){
        res.status(500).json({
            message:"Server Error"
        });
    }
};

export const createSweet=async(req,res)=>{
    const {name,category,price,quantity}=req.body;
    try{
        const sweet=new Sweet({
            name,
            category,
            price,
            quantity
        });
        const createdSweet=await sweet.save();
        res.status(201).json(createdSweet);
    }catch(error){
        res.status(500).json({
            message:'Server Error'
        });
    }
};

export const updateSweet=async(req,res)=>{
    const {name,category,price,quantity}=req.body;
    try{
        const sweet=await Sweet.findById(req.params.id);
        if(sweet){
            sweet.name=name||sweet.name;
            sweet.category=category||sweet.category;
            sweet.price=price||sweet.price;
            sweet.quantity=quantity!==undefined?quantity:sweet.quantity;
            const updatedSweet=await sweet.save();
            res.json(updatedSweet);
        }else{
            res.status(404).json({
                message:'Sweet not found'
            });
        }
    }catch(error){
        res.status(500).json({
            message:'Server Error'
        });
    }
};

export const deleteSweet=async(req,res)=>{
    try{
        const sweet=await Sweet.findById(req.params.id);
        if(sweet){
            await sweet.deleteOne();
            res.json({message:'Sweet removed'});
        }else{
            res.status(404).json({message:'Sweet not found'});
        }
    }catch(error){
        res.status(500).json({message:error.message});
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


export const restockSweet=async(req,res)=>{
    const {amount}=req.body;
    try{
        const sweet=await Sweet.findById(req.params.id);
        if(sweet){
            sweet.quantity=sweet.quantity+(Number(amount)||1);
            const updatedSweet=await sweet.save();
            res.json(updatedSweet);
        }else{
            res.status(404).json({message:'Sweet not found'});
        }
    }catch(error){
        res.status(500).json({message:'Server Error'});
    }
};