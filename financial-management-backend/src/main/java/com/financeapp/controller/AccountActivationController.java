package com.financeapp.controller;

import com.financeapp.dto.AccountActivationRequest;
import com.financeapp.model.User;
import com.financeapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountActivationController {

    private final UserService userService;

    @PostMapping("/activate")
    public ResponseEntity<?> activateAccount(@RequestBody AccountActivationRequest request) {
        boolean success = userService.activateAccount(request.getToken());
        if (success) {
            return ResponseEntity.ok().body("Account activated successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
    }
} 