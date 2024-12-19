package com.hospital;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.hospital.initializer.DoctorSpecialityInitializer;
import com.hospital.service.UserService;

@SpringBootApplication
public class HospitalApplication implements CommandLineRunner {
    @Autowired
    private UserService userService;
    
    @Autowired
    private DoctorSpecialityInitializer specialityInitializer;

    public static void main(String[] args) {
        SpringApplication.run(HospitalApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        userService.createAdminUser();
        specialityInitializer.run(args);  // DoctorSpecialityInitializer'ı çalıştır
    }
}
