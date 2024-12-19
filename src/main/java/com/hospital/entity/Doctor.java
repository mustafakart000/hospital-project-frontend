package com.hospital.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.hospital.model.DoctorSpeciality;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Doctor extends User {
    private String diplomaNo;
    private String unvan;

    @Enumerated(EnumType.STRING)
    private DoctorSpeciality uzmanlik;

    @ManyToMany(mappedBy = "doctors")
    private List<Patient> patients;
}
