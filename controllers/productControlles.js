import bannerImage from "../Models/bannerImage.js";
import category from "../Models/category.js";
import product from "../Models/product.js";
import sendOrder from "../uttils/orderMail.js";

export const viewProduct = async (req, res) => {
    try {
        const products = await product.find();
    
    if (products.length === 0) {
        res.status(404).json({message: 'unable to get products'});
        return; 
    }
    
    res.status(200).json({
        status: "success", 
        message: 'successfully fetched data',
        data: products
    });
    } catch (error) {
        res.status(500).json({message:'internal server error',error})
    }
    
  };


  export const productById = async (req, res) => {
    try {
        const productId = req.params.id;
        const products = await product.findById(productId);        
    
    if (!products) {
        res.status(404).json({
            error: 'not found',
            message: 'product not found'
        });
        return;
    }
    
     res.status(200).json(products);
    } catch (error) {
        console.log(error,'error');
        
        res.status(500).json({message:"internal server error",error})
    }
    
  };


  export const productByCategory = async (req, res) => {
    const { category } = req.params;
  
    const products = await product.find({
        $or: [
            { category: { $regex: new RegExp(category, 'i') } },
            { title: { $regex: new RegExp(category, 'i') } }
        ]
    });
  
    if (products.length === 0) {
        res.status(404).json({ message: "Item not found" });
        return;
    }
  
    res.status(200).json(products);
  };
  


  export const viewCategory = async (req, res) => {
    try {
        const categories = await category.find();
    
    if (categories.length === 0) {
        res.status(404).json({message: 'unable to get category'});
        return; 
    }
    
    res.status(200).json({
        status: "success", 
        message: 'successfully fetched data',
        data: categories
    });
    } catch (error) {
        console.log(error,'error');
        res.status(500).json({message:'internal server error',error})
    }
    
  };


  export const viewBannerImg = async (req, res) => {
    try {
        const bannerImages = await bannerImage.find();
    
    if (bannerImages.length === 0) {
        res.status(404).json({message: 'unable to get bannerImages'});
        return; 
    }
    
    res.status(200).json({
        status: "success", 
        message: 'successfully fetched data',
        data: bannerImages
    });
    } catch (error) {
        res.status(500).json({message:'internal server error',error})
    }
    
  };


  export const sendEmail= async (req,res)=>{
     const {checkoutItems,totalPrice,shippingInfo,paymentMethod}=req.body;
    try {
        const productList = checkoutItems.map(item => `<li>${item.images[0]} ${item.title} - ₹${item.price} x ${item.quantity}</li>`).join('');

        await sendOrder({
      myEmail:process.env.myEmail,
      email:process.env.myEmail,
      subject: "🛒 New Order Placed!",
      html: `
      <div style="max-width:600px;margin:20px auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;font-family:Arial,sans-serif;background-color:#f9f9f9;">
        <h2 style="color:#2c3e50;text-align:center;">🛍️ Order Confirmation</h2>
        <p style="font-size:16px;color:#333;"><strong>Name : ${shippingInfo.name || "Customer"},</strong></p>
        <p style="font-size:14px;color:#555;">Thank you for your order! Here are the details:</p>
    
        <table style="width:100%;border-collapse:collapse;margin-top:15px;">
          <tr>
            <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Payment Method:</strong></td>
            <td style="padding:8px;border-bottom:1px solid #ddd;">${paymentMethod}</td>
          </tr>
        
          <tr>
            <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Total Amount:</strong></td>
            <td style="padding:8px;border-bottom:1px solid #ddd;">₹${totalPrice}</td>
          </tr>
          
        </table>
    
        <h3 style="margin-top:25px;color:#2c3e50;">📦 Shipping Information</h3>
        <p style="font-size:14px;color:#555;margin:5px 0;"><strong>Email:</strong> ${shippingInfo.email}</p>
        <p style="font-size:14px;color:#555;margin:5px 0;"><strong>Phone:</strong> ${shippingInfo.phone}</p>
        <p style="font-size:14px;color:#555;margin:5px 0;"><strong>Address:</strong> ${shippingInfo.address}</p>
    
        <h3 style="margin-top:25px;color:#2c3e50;">🛒 Ordered Items</h3>
        <ul style="font-size:14px;color:#555;line-height:1.6;">
          ${productList}
        </ul>
    
      </div>
    `
        })


        await sendOrder({
      myEmail: process.env.myEmail, // still the sender
      email: shippingInfo.email,
      subject: "✅ Your Order is Confirmed!",
      html: `
        <div style="max-width:600px;margin:20px auto;padding:20px;border:1px solid #ccc;border-radius:10px;font-family:Arial;">
          <h2 style="color:#2c3e50;text-align:center;">🎉 Order Confirmed</h2>
          <p>Hi ${shippingInfo.name || "Customer"},</p>
          <p>Thank you for your purchase! Your order has been successfully placed and is being processed.</p>
          
          
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>Total Paid:</strong> ₹${totalPrice}</p>

          <h3>📦 Shipping Info</h3>
          <p><strong>Phone:</strong> ${shippingInfo.phone}</p>
          <p><strong>Address:</strong> ${shippingInfo.address}</p>

          <h3>🛍️ Ordered Items:</h3>
          <ul>${productList}</ul>

          <p>We’ll notify you once your items are shipped.</p>
          <p>Best regards,<br/>The sirusy Team</p>
        </div>
      `
    });


        res.status(200).json({ message: 'Confirmation email sent successfully.' });
    } catch (error) {
        console.log(error,'error');
        return  res.status(400).json({message:'There is an error sending the email. Try again '})
        
    }
  }


//   export const subscribeByEmail=async (req,res)=>{
//     const {email}=req.body;
//     try {

//         await sendOrder({
//             myEmail:process.env.myEmail,
//             email:shippingInfo.email,
//             subject: "New User Subscribed!",
//             html: `
//             <div style="max-width:600px;margin:20px auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;font-family:Arial,sans-serif;background-color:#f9f9f9;">
//             <p style="font-size:16px;color:#333;"><strong>Email: ${email},</strong></p>
//             </div>
//             `
//         })
//     } catch (error) {
//         return res.status(500).json({message:'internal server error'});
//     }
//   }
