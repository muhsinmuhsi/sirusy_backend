import mongoose from "mongoose";
const productSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String, 
        required: true,
      },
    category: {
        type: String,
        required: true,
    },
    quantity:{
        type:Number,
        default:1
    },
    sell_Quantity:{
      type:Number,
      default:0
    },
});

const product = mongoose.model('products',productSchema);
export default product