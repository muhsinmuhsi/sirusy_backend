import bannerImage from "../Models/bannerImage.js";
import category from "../Models/category.js";
import product from "../Models/product.js";

export const viewProduct = async (req, res) => {
    try {
        const products = await product.find();
    
    if (products.length === 0) {
        res.status(404).json({message: 'unable to get products'});
        return; 
    }
    
    res.status(200).json({
        status: "success", 
        message: 'successfully fetched data',
        data: products
    });
    } catch (error) {
        res.status(500).json({message:'internal server error',error})
    }
    
  };


  export const productById = async (req, res) => {
    try {
        const productId = req.params.id;
        const products = await product.findById(productId);

        console.log('this is productbyid');
        
    
    if (!products) {
        res.status(404).json({
            error: 'not found',
            message: 'product not found'
        });
        return;
    }
    
     res.status(200).json(products);
    } catch (error) {
        console.log(error,'error');
        
        res.status(500).json({message:"internal server error",error})
    }
    
  };


  export const productByCategory = async (req, res) => {
    const { categoryname } = req.params;
  
    const products = await product.find({
        $or: [
            { category: { $regex: new RegExp(categoryname, 'i') } },
            { title: { $regex: new RegExp(categoryname, 'i') } }
        ]
    });
  
    if (products.length === 0) {
        res.status(404).json({ message: "Item not found" });
        return;
    }
  
    res.status(200).json(products);
  };
  


  export const viewCategory = async (req, res) => {
    try {
        const categories = await category.find();
    
    if (categories.length === 0) {
        res.status(404).json({message: 'unable to get category'});
        return; 
    }
    
    res.status(200).json({
        status: "success", 
        message: 'successfully fetched data',
        data: categories
    });
    } catch (error) {
        console.log(error,'error');
        res.status(500).json({message:'internal server error',error})
    }
    
  };


  export const viewBannerImg = async (req, res) => {
    try {
        const bannerImages = await bannerImage.find();
    
    if (bannerImages.length === 0) {
        res.status(404).json({message: 'unable to get bannerImages'});
        return; 
    }
    
    res.status(200).json({
        status: "success", 
        message: 'successfully fetched data',
        data: bannerImages
    });
    } catch (error) {
        res.status(500).json({message:'internal server error',error})
    }
    
  };

