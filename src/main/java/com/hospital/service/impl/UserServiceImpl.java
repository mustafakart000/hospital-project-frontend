package com.hospital.service.impl;

import java.time.LocalDate;


import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hospital.dto.DoctorRegisterRequest;
import com.hospital.dto.LoginRequest;
import com.hospital.dto.RegisterRequest;
import com.hospital.dto.UserDetailsResponse;
import com.hospital.dto.Response.LoginResponse;
import com.hospital.entity.Admin;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.entity.User;
import com.hospital.exception.EmailAlreadyExistsException;
import com.hospital.exception.InvalidCredentialsException;
import com.hospital.exception.UserAlreadyExistsException;
import com.hospital.model.Role;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.UserRepository;
import com.hospital.security.JwtUtil;
import com.hospital.service.UserService;
import com.hospital.mapper.DoctorMapper;
import com.hospital.mapper.PatientMapper;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

// Kullanıcı işlemlerini yöneten servis sınıfı
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository; // Kullanıcı veritabanı işlemleri için
    private final PasswordEncoder passwordEncoder; // Şifreleme işlemleri için
    private final JwtUtil jwtUtil; // JWT token işlemleri için
    private final AuthenticationManager authenticationManager; // Kimlik doğrulama işlemleri için
    private final DoctorRepository doctorRepository; // Doktor veritabanı işlemleri için

@PersistenceContext
    private EntityManager entityManager;

    

    @Override
    public void createAdminUser() {
        String adminPassword = "admin123";
        String adminTcKimlik = "admin";
        
        if (!userRepository.existsByUsername(adminTcKimlik)) {
            Admin adminUser = new Admin();
            adminUser.setUsername(adminTcKimlik);
            adminUser.setTcKimlik("22345678901");
            adminUser.setPassword(passwordEncoder.encode(adminPassword));
            adminUser.setRole(Role.ADMIN.name());
            adminUser.setAd("Admin");
            adminUser.setSoyad("User");
            adminUser.setEmail("admin1@example.com");
            adminUser.setTelefon("1234567890");
            adminUser.setBirthDate(LocalDate.of(1990, 1, 1));
            adminUser.setKanGrubu("A Rh+");
            adminUser.setAdres("Admin Address");
                

            userRepository.save(adminUser);
            System.out.println("Admin kullanıcısı oluşturuldu: " + adminTcKimlik);
        }
    }
    @Override
    public LoginResponse login(LoginRequest request) {
        // Kullanıcı kimlik doğrulaması yapar
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Kullanıcı adı veya şifre hatalı");
        }
        
        // Kullanıcıyı veritabanından bulur
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new InvalidCredentialsException("Kullanıcı bulunamadı"));
            
        // Kullanıcı için JWT token oluşturur
        String token = jwtUtil.generateToken(user.getUsername());
        
        // Giriş yanıtı oluşturur ve döner
        return LoginResponse.builder()
            .username(user.getUsername())
            .role(user.getRole())
            .token(token)
            .id(user.getId())
            .message("Giriş başarılı")
            .build();
    }

    @Override
public void register(RegisterRequest request) {
    // TC Kimlik kontrolü
    if (userRepository.existsByTcKimlik(request.getTcKimlik())) {
        throw new UserAlreadyExistsException("Bu TC Kimlik numarası zaten kullanılıyor: " + request.getTcKimlik());
    } else if (userRepository.existsByEmail(request.getEmail())) {
        throw new EmailAlreadyExistsException("Bu email adresi zaten kullanılıyor: " + request.getEmail());
    }

    // PatientMapper kullanarak yeni hasta oluştur
    Patient patient = PatientMapper.mapToPatient(request, passwordEncoder);

    userRepository.save(patient);
}

@Override
@PreAuthorize("hasRole('ADMIN')")
public void registerAdmin(RegisterRequest request) {
      // Kullanıcı adı zaten varsa hata fırlatır
      if (userRepository.existsByTcKimlik(request.getTcKimlik())) {
        throw new UserAlreadyExistsException("Bu kullanıcı adı zaten kullanılıyor");
    }
    // Admin kaydı işlemleri burada gerçekleştirilebilir
    Admin admin = new Admin();
    admin.setPassword(passwordEncoder.encode(request.getPassword())); // Şifreyi şifrele
    admin.setRole(Role.ADMIN.name()); // Admin rolünü ata
    admin.setAd(request.getAd());
    admin.setSoyad(request.getSoyad());
    admin.setEmail(request.getEmail());
    admin.setTelefon(request.getTelefon());
    admin.setAdres(request.getAdres());
    admin.setBirthDate(request.getBirthDate());
    admin.setTcKimlik(request.getTcKimlik()); // T.C. Kimlik numarasını ekle
    userRepository.save(admin);
}

@Override
public LoginResponse doctorLogin(LoginRequest request) {
    try {
        // Doktoru TC Kimlik ile bul
        Doctor doctor = doctorRepository.findByTcKimlik(request.getTcKimlik())
            .orElseThrow(() -> new InvalidCredentialsException("Doktor bulunamadı"));
           
        // Şifre kontrolü
        if (!passwordEncoder.matches(request.getPassword(), doctor.getPassword())) {
            throw new InvalidCredentialsException("TC Kimlik veya şifre hatalı");
        }
        
        if (!doctor.getRole().equals(Role.DOCTOR.name())) {
            throw new InvalidCredentialsException("Bu giriş sadece doktorlar içindir");
        }
        
        String token = jwtUtil.generateToken(doctor.getTcKimlik());
        
        return LoginResponse.builder()
            .role(doctor.getRole())
            .token(token)
            .id(doctor.getId())
            .message("Doktor girişi başarılı")
            .build();
    } catch (AuthenticationException e) {
        throw new InvalidCredentialsException("TC Kimlik veya şifre hatalı");
    }
}
@Override
public UserDetailsResponse getCurrentUserDetails(UserDetails userDetails) {
    //Kullanıcı detaylarını döndürür
    User user = userRepository.findByUsername(userDetails.getUsername())
        .map(u -> (User) u)
        .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
    // UserDetailsResponse nesnesini oluştur ve doldur
    return UserDetailsResponse.builder()
    

    .username(user.getUsername())
    .email(user.getEmail())
    .role(user.getRole())
    .id(user.getId())
    .build();
}

@Override
@PreAuthorize("hasRole('ADMIN')")
public void registerDoctor(DoctorRegisterRequest request) {
    if (userRepository.existsByTcKimlik(request.getTcKimlik())) {
        throw new UserAlreadyExistsException("Bu kullanıcı adı zaten kullanılıyor" + request.getTcKimlik());
    } else if (userRepository.existsByEmail(request.getEmail())) {
        throw new EmailAlreadyExistsException("Email already exists: " + request.getEmail());
    }
    
    Doctor doctor = DoctorMapper.mapToDoctor(request, passwordEncoder);
    userRepository.save(doctor);
}



}