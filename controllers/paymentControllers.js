import dotenv from 'dotenv';
dotenv.config(); // Make sure this is first!

import Razorpay from 'razorpay';
import crypto from 'crypto';
import sendOrder from '../uttils/orderMail.js';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});





export const payment = async (req, res) => {
  const { checkoutItems, totalPrice } = req.body;

  const productNames = checkoutItems.map(item => item.title).join(', ');

  const options = {
    amount: totalPrice * 100, // amount in the smallest currency unit
    currency: 'INR',
    receipt: `receipt_order_${Math.random().toString(36).substring(2, 15)}`,
    notes: {
      product: productNames,
    },
  };


  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("❌ Razorpay keys are missing at initialization!");
  }
  
  try {
    const order = await razorpayInstance.orders.create(options);
    console.log(order,'razorpay order');
    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).send("Internal Server Error");
  }
};

export const verifyPayment = async (req, res) => {
  const {
    response: {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    },
    checkoutItems,
    totalPrice,
    shippingInfo,
    paymentMethod

  } = req.body;
  
  console.log(razorpay_order_id,razorpay_signature,razorpay_payment_id,'razorapy ');
  

    const productList = checkoutItems.map(item => `<li>${item.images[0]} ${item.title} - ₹${item.price} x ${item.quantity}</li>`).join('');

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).send('Verification failed');
  }
console.log('hi , this is verifyPayment',shippingInfo.email,process.env.myEmail);

  try {
    await sendOrder ({
      myEmail:process.env.myEmail,
      email: process.env.myEmail,
      subject: "🛒 New Order Placed!",
      html: `
      <div style="max-width:600px;margin:20px auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;font-family:Arial,sans-serif;background-color:#f9f9f9;">
        <h2 style="color:#2c3e50;text-align:center;">🛍️ Order Confirmation</h2>
        <p style="font-size:16px;color:#333;"><strong>Hi ${shippingInfo.name || "Customer"},</strong></p>
        <p style="font-size:14px;color:#555;">Thank you for your order! Here are the details:</p>
    
        <table style="width:100%;border-collapse:collapse;margin-top:15px;">
          <tr>
            <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Payment Method:</strong></td>
            <td style="padding:8px;border-bottom:1px solid #ddd;">${paymentMethod}</td>
          </tr>
        
          <tr>
            <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Order ID:</strong></td>
            <td style="padding:8px;border-bottom:1px solid #ddd;">${razorpay_order_id}</td>
          </tr>
          <tr>
            <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Payment ID:</strong></td>
            <td style="padding:8px;border-bottom:1px solid #ddd;">${razorpay_payment_id}</td>
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
      myEmail: process.env.myEmail, 
      email: shippingInfo.email,
      subject: "✅ Your Order is Confirmed!",
      html: `
        <div style="max-width:600px;margin:20px auto;padding:20px;border:1px solid #ccc;border-radius:10px;font-family:Arial;">
          <h2 style="color:#2c3e50;text-align:center;">🎉 Order Confirmed</h2>
          <p>Hi ${shippingInfo.name || "Customer"},</p>
          <p>Thank you for your purchase! Your order has been successfully placed and is being processed.</p>
          
          <p><strong>Order ID:</strong> ${razorpay_order_id}</p>
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

  } catch (error) {
    console.log(error,'error');
    return  res.status(400).json({message:'There is an error sending the email. Try again '})
  }
  // Here, you can save the order and payment info to your database.
  res.status(200).send('Payment verified successfully');
};
