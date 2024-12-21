package com.hospital.controller;

import java.util.List;
import java.util.Map;
import com.hospital.dto.DoctorRegisterRequest;
import com.hospital.dto.LoginRequest;
import com.hospital.dto.RegisterRequest;
import com.hospital.dto.UserDetailsResponse;
import com.hospital.dto.Response.LoginResponse;
import com.hospital.service.DoctorService;
import com.hospital.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService; // Kullanıcı servis sınıfı
    private final DoctorService doctorService ;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping("/doctor/login")
    public ResponseEntity<LoginResponse> doctorLogin(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.doctorLogin(request));
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerPatient(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok("Başarılı bir şekilde kayıt oldunuz.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/doctor/register")
    public ResponseEntity<String> addDoctorByAdmin(@Valid @RequestBody DoctorRegisterRequest request) {
        userService.registerDoctor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Doktor başarıyla eklendi");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/register")
    public ResponseEntity<String> addAdminByAdmin(@Valid @RequestBody RegisterRequest request) {
        userService.registerAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Admin başarıyla eklendi");
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetailsResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getCurrentUserDetails(userDetails));
    }

    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','PATIENT')") 
    @GetMapping("/allspecialties")
    public ResponseEntity<List<Map<String, String>>> getAllSpecialties() {
        System.out.println("getAllSpecialties" + doctorService.getAllSpecialties());
        return ResponseEntity.ok(doctorService.getAllSpecialties());
    };

    

}
