package com.hospital.service;

import com.hospital.dto.RegisterRequest;
import com.hospital.dto.DoctorRegisterRequest;
import com.hospital.dto.LoginRequest;
import com.hospital.dto.UserDetailsResponse;
import com.hospital.dto.Response.LoginResponse;

import org.springframework.security.core.userdetails.UserDetails;

// Kullanıcı işlemleri için arayüz
public interface UserService {
    LoginResponse login(LoginRequest request); // Kullanıcı girişi için metod
    LoginResponse doctorLogin(LoginRequest request); // Kullanıcı girişi için metod
    void register(RegisterRequest request); // Kullanıcı kaydı için metod
    void registerDoctor(DoctorRegisterRequest request); // Doktor kaydı için metod
    void registerAdmin(RegisterRequest request); // Doktor kaydı için metod
    void createAdminUser(); // Admin kullanıcı oluşturma metodu
    UserDetailsResponse getCurrentUserDetails(UserDetails userDetails);
    
} 