import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { login } from '../services/api';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await login(data.username, data.password);
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
    } catch (error) {
      // Ensure we're not trying to render an object directly
      const errorMessage = error.response?.data 
        ? (typeof error.response.data === 'string' 
            ? error.response.data 
            : JSON.stringify(error.response.data))
        : 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Sign in to your account
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Or{' '}
            <Link href="/register" style={{ color: '#4f46e5', fontWeight: '500' }}>
              create a new account
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            <p>{error}</p>
          </div>
        )}
        
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
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && (
              <p style={{ color: '#b91c1c', fontSize: '0.875rem', marginTop: '0.5rem' }}>{errors.username.message}</p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-control"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p style={{ color: '#b91c1c', fontSize: '0.875rem', marginTop: '0.5rem' }}>{errors.password.message}</p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <Link href="/forgot-password" style={{ color: '#4f46e5', fontWeight: '500', fontSize: '0.875rem' }}>
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn"
            style={{ width: '100%' }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
} 