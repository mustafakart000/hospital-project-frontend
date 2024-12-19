package com.hospital.dto.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReservationResponse {
    private Long id;
    private String doctorId;
    private String doctorName;
    private String doctorSurname;
    private String patientId;
    private String patientName;
    private String patientSurname;
    private String reservationDate;
    private String reservationTime;
    private String status;
    private String speciality;
    
}
