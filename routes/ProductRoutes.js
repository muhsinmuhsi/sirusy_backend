import express from 'express';
import { productByCategory, productById , sendEmail, viewBannerImg, viewCategory, viewProduct } from '../controllers/productControlles.js';
import { payment, verifyPayment } from '../controllers/paymentControllers.js';

const route=express.Router()

route.get('/products',viewProduct)
route.get('/products/:id',productById)
route.get('/products/category/:category',productByCategory)
route.post('/payment',payment);
route.post('/payment/verify',verifyPayment);
route.get('/category',viewCategory);
route.get('/bannerImage',viewBannerImg);
route.post('/sendEmail',sendEmail);


export default route;