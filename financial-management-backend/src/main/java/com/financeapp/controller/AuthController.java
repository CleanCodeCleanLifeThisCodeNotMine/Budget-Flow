package com.financeapp.controller;

import com.financeapp.dto.LoginRequest;
import com.financeapp.dto.RegisterRequest;
import com.financeapp.dto.JwtResponse;
import com.financeapp.model.Role;
import com.financeapp.model.RoleName;
import com.financeapp.model.User;
import com.financeapp.repository.RoleRepository;
import com.financeapp.repository.UserRepository;
import com.financeapp.security.JwtUtils;
import com.financeapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("success", "false", "message", "Username is already taken!"));
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("success", "false", "message", "Email is already in use!"));
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEnabled(false); // Tài khoản chưa kích hoạt

        userRepository.save(user); // Lưu vào DB trước

        // Tạo token kích hoạt
        Map<String, String> activationData = userService.createActivationToken(user);

        return ResponseEntity.ok(activationData); // Gửi token về cho client
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = userRepository.findByUsername(loginRequest.getUsername());

        if (user.isEmpty() || !user.get().isEnabled()) {
            return ResponseEntity.badRequest().body(Map.of("success", "false", "message", "User not found or account not activated."));
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(authentication);

        return ResponseEntity.ok(new JwtResponse(jwt));
    }

}
