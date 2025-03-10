import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { activateAccount } from '../services/api';
import Link from 'next/link';

export default function ActivateAccount() {
  const router = useRouter();
  const { token } = router.query;
  
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    if (!token || !router.isReady) {
      return;
    }
    
    const activateUserAccount = async () => {
      try {
        await activateAccount(token);
        setIsSuccess(true);
        setMessage('Your account has been successfully activated! You can now login.');
      } catch (error) {
        setIsSuccess(false);
        setMessage(error.response?.data || 'Failed to activate account. The link may be expired or invalid.');
      } finally {
        setIsLoading(false);
      }
    };
    
    activateUserAccount();
  }, [token, router.isReady]);

  if (isLoading && token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Activating your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Account Activation
          </h2>
        </div>
        
        {!token && !isLoading && (
          <div className="rounded-md p-4 bg-red-50">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  Invalid activation link. Please check your email for the correct link.
                </p>
              </div>
            </div>
          </div>
        )}
        
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
        
        <div className="text-center mt-4">
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
} 