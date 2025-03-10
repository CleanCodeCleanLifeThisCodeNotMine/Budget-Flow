import { sendForm, init } from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs.config';

// Initialize EmailJS with your Public API key
export const initEmailJS = () => {
  init(EMAILJS_CONFIG.publicKey);
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetLink) => {
  const templateParams = {
    to_email: email,
    reset_link: resetLink
  };
  
  try {
    const response = await sendForm(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.resetTemplateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error: error.text || 'Failed to send email' };
  }
};

// Send account activation email
export const sendActivationEmail = async (email, activationLink) => {
  const templateParams = {
    to_email: email,
    activation_link: activationLink
  };
  
  try {
    const response = await sendForm(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.activationTemplateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send activation email:', error);
    return { success: false, error: error.text || 'Failed to send email' };
  }
}; 