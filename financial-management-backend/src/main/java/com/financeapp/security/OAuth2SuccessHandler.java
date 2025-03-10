package com.financeapp.security;

import com.financeapp.model.User;
import com.financeapp.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @Value("${app.oauth2.redirectUri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("login"); // GitHub username
        
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        
        if (existingUser.isEmpty()) {
            // Tạo user mới nếu chưa tồn tại
            user = new User();
            user.setEmail(email);
            user.setUsername(name);
            user.setEnabled(true); // User từ GitHub đã được xác thực
            user.setPassword(""); // Không cần password vì dùng OAuth
            userRepository.save(user);
        } else {
            user = existingUser.get();
        }

        // Tạo JWT token
        String token = jwtUtils.generateTokenFromUsername(user.getUsername());
        
        // Chuyển hướng về frontend với token
        String targetUrl = redirectUri + "?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
} 