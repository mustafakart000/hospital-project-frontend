package com.hospital.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String tcKimlik;
    private String password;
} 