import express from 'express';
import uploadImage from '../middleware/uploadMiddleware.js';
import { adminAddProduct, adminBannerImage, deleteProduct, updateProduct } from '../controllers/adminProductControlles.js';
import { Login } from '../controllers/adminAuth.js';
import uploadBanner from '../middleware/uploadBanner.js';

const route=express.Router()

route.post('/Login',Login);
route.post('/products',uploadImage,adminAddProduct);
route.post('/bannerImage',uploadBanner,adminBannerImage);
route.put('/products/:id',uploadImage,updateProduct);
route.delete('/products/:id',deleteProduct);

export default route;