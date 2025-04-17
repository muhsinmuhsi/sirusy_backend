import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import ProductRoute from './routes/ProductRoutes.js'
import adminRoute from './routes/adminRoutes.js'


dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const app=express()

app.use(express.json());

app.use('/api',ProductRoute);
app.use('/api/admin',adminRoute);

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connected successfully');
    } catch (error) {
        console.error('db connecting failed',error);
        
    }
}
connectDB()


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
  