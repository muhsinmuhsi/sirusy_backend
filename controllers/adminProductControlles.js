import bannerImage from "../Models/bannerImage.js";
import category from "../Models/category.js";
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
 

 export const adminBannerImage=async(req,res)=>{
    const result = req.body;
    if(!result){
     return res.status(403).json({message:"missing required field"});
    }
 
    const newBannerImage=new bannerImage({
     image:req.cloudinaryImageUrl
    });
 
    await newBannerImage.save()
    return res.status(200).json({message:'image added successfully'})
 }



 export const adminAddCategory = async (req, res) => {
  
    const result = req.body;
    if (!result || !result.category || !result.alt) {
      return res.status(403).json({ message: "Missing required fields" });
    }
  
    try {
      const newCategory = new category({
        category: result.category,
        alt: result.alt,
        image: req.cloudinaryImageUrl,
      });
  
      await newCategory.save();
      return res.status(200).json({ message: 'Category added successfully' });
    } catch (error) {
      console.error("Error while saving category:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  };
  