import env from '../config/env.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Mock email service (replace with real service like Nodemailer, SendGrid, etc.)
 * This is a placeholder that logs emails instead of sending them
 */

/**
 * Send welcome email
 * @param {String} email - Recipient email
 * @param {String} name - Recipient name
 */
export const sendWelcomeEmail = async (email, name) => {
  console.log(`📧 Sending welcome email to: ${email}`);
  console.log(`Subject: Welcome to Admin Dashboard`);
  console.log(`Body: Hello ${name}, welcome to our platform!`);
  return { success: true, message: 'Email sent (mock)' };
};

/**
 * Send password reset email
 * @param {String} email - Recipient email
 * @param {String} resetToken - Password reset token
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/reset-password/${resetToken}`;
  console.log(`📧 Sending password reset email to: ${email}`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log(`Token expires in 10 minutes`);
  return { success: true, message: 'Reset email sent (mock)' };
};

/**
 * Send verification email
 * @param {String} email - Recipient email
 * @param {String} verificationToken - Email verification token
 */
export const sendVerificationEmail = async (email, verificationToken) => {
  const verifyUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/verify-email/${verificationToken}`;
  console.log(`📧 Sending verification email to: ${email}`);
  console.log(`Verification URL: ${verifyUrl}`);
  return { success: true, message: 'Verification email sent (mock)' };
};

/**
 * Send notification email to admin
 * @param {String} subject - Email subject
 * @param {String} message - Email message
 */
export const sendAdminNotification = async (subject, message) => {
  console.log(`📧 Sending admin notification`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  return { success: true, message: 'Admin notification sent (mock)' };
};

/**
 * Send invitation email
 * @param {Object} params - Email parameters
 * @param {String} params.to - Recipient email
 * @param {String} params.name - Recipient name
 * @param {String} params.email - User email
 * @param {String} params.tempPassword - Temporary password
 * @param {String} params.loginUrl - Login URL
 */
export const sendInvitationEmail = async ({ to, name, email, tempPassword, loginUrl }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      subject: 'Welcome to the Admin Dashboard - Your Account Details',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9fafb;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 0 0 10px 10px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .credentials {
                background-color: #f3f4f6;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .credential-row {
                margin: 10px 0;
              }
              .credential-label {
                font-weight: bold;
                color: #4b5563;
              }
              .credential-value {
                color: #1f2937;
                font-family: monospace;
                background: white;
                padding: 8px 12px;
                border-radius: 4px;
                display: inline-block;
                margin-top: 5px;
              }
              .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: bold;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #6b7280;
                font-size: 14px;
              }
              .warning {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Admin Dashboard</h1>
              </div>
              <div class="content">
                <p>Hello <strong>${name}</strong>,</p>
                
                <p>You've been invited to join our consultancy dashboard. An administrator has created an account for you.</p>
                
                <div class="credentials">
                  <div class="credential-row">
                    <div class="credential-label">Email:</div>
                    <div class="credential-value">${email}</div>
                  </div>
                  <div class="credential-row">
                    <div class="credential-label">Temporary Password:</div>
                    <div class="credential-value">${tempPassword}</div>
                  </div>
                </div>
                
                <div class="warning">
                  <strong>⚠️ Important:</strong> Please change your password after your first login for security purposes.
                </div>
                
                <center>
                  <a href="${loginUrl}" class="button">Sign In Now</a>
                </center>
                
                <p>If you have any questions, please contact your administrator.</p>
                
                <div class="footer">
                  <p>This is an automated email. Please do not reply.</p>
                  <p>&copy; ${new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Invitation email sent:', data);
    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};