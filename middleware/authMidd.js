import { apperror } from "../utils/apperror";
import  Jwt  from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config()


export const Adminauthmidd=async(req,res,next)=>{
    try {
        const token = req.cookies?.admin_token  || req.headers.authorization?.split(' ')[1];        

    if(!token){
        return next(new apperror('You are not logged in. Please log in to access this resource.', 401));
    }   

    Jwt.verify(token,process.env.ADMIN_SECRET,(error,decode)=>{
        if(error){
            return  res.status(401).json({message:'Unauthorized'})
        }

        req.email=decode.email  
        next()

    })    
    } catch (error) {
        return  res.status(500).json({message:'internal server error'})
    }
}