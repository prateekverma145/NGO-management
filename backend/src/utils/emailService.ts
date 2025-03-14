import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate a random 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string): Promise<any> => {
  console.log(`Attempting to send email to: ${email}`);
  console.log(`SMTP Settings - Host: ${process.env.MAIL_PASS}, User: ${process.env.MAIL_USER}`);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Your OTP for Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Your OTP for verification is: <strong style="color: #007bff; font-size: 24px;">${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      </div>
    `
  };

  try {
    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    console.log('Message ID:', info.messageId);
    return {
      success: true,
      message: "Email sent successfully",
      info: info
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: "Error in sending email",
      message: error.message,
      stack: error.stack
    };
  }
};

// Send donation confirmation email
export const sendDonationConfirmation = async (email: string, amount: number, cause: string): Promise<any> => {
  console.log(`Attempting to send email to: ${email}`);
  console.log(`SMTP Settings - Host: ${process.env.MAIL_PASS}, User: ${process.env.MAIL_USER}`);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Donation Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank You for Your Donation!</h2>
        <p>Your donation of ₹${amount} for ${cause} has been received and confirmed.</p>
        <p>Your contribution will help make a difference in the lives of those in need.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
      </div>
    `
  };

  try {
    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    console.log('Message ID:', info.messageId);
    return {
      success: true,
      message: "Email sent successfully",
      info: info
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: "Error in sending email",
      message: error.message,
      stack: error.stack
    };
  }
}; 