import express from 'express';
import uploadImage from '../middleware/uploadMiddleware.js';
import { adminAddProduct } from '../controllers/adminProductControlles.js';

const route=express.Router()

route.post('/products',uploadImage,adminAddProduct);

export default route;