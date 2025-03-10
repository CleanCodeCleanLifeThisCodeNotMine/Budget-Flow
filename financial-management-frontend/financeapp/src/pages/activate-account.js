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
        const errorMessage = error.response?.data 
          ? (typeof error.response.data === 'string' 
              ? error.response.data 
              : JSON.stringify(error.response.data))
          : 'Failed to activate account. The link may be expired or invalid.';
        setMessage(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    activateUserAccount();
  }, [token, router.isReady]);

  if (isLoading && token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-block', 
            width: '3rem', 
            height: '3rem', 
            borderRadius: '50%', 
            borderBottom: '2px solid #4f46e5',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Activating your account...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Account Activation
          </h2>
        </div>
        
        {!token && !isLoading && (
          <div className="alert alert-danger">
            <p>Invalid activation link. Please check your email for the correct link.</p>
          </div>
        )}
        
        {message && (
          <div className={isSuccess ? 'alert alert-success' : 'alert alert-danger'}>
            <p>{message}</p>
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/login" style={{ color: '#4f46e5', fontWeight: '500' }}>
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
} 