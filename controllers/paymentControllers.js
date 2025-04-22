import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const payment = async (req, res) => {
  const { cartItems, totalPrice } = req.body;

  const productNames = cartItems.map(item => item.title).join(', ');

  const options = {
    amount: totalPrice * 100, // amount in the smallest currency unit
    currency: 'INR',
    receipt: `receipt_order_${Math.random().toString(36).substring(2, 15)}`,
    notes: {
      product: productNames,
    },
  };

  try {
    const order = await razorpayInstance.orders.create(options);
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
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).send('Verification failed');
  }

  // Here, you can save the order and payment info to your database.
  res.status(200).send('Payment verified successfully');
};
