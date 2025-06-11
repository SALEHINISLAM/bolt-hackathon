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

export const sendCorporateInquiryNotification = async (inquiryData: {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  message: string;
  companySize?: string;
  industry?: string;
  region?: string;
  interestedServices: string[];
  budget?: string;
  timeline?: string;
  inquiryId: string;
}) => {
  try {
    const transporter = createTransporter();
    
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    
    if (!adminEmail) {
      console.warn('No admin email configured for corporate inquiry notifications');
      return { success: false, error: 'No admin email configured' };
    }

    const mailOptions = {
      from: `"CareerCoach Corporate" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Corporate Inquiry from ${inquiryData.companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Corporate Inquiry</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a, #1e40af); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 10px; margin: 20px 0; }
            .info-label { font-weight: bold; color: #374151; }
            .info-value { color: #6b7280; }
            .services { background: #e0f2fe; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .message-box { background: white; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏢 New Corporate Inquiry</h1>
              <p>A new company is interested in your coaching services</p>
            </div>
            <div class="content">
              <h2>Company Information</h2>
              <div class="info-grid">
                <div class="info-label">Company:</div>
                <div class="info-value">${inquiryData.companyName}</div>
                
                <div class="info-label">Contact:</div>
                <div class="info-value">${inquiryData.contactName}</div>
                
                <div class="info-label">Email:</div>
                <div class="info-value"><a href="mailto:${inquiryData.email}">${inquiryData.email}</a></div>
                
                ${inquiryData.phone ? `
                <div class="info-label">Phone:</div>
                <div class="info-value"><a href="tel:${inquiryData.phone}">${inquiryData.phone}</a></div>
                ` : ''}
                
                ${inquiryData.companySize ? `
                <div class="info-label">Company Size:</div>
                <div class="info-value">${inquiryData.companySize}</div>
                ` : ''}
                
                ${inquiryData.industry ? `
                <div class="info-label">Industry:</div>
                <div class="info-value">${inquiryData.industry}</div>
                ` : ''}
                
                ${inquiryData.region ? `
                <div class="info-label">Region:</div>
                <div class="info-value">${inquiryData.region}</div>
                ` : ''}
                
                ${inquiryData.budget ? `
                <div class="info-label">Budget:</div>
                <div class="info-value">${inquiryData.budget}</div>
                ` : ''}
                
                ${inquiryData.timeline ? `
                <div class="info-label">Timeline:</div>
                <div class="info-value">${inquiryData.timeline}</div>
                ` : ''}
              </div>

              ${inquiryData.interestedServices.length > 0 ? `
              <div class="services">
                <h3>Interested Services:</h3>
                <ul>
                  ${inquiryData.interestedServices.map(service => `<li>${service}</li>`).join('')}
                </ul>
              </div>
              ` : ''}

              <div class="message-box">
                <h3>Message:</h3>
                <p>${inquiryData.message.replace(/\n/g, '<br>')}</p>
              </div>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              
              <p><strong>Inquiry ID:</strong> ${inquiryData.inquiryId}</p>
              <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
              
              <p style="margin-top: 30px; padding: 15px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
                <strong>⏰ Action Required:</strong> Please respond to this inquiry within 24 hours to maintain our service level agreement.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Corporate Inquiry from ${inquiryData.companyName}
        
        Company Information:
        - Company: ${inquiryData.companyName}
        - Contact: ${inquiryData.contactName}
        - Email: ${inquiryData.email}
        ${inquiryData.phone ? `- Phone: ${inquiryData.phone}` : ''}
        ${inquiryData.companySize ? `- Company Size: ${inquiryData.companySize}` : ''}
        ${inquiryData.industry ? `- Industry: ${inquiryData.industry}` : ''}
        ${inquiryData.region ? `- Region: ${inquiryData.region}` : ''}
        ${inquiryData.budget ? `- Budget: ${inquiryData.budget}` : ''}
        ${inquiryData.timeline ? `- Timeline: ${inquiryData.timeline}` : ''}
        
        ${inquiryData.interestedServices.length > 0 ? `
        Interested Services:
        ${inquiryData.interestedServices.map(service => `- ${service}`).join('\n')}
        ` : ''}
        
        Message:
        ${inquiryData.message}
        
        ---
        Inquiry ID: ${inquiryData.inquiryId}
        Received: ${new Date().toLocaleString()}
        
        Please respond within 24 hours.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Corporate inquiry notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending corporate inquiry notification:', error);
    return { success: false, error: error };
  }
};