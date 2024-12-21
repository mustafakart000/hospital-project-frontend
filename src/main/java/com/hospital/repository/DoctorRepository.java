package com.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hospital.entity.Doctor;
import com.hospital.model.DoctorSpeciality;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByTcKimlik(String tcKimlik);
    Boolean existsByTcKimlik(String tcKimlik);
    List<Doctor> findAllByUzmanlik(DoctorSpeciality speciality);
}
