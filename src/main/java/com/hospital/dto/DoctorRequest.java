package com.hospital.dto;

import lombok.Data;
import java.time.LocalDate;



@Data
public class DoctorRequest {
    // User entity'sinden alanlar
    private String username;
    private String password;
    private String ad;
    private String soyad;
    private String email;
    private String telefon;
    private String adres;
    private LocalDate birthDate;
    private String tcKimlik;
    private String kanGrubu;

    // Doctor entity'sinden alanlar
    private String diplomaNo;
    private String unvan;
    private String uzmanlik; // Eğer enum ise, string olarak alabilirsiniz

   
} 
