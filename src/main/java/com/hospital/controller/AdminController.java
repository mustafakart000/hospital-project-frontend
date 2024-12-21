package com.hospital.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.hospital.dto.DoctorRequest;
import com.hospital.dto.Response.DoctorResponseList;
import com.hospital.dto.Response.GetFullDoctorResponse;

import com.hospital.service.DoctorService;

@RestController
@RequestMapping("/doctor")
public class AdminController {
    @Autowired
    private DoctorService doctorService;

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<DoctorResponseList> getAllDoctors() {
        return doctorService.getAllDoctors();
    }
    //localhost:8080/doctor/delete/1
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
    }
    //localhost:8080/doctor/update/1
    // json body hazırlayınız

    //localhost:8080/doctor/update/1
    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<HttpStatus> updateDoctor(@PathVariable Long id, @RequestBody DoctorRequest doctorRequest) {
        doctorService.updateDoctor(id, doctorRequest);
        return ResponseEntity.ok(HttpStatus.OK);
    }
    //localhost:8080/doctor/get/1
    @GetMapping("/get/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public GetFullDoctorResponse getDoctor(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    // 

    
}
