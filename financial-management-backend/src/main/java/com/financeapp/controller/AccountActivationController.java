package com.financeapp.controller;

import com.financeapp.dto.AccountActivationRequest;
import com.financeapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountActivationController {

    private final UserService userService;

    @PostMapping("/activate")
    public ResponseEntity<?> activateAccount(@RequestBody Map<String, String> request) {
        String token = request.get("token");

        boolean success = userService.activateAccount(token);
        if (success) {
            return ResponseEntity.ok(Map.of("success", "true", "message", "Account activated successfully!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", "false", "message", "Invalid or expired token!"));
        }
    }
}

