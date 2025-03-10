import { init, send } from '@emailjs/browser';

// Initialize EmailJS with your Public API key
export const initEmailJS = () => {
  init('6xS7gVcnrNq7WUmDe');
};

// EmailJS service and template IDs
export const EMAILJS_CONFIG = {
  serviceId: 'service_fl181h7',
  resetTemplateId: 'your_reset_template_id',
  activationTemplateId: 'template_2g5m1mb'
};

// Send password reset email
export const sendPasswordResetEmail = (email, resetLink) => {
  const templateParams = {
    to_email: email,
    reset_link: resetLink
  };
  
  return send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.resetTemplateId,
    templateParams,
    '6xS7gVcnrNq7WUmDe' // Public key
  );
};

// Send account activation email
export const sendActivationEmail = (email, activationLink) => {
  const templateParams = {
    to_email: email,
    activation_link: activationLink
  };
  
  return send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.activationTemplateId,
    templateParams,
    '6xS7gVcnrNq7WUmDe' // Public key
  );
}; 