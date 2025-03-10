import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OAuth2RedirectHandler() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (!token) return;

    // Lưu token vào localStorage
    localStorage.setItem('token', token);
    
    // Chuyển hướng về trang dashboard
    router.push('/dashboard');
  }, [token, router]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Đang xử lý đăng nhập...
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Vui lòng đợi trong giây lát.
        </p>
      </div>
    </div>
  );
} 