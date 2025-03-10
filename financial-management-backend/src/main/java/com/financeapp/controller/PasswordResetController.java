package com.financeapp.controller;

import com.financeapp.dto.PasswordResetConfirmRequest;
import com.financeapp.dto.PasswordResetRequest;
import com.financeapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
@RequiredArgsConstructor
public class PasswordResetController {

    private final UserService userService;

    @PostMapping("/reset-request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody PasswordResetRequest request) {
        boolean success = userService.requestPasswordReset(request.getEmail());
        if (success) {
            return ResponseEntity.ok().body("Password reset email sent successfully");
        } else {
            return ResponseEntity.badRequest().body("Email not found");
        }
    }

    @PostMapping("/reset-confirm")
    public ResponseEntity<?> confirmPasswordReset(@RequestBody PasswordResetConfirmRequest request) {
        boolean success = userService.confirmPasswordReset(request.getToken(), request.getNewPassword());
        if (success) {
            return ResponseEntity.ok().body("Password reset successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
    }
} 