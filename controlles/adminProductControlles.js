export const adminAddProduct=async(req,res,next)=>{
    const result = req.body;
    if(!result){
     return res.status(403).json({message:"missing required field"});
    }
 
    const newProduct=new products({
     title:result.title,
     description:result.description,
     price:result.price,
     category:result.category,
     image:req.cloudinaryImageUrl
    });
 
    await newProduct.save()
    return res.status(200).json({message:'product added successfully'})
 }
 