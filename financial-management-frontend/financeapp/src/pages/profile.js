import { useState, useEffect } from "react";
import styles from "../styles/Profile.module.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    // Kiểm tra localStorage có dữ liệu không
    const storedProfile = localStorage.getItem("profile");
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setProfile(parsedProfile);
      setEditedProfile(parsedProfile);
      setAvatarPreview(parsedProfile.avatar);
    } else {
      // Nếu không có, lấy từ JSON file mặc định
      fetch("/profile.json")
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          setEditedProfile(data);
          setAvatarPreview(data.avatar);
          localStorage.setItem("profile", JSON.stringify(data)); // Lưu vào localStorage
        })
        .catch((error) => console.error("Lỗi tải dữ liệu:", error));
    }
  }, []);

  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      setEditedProfile({ ...editedProfile, avatar: imageUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(editedProfile);
    setIsEditing(false);
    localStorage.setItem("profile", JSON.stringify(editedProfile)); // Lưu thay đổi vào localStorage
    alert("Cập nhật thành công!");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Thông tin hồ sơ</h2>

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.avatarContainer}>
            <img src={avatarPreview} alt="Avatar" className={styles.avatar} />
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Họ và Tên:</label>
            <input
              type="text"
              name="name"
              value={editedProfile.name}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editedProfile.email}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={editedProfile.phone}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={editedProfile.address}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>Lưu</button>
            <button type="button" onClick={handleCancel} className={styles.cancelButton}>Hủy</button>
          </div>
        </form>
      ) : profile ? (
        <div className={styles.profileInfo}>
          <img src={profile.avatar} alt="Avatar" className={styles.avatar} />
          <p><strong>Họ và Tên:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Số điện thoại:</strong> {profile.phone}</p>
          <p><strong>Địa chỉ:</strong> {profile.address}</p>
          <button onClick={handleEditClick} className={styles.button}>Sửa</button>
        </div>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}
