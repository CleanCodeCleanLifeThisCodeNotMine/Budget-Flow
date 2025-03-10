import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function DeleteAccount() {
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = window.confirm('Bạn có chắc chắn muốn xoá tài khoản? Hành động này sẽ không thể hoàn tác.');
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete('http://localhost:8080/api/user/delete-account', {
                params: { password },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success === "true") {
                alert("Xóa tài khoản thành công!");
                localStorage.clear();
                router.push('/register');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Lỗi: " + error.response.data.message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 my-10 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold text-center mb-5">Xoá Tài Khoản</h2>
            <p className="text-red-600 text-center mb-5">
                Hành động này sẽ xóa tất cả thông tin liên quan của bạn và không thể hoàn tác.
            </p>

            <input
                type="password"
                placeholder="Nhập mật khẩu để xác nhận"
                className="border border-gray-300 rounded p-3 w-full mb-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={handleDelete}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded w-full"
            >
                Tôi chắc chắn xoá tài khoản
            </button>
        </div>
    );
}
