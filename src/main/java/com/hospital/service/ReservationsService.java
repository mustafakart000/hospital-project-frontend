package com.hospital.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.hospital.dto.ReservationRequest;
import com.hospital.dto.Response.DoctorResponseList;
import com.hospital.dto.Response.ReservationResponse;
import com.hospital.dto.Response.SpecialityResponse;
import com.hospital.entity.Doctor;
import com.hospital.entity.DoctorSpecialityEntity;
import com.hospital.entity.Reservations;
import com.hospital.mapper.ReservationsMapper;
import com.hospital.model.DoctorSpeciality;
import com.hospital.repository.ReservationsRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.DoctorSpecialityRepository;
@Service
public class ReservationsService {

    @Autowired
    private ReservationsRepository reservationsRepository;

    @Autowired
    private DoctorSpecialityRepository doctorSpecialityRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    
    public Reservations createReservation(ReservationRequest reservationRequest){
        //o tarih ve saatte randevu var mı kontrolü
        if(reservationsRepository.findByReservationDateAndReservationTime(reservationRequest.getReservationDate(), reservationRequest.getReservationTime()).isPresent()){
            throw new RuntimeException("Bu tarih ve saatte randevu zaten var");
        }
        Reservations reservation = ReservationsMapper.mapToEntity(reservationRequest);
        return reservationsRepository.save(reservation);
    }

    public ReservationResponse getReservationById(Long id){

        Optional<Reservations> reservation = reservationsRepository.findById(id);
        if(reservation.isPresent()){
            return ReservationsMapper.mapToResponse(reservation.get());
        }else{
            throw new RuntimeException("Randevu bulunamadı");
        }
      
    }

   

    public ReservationResponse updateReservation(Long id, ReservationRequest reservationRequest){

        Reservations reservation = reservationsRepository.findById(id).orElseThrow(() -> new RuntimeException("Randevu bulunamadı"));
        Reservations updatedReservation = ReservationsMapper.mapToEntity(reservationRequest, reservation);
        return ReservationsMapper.mapToResponse(reservationsRepository.save(updatedReservation));
    }

    
    public void deleteReservation(Long id){
        if(reservationsRepository.existsById(id)){
            reservationsRepository.deleteById(id);
        }else{
            throw new RuntimeException("Randevu bulunamadı");
        }
    }

    
    public List<ReservationResponse> getAllReservations(){
        return reservationsRepository.findAll().stream().map(ReservationsMapper::mapToResponse).collect(Collectors.toList());
    }

    //getAllSpeciality
    public List<SpecialityResponse> getAllSpeciality(){
       List<DoctorSpecialityEntity> entitySpeciality  =   doctorSpecialityRepository.findAll();
       List<SpecialityResponse> specialities = entitySpeciality.stream()
           .map(entity -> SpecialityResponse.builder()
               .id(entity.getId())
               .displayName(entity.getDisplayName())
               .build())
           .collect(Collectors.toList());
       return specialities;
    }

    public List<DoctorResponseList> getAllDoctorNameBySpeciality(Long id){
        String speciality = doctorSpecialityRepository.findById(id).get().getUzmanlik().toString();
        
        List<Doctor> doctors = doctorRepository.findAllByUzmanlik(DoctorSpeciality.valueOf(speciality));
        return doctors.stream().map(doctor ->
         DoctorResponseList.builder()
         .id(doctor.getId())
         .ad(doctor.getAd())
         .soyad(doctor.getSoyad())
         .speciality(doctor.getUzmanlik().toString())
         .build()).collect(Collectors.toList());
    }


}

