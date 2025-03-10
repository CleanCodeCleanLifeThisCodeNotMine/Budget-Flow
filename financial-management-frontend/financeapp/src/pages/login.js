import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/Login.module.css';

function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  const handleChange = (e) => {
    setError('');
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Giả lập đăng nhập thành công
      if (formData.identifier && formData.password) {
        // Tạo mock user data
        const userData = {
          id: 1,
          username: formData.identifier,
          email: formData.identifier.includes('@') ? formData.identifier : `${formData.identifier}@example.com`,
          displayName: formData.identifier,
          createdAt: new Date().toISOString()
        };

        // Lưu thông tin đăng nhập
        localStorage.setItem('userToken', 'mock-token-123');
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Chuyển hướng đến dashboard
        router.push('/dashboard');
      } else {
        throw new Error('Vui lòng nhập đầy đủ thông tin');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1>Đăng Nhập</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="identifier">Tên đăng nhập hoặc Email</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Nhập tên đăng nhập hoặc email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className={styles.links}>
          <Link href="/register">
            Chưa có tài khoản? Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;