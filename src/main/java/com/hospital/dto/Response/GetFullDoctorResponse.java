package com.hospital.dto.Response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetFullDoctorResponse {

    private Long id;
    private String username;
    private String password;
    private String ad;
    private String soyad;
    private String speciality;
    private String email;
    private String phone;
    private String address;
    private LocalDate birthDate;
    private String tcKimlik;
    private String kanGrubu;
    private String diplomaNo;
    private String unvan;
    

}
