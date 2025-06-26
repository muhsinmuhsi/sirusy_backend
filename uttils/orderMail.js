import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendOrder = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service:"gmail",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.myEmail,
      pass: process.env.Email_pass
    }
  });

  const mailOptions = {
    from: options.myEmail,
    to: options.emai,
    subject: options.subject,
    html: options.html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (err) {
    console.error('Error while sending email:', err);
    throw new Error('Failed to send email: ' + err.message);
  }
};

export default sendOrder;