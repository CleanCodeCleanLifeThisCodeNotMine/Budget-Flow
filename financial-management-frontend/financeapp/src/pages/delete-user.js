"use client"; // Nếu Next.js 13+

import { useState, useEffect } from "react";

export default function DeleteUserPage() {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (storedToken) {
      setToken(storedToken);
      setCurrentUser(storedUser);
      setRole(storedRole);

      if (storedRole === "ADMIN") {
        fetchUsers(storedToken);
      }
    }
    setLoading(false);
  }, []);

  const fetchUsers = async (token) => {
    try {
      const res = await fetch("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể lấy danh sách người dùng");

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi API:", error);
    }
  };

  const deleteUser = async (username) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ${username}?`)) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/user/delete/${username}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        alert(`Xóa thành công user: ${username}`);
        setUsers(users.filter((user) => user.username !== username));

        if (username === currentUser) {
          localStorage.clear();
          window.location.href = "/login";
        }
      } else {
        const data = await res.text();
        alert(`Lỗi: ${data}`);
      }
    } catch (error) {
      console.error("Lỗi xóa user:", error);
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Xóa tài khoản người dùng
        </h1>

        {role === "ADMIN" && users.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-gray-600 mb-3">
              Danh sách người dùng
            </h2>
            <ul>
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <span>{user.username}</span>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deleteUser(user.username)}
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {role === "USER" && (
          <div className="mt-6">
            <p className="text-gray-700">Bạn có thể xóa tài khoản của mình.</p>
            <button
              className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => deleteUser(currentUser)}
            >
              Xóa tài khoản của tôi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
