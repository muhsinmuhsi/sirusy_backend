import product from "../Models/product";
import product from "../Models/product";
import product from "../Models/product";

export const viewProduct = async (req, res) => {
    try {
        const product = await product.find();
    
    if (product.length === 0) {
        res.status(404).json({message: 'unable to get products'});
        return; 
    }
    
    res.status(200).json({
        status: "success", 
        message: 'successfully fetched data',
        data: product
    });
    } catch (error) {
        res.status(500).json({message:'internal server error',error})
    }
    
  };


  export const productById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await product.findById(productId);
    
    if (!product) {
        res.status(404).json({
            error: 'not found',
            message: 'product not found'
        });
        return;
    }
    
     res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({message:"internal server error",error})
    }
    
  };


  export const productByCategory = async (req, res, next) => {
    const { categoryname } = req.params;
  
    const product = await product.find({
        $or: [
            { category: { $regex: new RegExp(categoryname, 'i') } },
            { title: { $regex: new RegExp(categoryname, 'i') } }
        ]
    });
  
    if (product.length === 0) {
        res.status(404).json({ message: "Item not found" });
        return;
    }
  
    res.status(200).json(product);
  };
  