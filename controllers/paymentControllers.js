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
    shippingInfo
  } = req.body;
  
  console.log(razorpay_order_id,razorpay_signature,razorpay_payment_id,'razorapy ');
  

    const productList = checkoutItems.map(item => `<li>${item.title} - ₹${item.price} x ${item.quantity}</li>`).join('');

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
      email:shippingInfo.email,
      subject: "🛒 New Order Placed!",
  html: `
    <h2>🛍 New Order Details</h2>
    <p><strong>Order ID:</strong> ${razorpay_order_id}</p>
    <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
    <p><strong>Total:</strong> ₹${totalPrice}</p>
    <h3>Items:</h3>
    <ul>${productList}</ul>
    <p><strong>Email:</strong> ${shippingInfo.email}</p>
    <p><strong>Address:</strong>${shippingInfo.address}</p>
    <h3>Phone:${shippingInfo.phone}</h3>
  `
    })
  } catch (error) {
    console.log(error,'error');
    return  res.status(400).json({message:'There is an error sending the email. Try again '})
  }
  // Here, you can save the order and payment info to your database.
  res.status(200).send('Payment verified successfully');
};
