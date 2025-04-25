import express from 'express';
import uploadImage from '../middleware/uploadMiddleware.js';
import { adminAddCategory, adminAddProduct, adminBannerImage } from '../controllers/adminProductControlles.js';

const route=express.Router()

route.post('/products',uploadImage,adminAddProduct);
route.post('/addCategory',uploadImage,adminAddCategory);
route.post('/bannerImage',uploadImage,adminBannerImage);

export default route;