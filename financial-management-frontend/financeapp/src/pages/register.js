import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { register as registerUser } from '../services/api';
import Link from 'next/link';

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [activationLink, setActivationLink] = useState('');
  
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
    setActivationLink('');
    
    try {
      const response = await registerUser(data.username, data.email, data.password);
      setIsSuccess(true);
      
      // Check if the response contains an activation link
      if (response.data && response.data.activationLink) {
        setActivationLink(response.data.activationLink);
        setMessage('Registration successful! Use the activation link below to activate your account.');
      } else {
        setMessage('Registration successful! Please check your email to activate your account.');
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
            <p>{message}</p>
          </div>
        )}
        
        {activationLink && (
          <div className="alert alert-info" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <p>Activation Link (for testing):</p>
            <a href={activationLink} style={{ wordBreak: 'break-all', color: '#4f46e5' }}>
              {activationLink}
            </a>
          </div>
        )}
        
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
                disabled={isSubmitting}
                className="btn"
                style={{ width: '100%' }}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        )}
        
        {isSuccess && !activationLink && (
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