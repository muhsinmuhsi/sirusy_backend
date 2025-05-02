import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import ProductRoute from './routes/ProductRoutes.js'
import adminRoute from './routes/adminRoutes.js'
import cors from 'cors'


dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const app=express()

const allowedOrigins = [
    'http://localhost:8080',         // for local dev
    'https://sirusy.onrender.com',   // Render domain
    'https://sirusy.com',            // Custom domain
    'https://www.sirusy.com'        // www version
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true // if using cookies or sessions
  }));

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
  