package com.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.entity.Reservations;
import com.hospital.model.DoctorSpeciality;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;


public interface ReservationsRepository extends JpaRepository<Reservations, Long> {

    Optional<Reservations> findByReservationDateAndReservationTime(LocalDate reservationDate, LocalTime reservationTime);

    List<Reservations> findAllBySpeciality(DoctorSpeciality speciality);
    
}
