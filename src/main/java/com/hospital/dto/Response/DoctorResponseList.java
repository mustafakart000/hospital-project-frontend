package com.hospital.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class DoctorResponseList {
    private Long id;
    private String ad;
    private String soyad;
    private String speciality;
    private String email;
    private String phone;
    private String address;
    


}
