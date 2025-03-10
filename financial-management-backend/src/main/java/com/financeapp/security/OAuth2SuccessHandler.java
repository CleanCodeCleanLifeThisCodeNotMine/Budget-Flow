package com.financeapp.security;

import com.financeapp.model.User;
import com.financeapp.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Slf4j
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
        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            log.info("OAuth2 login successful for user: {}", oAuth2User.getAttribute("login"));
            
            String email = oAuth2User.getAttribute("email");
            if (email == null) {
                log.error("Email not found in OAuth2 user attributes");
                response.sendRedirect(redirectUri + "?error=Email not found");
                return;
            }

            String name = oAuth2User.getAttribute("login");
            if (name == null) {
                log.error("Username not found in OAuth2 user attributes");
                response.sendRedirect(redirectUri + "?error=Username not found");
                return;
            }

            String id = oAuth2User.getAttribute("id").toString();
            
            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;
            
            if (existingUser.isEmpty()) {
                log.info("Creating new user for OAuth2 login: {}", email);
                user = new User();
                user.setEmail(email);
                user.setUsername(name);
                user.setEnabled(true);
                user.setPassword(""); // Không cần password vì dùng OAuth
                user.setOauthProvider("github");
                user.setOauthId(id);
                userRepository.save(user);
            } else {
                user = existingUser.get();
                if (user.getOauthProvider() == null) {
                    log.info("Updating existing user with OAuth2 info: {}", email);
                    user.setOauthProvider("github");
                    user.setOauthId(id);
                    userRepository.save(user);
                }
            }

            String token = jwtUtils.generateTokenFromUsername(user.getUsername());
            log.info("Generated JWT token for user: {}", user.getUsername());
            
            String targetUrl = redirectUri + "?token=" + token;
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
            
        } catch (Exception e) {
            log.error("Error during OAuth2 success handling", e);
            response.sendRedirect(redirectUri + "?error=" + e.getMessage());
        }
    }
} 