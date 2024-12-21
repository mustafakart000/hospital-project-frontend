package com.hospital.mapper;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.hospital.dto.DoctorRegisterRequest;
import com.hospital.dto.DoctorRequest;
import com.hospital.entity.Doctor;
import com.hospital.model.DoctorSpeciality;
import com.hospital.model.Role;

import org.springframework.stereotype.Component;

@Component
public class DoctorMapper {
    private final PasswordEncoder passwordEncoder;
    public DoctorMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public static Doctor mapToDoctor(DoctorRegisterRequest request, PasswordEncoder passwordEncoder) {
        Doctor doctor = new Doctor();

        // TC Kimlik ve şifre
        doctor.setTcKimlik(request.getTcKimlik());
        doctor.setPassword(passwordEncoder.encode(request.getPassword()));

        // Rol ve diğer bilgiler
        doctor.setRole(Role.DOCTOR.name());
        doctor.setAd(request.getAd());
        doctor.setSoyad(request.getSoyad());
        doctor.setEmail(request.getEmail());
        doctor.setTelefon(request.getTelefon());
        doctor.setAdres(request.getAdres());
        doctor.setBirthDate(request.getBirthDate());
        doctor.setKanGrubu(request.getKanGrubu());
        doctor.setUsername(request.getUsername());
        // Doktor-spesifik bilgiler
        doctor.setDiplomaNo(request.getDiplomaNo());
        doctor.setUnvan(request.getUnvan());
        
        doctor.setUzmanlik(DoctorSpeciality.getByDisplayName(request.getUzmanlik().trim()));
        

        return doctor;
    }
    
    public static Doctor toDoctor(DoctorRequest doctorRequest) {
        Doctor doctor = new Doctor();
        doctor.setPassword(doctorRequest.getPassword());
        doctor.setAd(doctorRequest.getAd());
        doctor.setSoyad(doctorRequest.getSoyad());
        doctor.setEmail(doctorRequest.getEmail());
        doctor.setTelefon(doctorRequest.getTelefon());
        doctor.setAdres(doctorRequest.getAdres());
        doctor.setBirthDate(doctorRequest.getBirthDate());
        doctor.setTcKimlik(doctorRequest.getTcKimlik());
        doctor.setKanGrubu(doctorRequest.getKanGrubu());
        doctor.setDiplomaNo(doctorRequest.getDiplomaNo());
        doctor.setUnvan(doctorRequest.getUnvan());
        doctor.setUzmanlik(DoctorSpeciality.getByDisplayName(doctorRequest.getUzmanlik().trim()));
        System.out.println("doctor.getUzmanlik() = " + doctor.getUzmanlik());

        return doctor;
    }
    
    public void toDoctor(Doctor doctor, DoctorRequest doctorRequest) {
        
        doctor.setUsername(doctorRequest.getUsername());
        doctor.setAd(doctorRequest.getAd());
        doctor.setSoyad(doctorRequest.getSoyad());
        doctor.setEmail(doctorRequest.getEmail());
        doctor.setTelefon(doctorRequest.getTelefon());
        doctor.setAdres(doctorRequest.getAdres());
        doctor.setBirthDate(doctorRequest.getBirthDate());
        doctor.setTcKimlik(doctorRequest.getTcKimlik());
        doctor.setKanGrubu(doctorRequest.getKanGrubu());
        doctor.setDiplomaNo(doctorRequest.getDiplomaNo());
        doctor.setUnvan(doctorRequest.getUnvan());
        doctor.setUzmanlik(DoctorSpeciality.getByDisplayName(doctorRequest.getUzmanlik().trim()));
    }
    
} 