import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { confirmPasswordReset } from '../services/api';
import Link from 'next/link';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm();
  
  const password = watch('password', '');

  useEffect(() => {
    if (!token && router.isReady) {
      setMessage('Invalid or missing reset token. Please request a new password reset link.');
      setIsSuccess(false);
    }
  }, [token, router.isReady]);

  const onSubmit = async (data) => {
    if (!token) {
      setMessage('Invalid or missing reset token. Please request a new password reset link.');
      setIsSuccess(false);
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    
    try {
      await confirmPasswordReset(token, data.password);
      setIsSuccess(true);
      setMessage('Password reset successful! You can now login with your new password.');
    } catch (error) {
      setIsSuccess(false);
      // Ensure we're not trying to render an object directly
      const errorMessage = error.response?.data 
        ? (typeof error.response.data === 'string' 
            ? error.response.data 
            : JSON.stringify(error.response.data))
        : 'Failed to reset password. The link may be expired or invalid.';
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
            Reset your password
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Enter your new password below
          </p>
        </div>
        
        {message && (
          <div className={isSuccess ? 'alert alert-success' : 'alert alert-danger'}>
            <p>{message}</p>
          </div>
        )}
        
        {isSuccess ? (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/login" style={{ color: '#4f46e5', fontWeight: '500' }}>
              Go to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>New Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="form-control"
                placeholder="New password"
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
                placeholder="Confirm new password"
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
                disabled={isSubmitting || !token}
                className="btn"
                style={{ width: '100%' }}
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link href="/login" style={{ color: '#4f46e5', fontWeight: '500', fontSize: '0.875rem' }}>
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 