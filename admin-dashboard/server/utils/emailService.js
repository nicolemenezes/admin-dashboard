import env from '../config/env.js';
import { Resend } from 'resend';

// Only initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'not_configured_yet'
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!resend) {
      console.warn('⚠ Email not sent - Resend API key not configured');
      console.log(`Would send email to: ${to}`);
      console.log(`Subject: ${subject}`);
      return { 
        success: false, 
        message: 'Email service not configured',
        mock: true 
      };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    console.log('✓ Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Admin Dashboard';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Welcome ${user.name}!</h1>
      <p>Thank you for joining our platform.</p>
      <p>Your account has been successfully created.</p>
      <p>Get started by logging in to your dashboard.</p>
      <a href="${process.env.FRONTEND_URL}/signin" 
         style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
        Go to Dashboard
      </a>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};

export const sendInvitationEmail = async (user, tempPassword) => {
  const subject = 'You have been invited to Admin Dashboard';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Welcome to Admin Dashboard!</h1>
      <p>Hi ${user.name},</p>
      <p>You have been invited to join our platform.</p>
      <p>Here are your login credentials:</p>
      <div style="background-color: #f5f5f5; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Email:</strong> ${user.email}</p>
        <p style="margin: 4px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>
      <p style="color: #ef4444; font-weight: 500;">⚠️ Please change your password after your first login.</p>
      <a href="${process.env.FRONTEND_URL}/signin" 
         style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
        Login Now
      </a>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Password Reset</h1>
      <p>Hi ${user.name},</p>
      <p>You requested a password reset for your account.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" 
         style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
        Reset Password
      </a>
      <p style="margin-top: 24px; color: #666;">This link will expire in 1 hour.</p>
      <p style="color: #666;">If you didn't request this, please ignore this email.</p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};

export const sendVerificationEmail = async (user, verificationToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  const subject = 'Verify Your Email';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Verify Your Email</h1>
      <p>Hi ${user.name},</p>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${verifyUrl}" 
         style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
        Verify Email
      </a>
      <p style="margin-top: 24px; color: #666;">This link will expire in 24 hours.</p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};

export const sendPasswordChangedEmail = async (user) => {
  const subject = 'Password Changed Successfully';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Password Changed</h1>
      <p>Hi ${user.name},</p>
      <p>Your password has been successfully changed.</p>
      <p>If you didn't make this change, please contact support immediately.</p>
      <a href="${process.env.FRONTEND_URL}/signin" 
         style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
        Login to Your Account
      </a>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendInvitationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendPasswordChangedEmail,
};