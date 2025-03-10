import React from 'react';
import { EmailForm } from './EmailForm';
import { EMAILJS_CONFIG } from '../config/emailjs.config';

export const ContactPage = () => {
  const handleSuccess = (result) => {
    console.log('Email sent successfully!', result);
  };

  const handleError = (error) => {
    console.error('Failed to send email:', error);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <EmailForm
        templateId={EMAILJS_CONFIG.activationTemplateId}
        onSuccess={handleSuccess}
        onError={handleError}
        buttonText="Send Message"
      />
    </div>
  );
}; 