package com.collincorp.houserental.service;

import com.collincorp.houserental.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailVerificationService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    // Stores email -> verification code mapping
    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();

    // Stores email -> temporary registration details before DB insertion
    private final Map<String, RegisterRequest> pendingRegistrations = new ConcurrentHashMap<>();

    public EmailVerificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void queuePendingRegistration(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        // 1. Cache the registration details
        pendingRegistrations.put(email, request);

        // 2. Generate and cache a 6-digit random number
        String code = String.format("%06d", new Random().nextInt(1000000));
        verificationCodes.put(email, code);

        // 3. Send email asynchronously or synchronously
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(email);
        message.setSubject("Complete Your Registration - Verification Code");
        message.setText("Your 6-digit registration verification code is: " + code+"\n"+
         "Please Do not share with anyone , this is for security purpose "+"\n"+"\n"+" "+
                "!!! Warning Use it Before exipiration time and if it expired request new verification code."
        );

        mailSender.send(message);
    }

    public boolean verifyCode(String email, String code) {
        String cleanEmail = email.trim().toLowerCase();
        if (verificationCodes.containsKey(cleanEmail) && verificationCodes.get(cleanEmail).equals(code)) {
            verificationCodes.remove(cleanEmail); // Clear token instantly upon use
            return true;
        }
        return false;
    }

    public RegisterRequest getAndClearPendingRegistration(String email) {
        return pendingRegistrations.remove(email.trim().toLowerCase());
    }
}