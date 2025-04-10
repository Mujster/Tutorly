const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();   

const transporter=nodemailer.createTransport({  
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:process.env.SENDEREMAIL,
        pass:process.env.AUTHENTICATIONCODE,
    }
});

// Send verification email
const sendVerificationEmail = async (email, name, token) => {
    const verifyLink=`http://localhost:${process.env.PORT}/tutorly/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"TutorlyAI" <noreply.activationmail@tutorlyai.com>`,
    to: email,
    subject: 'Verify Your Email - TutorlyAI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Welcome to TutorlyAI!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with Tutorly. To complete your registration, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p>This verification link will expire in 24 hours.</p>
        <p>If you did not sign up for a Tutorly account, please ignore this email.</p>
        <p>Thanks,<br>The Tutorly Team</p>
      </div>
    `,
  };

  console.log(`Attempting to send verification email to ${email}`);
  try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
      return info;
  } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
  }
};

module.exports = {
  sendVerificationEmail,
};