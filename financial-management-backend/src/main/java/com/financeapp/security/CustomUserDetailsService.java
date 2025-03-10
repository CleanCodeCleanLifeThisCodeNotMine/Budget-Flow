package com.financeapp.security;

import com.financeapp.model.User;
import com.financeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với username: " + username));

        if (!user.isEnabled()) {
            throw new UsernameNotFoundException("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt.");
        }

        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        // Thêm quyền mặc định cho user
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        
        // Nếu user đăng nhập qua OAuth, cho phép đăng nhập không cần mật khẩu
        String password = user.getOauthProvider() != null ? "" : user.getPassword();

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                password,
                user.isEnabled(),
                true, // account non-expired
                true, // credentials non-expired
                true, // account non-locked
                authorities
        );
    }

    // Phương thức hỗ trợ tìm user bằng email (cho OAuth2)
    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.isEnabled(),
                true,
                true,
                true,
                authorities
        );
    }
}
