import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { requestPasswordReset } from '../services/api';
import Link from 'next/link';

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetLink, setResetLink] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setMessage('');
    setResetLink('');
    
    try {
      const response = await requestPasswordReset(data.email);
      setIsSuccess(true);
      
      // Check if the response contains a reset link
      if (response.data && response.data.resetLink) {
        setResetLink(response.data.resetLink);
        setMessage('Password reset link generated! Use the link below to reset your password.');
      } else {
        setMessage('Password reset email sent! Please check your inbox.');
      }
    } catch (error) {
      setIsSuccess(false);
      const errorMessage = error.response?.data 
        ? (typeof error.response.data === 'string' 
            ? error.response.data 
            : error.response.data.message || JSON.stringify(error.response.data))
        : 'Failed to send reset email. Please try again.';
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Forgot your password?
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        {message && (
          <div className={isSuccess ? 'alert alert-success' : 'alert alert-danger'}>
            <p>{message}</p>
          </div>
        )}
        
        {resetLink && (
          <div className="alert alert-info" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <p>Reset Link (for testing):</p>
            <a href={resetLink} style={{ wordBreak: 'break-all', color: '#4f46e5' }}>
              {resetLink}
            </a>
          </div>
        )}
        
        {!isSuccess && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-control"
                placeholder="Email address"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p style={{ color: '#b91c1c', fontSize: '0.875rem', marginTop: '0.5rem' }}>{errors.email.message}</p>
              )}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn"
                style={{ width: '100%' }}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link href="/login" style={{ color: '#4f46e5', fontWeight: '500', fontSize: '0.875rem' }}>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
} 