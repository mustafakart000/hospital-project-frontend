package com.hospital.service;

import org.springframework.stereotype.Service;

import com.hospital.repository.PatientRepository;
import com.hospital.dto.Response.PatientResponse;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.entity.Patient;

@Service
public class PatientService {
    
    private final PatientRepository patientRepository;


    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public PatientResponse getPatientById(Long id) {
        return patientRepository.findById(id)
            .map(patient -> PatientResponse.builder()
                .username(patient.getUsername())
                .id(patient.getId())
                .ad(patient.getAd())
                .soyad(patient.getSoyad())
                .email(patient.getEmail())
                .telefon(patient.getTelefon())
                .adres(patient.getAdres())
                .birthDate(patient.getBirthDate())
                .tcKimlik(patient.getTcKimlik())
                .kanGrubu(patient.getKanGrubu())
                .reservations(patient.getReservations())
                .doctors(patient.getDoctors())
                .medicalHistory(patient.getMedicalHistory())
                .role(patient.getRole())
                .build())
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
    }

}
