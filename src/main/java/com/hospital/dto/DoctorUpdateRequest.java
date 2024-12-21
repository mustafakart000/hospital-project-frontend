package com.hospital.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class DoctorUpdateRequest {
    private String username;
    private String ad;
    private String soyad;
    private String email;
    private String telefon;
    private String adres;
    private LocalDate birthDate;
    private String tcKimlik;
    private String kanGrubu;
    private String diplomaNo;
    private String unvan;
    private String uzmanlik;

}
