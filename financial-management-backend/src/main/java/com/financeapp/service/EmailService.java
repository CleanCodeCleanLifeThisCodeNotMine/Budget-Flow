package com.financeapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private final RestTemplate restTemplate;
    
    @Value("${emailjs.service.id}")
    private String serviceId;
    
    @Value("${emailjs.template.reset.id}")
    private String resetTemplateId;
    
    @Value("${emailjs.template.activation.id}")
    private String activationTemplateId;
    
    @Value("${emailjs.user.id}")
    private String userId;
    
    @Value("${emailjs.api.url}")
    private String apiUrl;

    public EmailService() {
        this.restTemplate = new RestTemplate();
    }

    public void sendPasswordResetEmail(String email, String resetLink) {
        Map<String, Object> templateParams = new HashMap<>();
        templateParams.put("to_email", email);
        templateParams.put("reset_link", resetLink);
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("service_id", serviceId);
        requestBody.put("template_id", resetTemplateId);
        requestBody.put("user_id", userId);
        requestBody.put("template_params", templateParams);
        
        restTemplate.postForObject(apiUrl, requestBody, String.class);
    }
    
    public void sendActivationEmail(String email, String activationLink) {
        Map<String, Object> templateParams = new HashMap<>();
        templateParams.put("to_email", email);
        templateParams.put("activation_link", activationLink);
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("service_id", serviceId);
        requestBody.put("template_id", activationTemplateId);
        requestBody.put("user_id", userId);
        requestBody.put("template_params", templateParams);
        
        restTemplate.postForObject(apiUrl, requestBody, String.class);
    }
} 