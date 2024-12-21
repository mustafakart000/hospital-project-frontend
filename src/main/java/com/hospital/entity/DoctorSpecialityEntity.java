package com.hospital.entity;

import com.hospital.model.DoctorSpeciality;

import jakarta.persistence.*;


@Entity
public class DoctorSpecialityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private DoctorSpeciality uzmanlik;

    private String displayName;


   

    // Getters ve Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DoctorSpeciality getUzmanlik() {
        return uzmanlik;
    }

    public void setUzmanlik(DoctorSpeciality uzmanlik) {
        this.uzmanlik = uzmanlik;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    
}

