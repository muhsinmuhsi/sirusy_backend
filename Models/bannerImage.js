import mongoose from "mongoose";
const bannerImageSchema=new  mongoose.Schema({
    image:{
        type:String,
    }, 
    alt:{
        type:String,
    },
})

const bannerImage=mongoose.model('bannerImage',bannerImageSchema)
export default bannerImage;