package com.financeapp.service;

import com.financeapp.model.User;
import com.financeapp.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    @Value("${app.frontend.url}")
    private String frontendUrl;
    
    @Value("${app.token.expiry.minutes}")
    private int tokenExpiryMinutes;

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Map<String, String> requestPasswordReset(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return Map.of("success", "false", "message", "Email not found");
        }
        
        User user = userOptional.get();
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(tokenExpiryMinutes));
        userRepository.save(user);
        
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        
        // For testing purposes, return the token instead of sending an email
        Map<String, String> response = new HashMap<>();
        response.put("success", "true");
        response.put("message", "Password reset link generated successfully");
        response.put("token", token);
        response.put("resetLink", resetLink);
        
        // Comment out the email sending for now
        // try {
        //     emailService.sendPasswordResetEmail(email, resetLink);
        // } catch (Exception e) {
        //     response.put("emailError", e.getMessage());
        // }
        
        return response;
    }
    
    public boolean confirmPasswordReset(String token, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetPasswordToken(token);
        if (userOptional.isEmpty()) {
            return false;
        }
        
        User user = userOptional.get();
        if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
        
        return true;
    }
    
    public Map<String, String> createActivationToken(User user) {
        String token = UUID.randomUUID().toString();
        user.setActivationToken(token);
        user.setActivationTokenExpiry(LocalDateTime.now().plusMinutes(tokenExpiryMinutes));
        userRepository.save(user);
        
        String activationLink = frontendUrl + "/activate-account?token=" + token;
        
        // For testing purposes, return the token instead of sending an email
        Map<String, String> response = new HashMap<>();
        response.put("success", "true");
        response.put("message", "Activation link generated successfully");
        response.put("token", token);
        response.put("activationLink", activationLink);
        
        // Comment out the email sending for now
        // try {
        //     emailService.sendActivationEmail(user.getEmail(), activationLink);
        // } catch (Exception e) {
        //     response.put("emailError", e.getMessage());
        // }
        
        return response;
    }
    
    public boolean activateAccount(String token) {
        Optional<User> userOptional = userRepository.findByActivationToken(token);
        if (userOptional.isEmpty()) {
            return false;
        }
        
        User user = userOptional.get();
        if (user.getActivationTokenExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }
        
        user.setEnabled(true);
        user.setActivationToken(null);
        user.setActivationTokenExpiry(null);
        userRepository.save(user);
        
        return true;
    }
}
