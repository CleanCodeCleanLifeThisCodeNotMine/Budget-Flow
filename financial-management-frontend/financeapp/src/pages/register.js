import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { register as registerUser } from '../services/api';
import { sendForm } from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs.config';
import Link from 'next/link';

// EmailJS Template Variables Required:
// - to_email: The recipient's email address
// - activation_link: The activation link for the account

export default function Register() {
  const activationFormRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [activationData, setActivationData] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm();
  
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const response = await registerUser(data.username, data.email, data.password);
      setIsSuccess(true);
      
      // If the response contains an activation link, prepare to send an email
      if (response.data && response.data.activationLink) {
        setMessage(`Registration successful! Preparing activation email for ${data.email}...`);
        setActivationData({
          to_email: data.email,
          activation_link: response.data.activationLink
        });
      } else {
        setMessage(response.data.message || 'Registration successful! Please check your email to activate your account.');
      }
    } catch (error) {
      setIsSuccess(false);
      const errorMessage = error.response?.data 
        ? (typeof error.response.data === 'string' 
            ? error.response.data 
            : error.response.data.message || JSON.stringify(error.response.data))
        : 'Registration failed. Please try again.';
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendActivationEmail = async () => {
    if (!activationData) return;
    
    setIsSendingEmail(true);
    setMessage(`Sending activation email to ${activationData.to_email}...`);
    
    try {
      await sendForm(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.activationTemplateId,
        activationFormRef.current,
        EMAILJS_CONFIG.publicKey
      );
      
      setMessage(`Registration successful! Activation email has been sent to ${activationData.to_email}. Please check your email to activate your account.`);
    } catch (error) {
      console.error('Failed to send activation email:', error);
      setMessage(`Failed to send activation email to ${activationData.to_email}. Please try registering again.`);
      setIsSuccess(false);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Send activation email when activationData is set
  useEffect(() => {
    if (activationData) {
      sendActivationEmail();
    }
  }, [activationData]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Create a new account
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Or{' '}
            <Link href="/login" style={{ color: '#4f46e5', fontWeight: '500' }}>
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {message && (
          <div className={isSuccess ? 'alert alert-success' : 'alert alert-danger'}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>
          </div>
        )}
        
        {/* Hidden form for activation email */}
        <form ref={activationFormRef} style={{ display: 'none' }}>
          <input type="hidden" name="to_email" value={activationData?.to_email || ''} />
          <input type="hidden" name="activation_link" value={activationData?.activation_link || ''} />
        </form>
        
        {!isSuccess && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="form-control"
                placeholder="Username"
                {...register('username', { 
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  }
                })}
              />
              {errors.username && (
                <p style={{ color: '#b91c1c', fontSize: '0.875rem', marginTop: '0.5rem' }}>{errors.username.message}</p>
              )}
            </div>
            
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
            
            <div className="form-group">
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="form-control"
                placeholder="Password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
              />
              {errors.password && (
                <p style={{ color: '#b91c1c', fontSize: '0.875rem', marginTop: '0.5rem' }}>{errors.password.message}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="form-control"
                placeholder="Confirm password"
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && (
                <p style={{ color: '#b91c1c', fontSize: '0.875rem', marginTop: '0.5rem' }}>{errors.confirmPassword.message}</p>
              )}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="submit"
                disabled={isSubmitting || isSendingEmail}
                className="btn"
                style={{ width: '100%' }}
              >
                {isSubmitting ? 'Registering...' : isSendingEmail ? 'Sending Activation Email...' : 'Register'}
              </button>
            </div>
          </form>
        )}
        
        {isSuccess && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/login" style={{ color: '#4f46e5', fontWeight: '500' }}>
              Go to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 