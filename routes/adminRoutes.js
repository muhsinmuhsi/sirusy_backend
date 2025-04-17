import express from 'express';
import { adminAddProduct } from '../controlles/adminProductControlles';
import uploadImage from '../middleware/uploadMiddleware';

const route=express.Router()

route.post('/products',uploadImage,adminAddProduct)

export default route;