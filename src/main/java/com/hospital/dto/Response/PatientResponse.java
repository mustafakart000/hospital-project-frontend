package com.hospital.dto.Response;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.hospital.entity.Doctor;
import com.hospital.entity.Reservations;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PatientResponse {
    private Long id;
    private String tcKimlik;
    private String ad;
    private String soyad;
    private String email;
    private String telefon;
    private String username;
    private String role;
    private String adres;
    private LocalDate birthDate;
    private String kanGrubu;
    private List<Doctor> doctors;
    private List<Reservations> reservations;
    private String medicalHistory;
}
// json data oluştur    

