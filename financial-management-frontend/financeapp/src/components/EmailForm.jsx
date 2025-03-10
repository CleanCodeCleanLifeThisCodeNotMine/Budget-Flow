import React, { useRef, useState } from 'react';
import { sendForm } from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs.config';

export const EmailForm = ({ templateId, onSuccess, onError, buttonText = 'Send' }) => {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await sendForm(
        EMAILJS_CONFIG.serviceId,
        templateId,
        form.current,
        EMAILJS_CONFIG.publicKey
      );
      
      setIsLoading(false);
      if (onSuccess) onSuccess(result);
      form.current.reset();
    } catch (error) {
      setIsLoading(false);
      console.error('Email sending failed:', error);
      if (onError) onError(error.text || 'Failed to send email');
    }
  };

  return (
    <form ref={form} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="user_name"
          id="user_name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="user_email"
          id="user_email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={4}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : buttonText}
      </button>
    </form>
  );
}; 