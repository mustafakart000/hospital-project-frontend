package com.hospital.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dto.ReservationRequest;
import com.hospital.dto.Response.DoctorResponseList;
import com.hospital.dto.Response.ReservationResponse;
import com.hospital.dto.Response.SpecialityResponse;
import com.hospital.entity.Reservations;
import com.hospital.mapper.ReservationsMapper;
import com.hospital.service.ReservationsService;
   


@RestController
@RequestMapping("/reservations")
public class ReservationsController {
    
    @Autowired
    private ReservationsService reservationsService;

    

    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping("/create")
    public ResponseEntity<ReservationResponse> createReservation(@RequestBody ReservationRequest reservationRequest){
        
        Reservations savedReservation = reservationsService.createReservation(reservationRequest);
        ReservationResponse response = ReservationsMapper.mapToResponse(savedReservation); // Dönüştürme metodu ekleyin
        
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT')")
    @GetMapping("/get/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable Long id){
        ReservationResponse response = reservationsService.getReservationById(id);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT')")
    @GetMapping("/getall")
    public ResponseEntity<List<ReservationResponse>> getAllReservations(){
        List<ReservationResponse> response = reservationsService.getAllReservations();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateReservation(@PathVariable Long id, @RequestBody ReservationRequest reservationRequest){
        reservationsService.updateReservation(id, reservationRequest);
        return ResponseEntity.accepted().body("başarılı bir şekilde güncellendi");
    }
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long id){
        reservationsService.deleteReservation(id);
        return ResponseEntity.accepted().body("başarılı bir şekilde silindi");
    }
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT')")
    //speciality için doktorları getir
    @GetMapping("/getall/doctors/{id}")
    public ResponseEntity<List<DoctorResponseList>> getAllDoctorNameBySpeciality(@PathVariable Long id){
        List<DoctorResponseList> response = reservationsService.getAllDoctorNameBySpeciality(id);
        return ResponseEntity.ok(response);
    }
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT')") //getAllSpecialityByDoctorId
    @GetMapping("/getall/speciality")
    public ResponseEntity<List<SpecialityResponse>> getAllSpeciality(){
        List<SpecialityResponse> response = reservationsService.getAllSpeciality();
        return ResponseEntity.ok(response);
    }

}
//bu sayfadaki tüm apileri yorum olarak yazabilirmisin ?
// localhost:8080/reservations/delete/1
// localhost:8080/reservations/getall
// localhost:8080/reservations/get/1
// localhost:8080/reservations/update/1
// localhost:8080/reservations/create
// localhost:8080/reservations/getall/speciality
// localhost:8080/reservations/getall/doctors/1





