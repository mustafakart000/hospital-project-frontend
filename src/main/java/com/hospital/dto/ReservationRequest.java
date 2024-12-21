package com.hospital.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReservationRequest {
    
    @NotBlank(message = "Doktor seçimi boş olamaz")
    private Doctor doctor;
    private String date;
    private String time;
    private String status;
    private String speciality;
    private Patient patient;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    

    
    
}
