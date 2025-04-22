import express from 'express';
import { productByCategory, productById, viewProduct } from '../controllers/productControlles.js';
import { payment, verifyPayment } from '../controllers/paymentControllers.js';

const route=express.Router()

route.get('/products',viewProduct)
route.get('/products/:id',productById)
route.get('/products/category/:category',productByCategory)
route.post('/payment',payment);
route.post('/payment/verify',verifyPayment);


export default route;