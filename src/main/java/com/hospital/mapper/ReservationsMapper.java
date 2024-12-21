package com.hospital.mapper;

import java.time.LocalDate;
import java.time.LocalTime;

import com.hospital.dto.ReservationRequest;
import com.hospital.dto.Response.ReservationResponse;
import com.hospital.entity.Reservations;
import com.hospital.model.DoctorSpeciality;


public class ReservationsMapper {

    public static Reservations mapToEntity(ReservationRequest reservationRequest){
        return Reservations.builder()
                .reservationDate(LocalDate.parse(reservationRequest.getDate()))
                .reservationTime(LocalTime.parse(reservationRequest.getTime()))
                .status(reservationRequest.getStatus())
                .speciality(DoctorSpeciality.getByDisplayName(reservationRequest.getSpeciality().trim()))
                .doctor(reservationRequest.getDoctor())
                .patient(reservationRequest.getPatient())
                .build();
    }
    public static Reservations mapToEntity(ReservationRequest reservationRequest, Reservations reservation){
        reservation.setReservationDate(reservationRequest.getReservationDate());
        reservation.setReservationTime(reservationRequest.getReservationTime());
        reservation.setStatus(reservationRequest.getStatus());
        reservation.setSpeciality(DoctorSpeciality.getByDisplayName(reservationRequest.getSpeciality().trim()));
        reservation.setDoctor(reservationRequest.getDoctor());
        reservation.setPatient(reservationRequest.getPatient());
        return reservation;
    }
    public static ReservationResponse mapToResponse(Reservations reservation){
        return ReservationResponse.builder()
                .id(reservation.getId())
                .reservationDate(reservation.getReservationDate().toString())
                .reservationTime(reservation.getReservationTime().toString())
                .status(reservation.getStatus())
                .speciality(reservation.getSpeciality().getDisplayName())
                .doctorId(reservation.getDoctor().getId().toString())
                .doctorName(reservation.getDoctor().getAd())
                .doctorSurname(reservation.getDoctor().getSoyad())
                .patientId(reservation.getPatient().getId().toString())
                .patientName(reservation.getPatient().getAd())
                .patientSurname(reservation.getPatient().getSoyad())
                .build();
    }
}