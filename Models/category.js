import mongoose from "mongoose";
const categorySchema=new  mongoose.Schema({
    category:{
        type:String,
    },
    image:{
        type:String,
    }, 
    alt:{
        type:String,
    },
})

const category=mongoose.model('category',categorySchema)
export default category