package com.financeapp.repository;

import com.financeapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    // Thêm phương thức kiểm tra username đã tồn tại hay chưa
    boolean existsByUsername(String username);

    // Thêm phương thức kiểm tra email đã tồn tại hay chưa
    boolean existsByEmail(String email);

    // Tìm kiếm user bằng token đặt lại mật khẩu
    Optional<User> findByResetPasswordToken(String resetPasswordToken);

    Optional<User> findByActivationToken(String activationToken);
}
