import express from 'express';
import { productByCategory, productById, viewProduct } from '../controlles/productControlles';

const route=express.Router()

route.get('/products',viewProduct)
route.get('/products/:id',productById)
route.get('/products/category/:category',productByCategory)

export default route;