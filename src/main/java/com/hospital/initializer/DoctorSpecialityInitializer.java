package com.hospital.initializer;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.hospital.entity.DoctorSpecialityEntity;
import com.hospital.model.DoctorSpeciality;
import com.hospital.repository.DoctorSpecialityRepository;

import jakarta.annotation.PostConstruct;

@Component
public class DoctorSpecialityInitializer implements CommandLineRunner {

    private final DoctorSpecialityRepository repository;

    public DoctorSpecialityInitializer(DoctorSpecialityRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        try {
            for (DoctorSpeciality speciality : DoctorSpeciality.values()) {
                if (!repository.existsByUzmanlik(speciality)) {
                    DoctorSpecialityEntity entity = new DoctorSpecialityEntity();
                    entity.setUzmanlik(speciality);
                    entity.setDisplayName(speciality.getDisplayName());
                    repository.save(entity);
                    System.out.println("Saved speciality: " + speciality);
                } else {
                    System.out.println("Speciality already exists: " + speciality);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("An error occurred: " + e.getMessage());
        }
    }

    @PostConstruct
    public void init() {
        System.out.println("DoctorSpecialityInitializer is initialized");
    }
}