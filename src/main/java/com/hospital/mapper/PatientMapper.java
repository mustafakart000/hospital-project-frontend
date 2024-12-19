package com.hospital.mapper;

import com.hospital.dto.RegisterRequest;
import com.hospital.entity.Patient;
import com.hospital.model.Role;

import org.springframework.security.crypto.password.PasswordEncoder;

public class PatientMapper {

    public static Patient mapToPatient(RegisterRequest request, PasswordEncoder passwordEncoder) {
        Patient patient = new Patient();
        patient.setTcKimlik(request.getTcKimlik());
        patient.setPassword(passwordEncoder.encode(request.getPassword()));
        patient.setRole(Role.PATIENT.name());
        patient.setUsername(request.getUsername());
        patient.setAd(request.getAd());
        patient.setSoyad(request.getSoyad());
        patient.setEmail(request.getEmail());
        patient.setTelefon(request.getTelefon());
        patient.setAdres(request.getAdres());
        patient.setBirthDate(request.getBirthDate());
        patient.setKanGrubu(request.getKanGrubu());
        return patient;
    }
} 