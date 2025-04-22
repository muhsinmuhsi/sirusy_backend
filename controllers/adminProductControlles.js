import product from "../Models/product.js";

export const adminAddProduct=async(req,res)=>{
    const result = req.body;
    if(!result){
     return res.status(403).json({message:"missing required field"});
    }
 
    const newProduct=new product({
     title:result.title,
     description:result.description,
     price:result.price,
     category:result.category,
     image:req.cloudinaryImageUrl
    });
 
    await newProduct.save()
    return res.status(200).json({message:'product added successfully'})
 }
 