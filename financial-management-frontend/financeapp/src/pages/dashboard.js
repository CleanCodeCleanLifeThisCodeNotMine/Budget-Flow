import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/Dashboard.module.css';

function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');

    if (!token) {
      router.push('/login');
    } else {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Lỗi khi parse userData:', error);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        router.push('/login');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    router.push('/login');
  };

  if (!user) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.navbar}>
        <h1>Dashboard</h1>
        <div className={styles.userSection}>
          <span>Xin chào, {user.displayName || user.username}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Đăng xuất
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.userInfo}>
          <h2>Thông tin tài khoản</h2>
          <p><strong>Tên hiển thị:</strong> {user.displayName || user.username}</p>
          <p><strong>Tên đăng nhập:</strong> {user.username}</p>
        </div>

        <div className={styles.actions}>
          <Link href="/delete-account" className={styles.deleteButton}>
            Xóa tài khoản
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
