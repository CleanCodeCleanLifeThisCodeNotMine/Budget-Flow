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
      setMessage(error.response?.data || 'Failed to reset password. The link may be expired or invalid.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>
        
        {message && (
          <div className={`rounded-md p-4 ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex">
              <div className="ml-3">
                <p className={`text-sm font-medium ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                  {message}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {isSuccess ? (
          <div className="text-center mt-4">
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Go to login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="password" className="sr-only">New Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm new password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !token}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
            
            <div className="text-sm text-center">
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 