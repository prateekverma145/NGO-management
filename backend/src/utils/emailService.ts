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

// Send event reminder email
export const sendEventReminder = async (email: string, eventTitle: string, eventDate: string, eventTime: string, eventLocation: string): Promise<any> => {
  console.log(`Attempting to send event reminder email to: ${email}`);
  
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
    subject: `Reminder: Upcoming Event - ${eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Event Reminder</h2>
        <p>This is a friendly reminder about your upcoming event:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="color: #007bff; margin-top: 0;">${eventTitle}</h3>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Time:</strong> ${eventTime}</p>
          <p><strong>Location:</strong> ${eventLocation}</p>
        </div>
        <p>We look forward to seeing you there!</p>
        <p>If you can no longer attend, please update your registration on the platform.</p>
      </div>
    `
  };

  try {
    console.log('Sending event reminder email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Event reminder email sent successfully');
    console.log('Message ID:', info.messageId);
    return {
      success: true,
      message: "Event reminder email sent successfully",
      info: info
    };
  } catch (error: any) {
    console.error('Error sending event reminder email:', error);
    return {
      success: false,
      error: "Error in sending event reminder email",
      message: error.message,
      stack: error.stack
    };
  }
};

// Send event registration confirmation email
export const sendEventRegistrationConfirmation = async (email: string, eventTitle: string, eventDate: string, eventTime: string, eventLocation: string): Promise<any> => {
  console.log(`Attempting to send event registration confirmation email to: ${email}`);
  
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
    subject: `Registration Confirmed: ${eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Event Registration Confirmation</h2>
        <p>Thank you for registering for the following event:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="color: #007bff; margin-top: 0;">${eventTitle}</h3>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Time:</strong> ${eventTime}</p>
          <p><strong>Location:</strong> ${eventLocation}</p>
        </div>
        <p>We've added this event to your calendar. You'll receive a reminder email before the event.</p>
        <p>If you need to cancel your registration, please do so through the platform.</p>
        <p>We look forward to seeing you there!</p>
      </div>
    `
  };

  try {
    console.log('Sending event registration confirmation email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Event registration confirmation email sent successfully');
    console.log('Message ID:', info.messageId);
    return {
      success: true,
      message: "Event registration confirmation email sent successfully",
      info: info
    };
  } catch (error: any) {
    console.error('Error sending event registration confirmation email:', error);
    return {
      success: false,
      error: "Error in sending event registration confirmation email",
      message: error.message,
      stack: error.stack
    };
  }
};

// Send weekly event digest email
export const sendWeeklyEventDigest = async (email: string, upcomingEvents: any[]): Promise<any> => {
  console.log(`Attempting to send weekly event digest email to: ${email}`);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  });

  // Generate HTML for event list
  const eventsHtml = upcomingEvents.map(event => `
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
      <h3 style="color: #007bff; margin-top: 0;">${event.title}</h3>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Time:</strong> ${event.time}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p>${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
    </div>
  `).join('');

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: `Weekly Event Digest - Upcoming Volunteer Opportunities`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Weekly Event Digest</h2>
        <p>Here are the upcoming events for the next week that you might be interested in:</p>
        
        ${upcomingEvents.length > 0 ? eventsHtml : '<p>No upcoming events for the next week. Check back later!</p>'}
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p>Visit our platform to register for these events or discover more opportunities.</p>
          <p>Thank you for your commitment to making a difference!</p>
        </div>
      </div>
    `
  };

  try {
    console.log('Sending weekly event digest email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Weekly event digest email sent successfully');
    console.log('Message ID:', info.messageId);
    return {
      success: true,
      message: "Weekly event digest email sent successfully",
      info: info
    };
  } catch (error: any) {
    console.error('Error sending weekly event digest email:', error);
    return {
      success: false,
      error: "Error in sending weekly event digest email",
      message: error.message,
      stack: error.stack
    };
  }
};

// Send same-day event reminder email
export const sendSameDayEventReminder = async (email: string, eventTitle: string, eventDate: string, eventTime: string, eventLocation: string): Promise<any> => {
  console.log(`Attempting to send same-day event reminder email to: ${email}`);
  
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
    subject: `TODAY: ${eventTitle} - Event Reminder`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e53e3e;">Event Happening Today!</h2>
        <p>This is a reminder that you are registered for an event <strong>happening today</strong>:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #e53e3e;">
          <h3 style="color: #e53e3e; margin-top: 0;">${eventTitle}</h3>
          <p><strong>Date:</strong> ${eventDate} (TODAY)</p>
          <p><strong>Time:</strong> ${eventTime}</p>
          <p><strong>Location:</strong> ${eventLocation}</p>
        </div>
        <p>Please make sure to arrive on time. We're looking forward to seeing you there!</p>
        <p>If you can no longer attend, please update your registration on the platform as soon as possible.</p>
      </div>
    `
  };

  try {
    console.log('Sending same-day event reminder email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Same-day event reminder email sent successfully');
    console.log('Message ID:', info.messageId);
    return {
      success: true,
      message: "Same-day event reminder email sent successfully",
      info: info
    };
  } catch (error: any) {
    console.error('Error sending same-day event reminder email:', error);
    return {
      success: false,
      error: "Error in sending same-day event reminder email",
      message: error.message,
      stack: error.stack
    };
  }
}; 