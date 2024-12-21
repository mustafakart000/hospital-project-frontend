package com.hospital.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.dto.DoctorRequest;
import com.hospital.dto.Response.DoctorResponseList;
import com.hospital.dto.Response.GetFullDoctorResponse;
import com.hospital.entity.Doctor;
import com.hospital.exception.NotFoundException;
import com.hospital.mapper.DoctorMapper;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.DoctorSpecialityRepository;
import com.hospital.repository.UserRepository;

@Service
public class DoctorService {

    private final DoctorSpecialityRepository doctorSpecialityRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;

    public DoctorService(DoctorSpecialityRepository doctorSpecialityRepository, 
                            UserRepository userRepository,
                            DoctorRepository doctorRepository,
                            
                            DoctorMapper doctorMapper) {
        this.doctorSpecialityRepository = doctorSpecialityRepository;
        
        this.doctorRepository = doctorRepository;
        this.doctorMapper = doctorMapper;
        
    }

    @NonNull
    public List<Map<String, String>> getAllSpecialties() {
        return doctorSpecialityRepository.findAll()
            .stream()
            .map(speciality -> Map.of("id", speciality.getId().toString(), "name", speciality.getDisplayName()))
            .toList();
    }

    public List<DoctorResponseList> getAllDoctors() {
        return doctorRepository.findAll().stream()
        .map(doctor -> DoctorResponseList.builder()
            .id(doctor.getId())
            .ad(doctor.getAd())
            .soyad(doctor.getSoyad())
            .speciality(doctor.getUzmanlik().getDisplayName())
            .email(doctor.getEmail())
            .phone(doctor.getTelefon())
            .address(doctor.getAdres())
            .build())
        .toList();
    }
    
    public GetFullDoctorResponse getDoctorById(Long id) {
        return doctorRepository.findById(id)
            .map(doctor -> GetFullDoctorResponse.builder()
                .username(doctor.getUsername())
                .id(doctor.getId())
                .ad(doctor.getAd())
                .soyad(doctor.getSoyad())
                .speciality(doctor.getUzmanlik().getDisplayName())
                .email(doctor.getEmail())
                .phone(doctor.getTelefon())
                .address(doctor.getAdres())
                .birthDate(doctor.getBirthDate())
                .tcKimlik(doctor.getTcKimlik())
                .kanGrubu(doctor.getKanGrubu())
                .diplomaNo(doctor.getDiplomaNo())
                .unvan(doctor.getUnvan())
                .build())
            .orElseThrow(() -> new NotFoundException("Doctor not found"));
    }

 
    public void deleteDoctor(Long id) {
        doctorRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctorRepository.deleteById(id);
    }
    @Transactional
    public ResponseEntity<HttpStatus> updateDoctor(Long id, DoctorRequest doctorRequest) {
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctorMapper.toDoctor(doctor, doctorRequest);
        doctorRepository.save(doctor);
        return ResponseEntity.ok(HttpStatus.OK);
    }

       
}
