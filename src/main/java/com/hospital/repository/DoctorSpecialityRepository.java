package com.hospital.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import com.hospital.entity.DoctorSpecialityEntity;
import com.hospital.model.DoctorSpeciality;

public interface DoctorSpecialityRepository extends JpaRepository<DoctorSpecialityEntity, Long> {
    boolean existsByUzmanlik(DoctorSpeciality uzmanlik);
    Optional<DoctorSpecialityEntity> findByUzmanlik(DoctorSpeciality uzmanlik);
    @NonNull
    List<DoctorSpecialityEntity> findAll();
}