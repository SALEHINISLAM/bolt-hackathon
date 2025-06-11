import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // For development, you can use Gmail with app password
  // For production, use a service like SendGrid, AWS SES, etc.
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // your email
      pass: process.env.SMTP_PASS, // your app password
    },
  });
};

export const sendVerificationEmail = async (
  email: string,
  firstName: string,
  verificationToken: string
) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/newsletter/verify?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"CareerCoach Newsletter" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Confirm your newsletter subscription',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Your Subscription</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a, #1e40af); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CareerCoach Newsletter!</h1>
              <p>You're one step away from receiving weekly career insights</p>
            </div>
            <div class="content">
              <h2>Hi ${firstName || 'there'}!</h2>
              <p>Thank you for subscribing to our Career Growth Newsletter. To complete your subscription and start receiving our weekly career tips, industry insights, and exclusive coaching resources, please confirm your email address.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Confirm My Subscription</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #1e40af;">${verificationUrl}</p>
              
              <h3>What you'll get:</h3>
              <ul>
                <li>📈 Weekly career advancement tips</li>
                <li>👥 Exclusive coach spotlights and interviews</li>
                <li>🔍 Industry trends and insights</li>
                <li>🎯 Goal-setting frameworks and templates</li>
                <li>📚 Curated learning resources</li>
                <li>🏆 Success stories from our community</li>
              </ul>
              
              <p>If you didn't sign up for this newsletter, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 CareerCoach. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to CareerCoach Newsletter!
        
        Hi ${firstName || 'there'}!
        
        Thank you for subscribing to our Career Growth Newsletter. To complete your subscription, please click the link below:
        
        ${verificationUrl}
        
        What you'll get:
        - Weekly career advancement tips
        - Exclusive coach spotlights and interviews
        - Industry trends and insights
        - Goal-setting frameworks and templates
        - Curated learning resources
        - Success stories from our community
        
        If you didn't sign up for this newsletter, you can safely ignore this email.
        
        © 2024 CareerCoach. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error };
  }
};