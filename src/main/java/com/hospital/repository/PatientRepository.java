package com.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;




import com.hospital.entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {



}
