import env from '../config/env.js';

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