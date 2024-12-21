package com.hospital.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.hospital.service.UserService;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {
    
    private final UserService userService;

    @Override
    public void run(String... args) {
        userService.createAdminUser();
    }
} 