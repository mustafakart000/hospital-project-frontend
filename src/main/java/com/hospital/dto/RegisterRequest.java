package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    @NotBlank(message = "Kullanıcı adı zorunludur")
    private String username;

    @NotBlank(message = "Şifre zorunludur")
    @Size(min = 6, message = "Şifre en az 6 karakter olmalıdır")
    private String password;   // Kullanıcı şifresi

    @NotBlank(message = "Ad zorunludur")
    private String ad;         // Kullanıcının adı

    @NotBlank(message = "Soyad zorunludur")
    private String soyad;      // Kullanıcının soyadı

    @Email(message = "Geçerli bir email giriniz")
    private String email;      // Kullanıcının e-posta adresi

    @NotBlank(message = "Telefon zorunludur")
    private String telefon;    // Kullanıcının telefon numarası

    @NotBlank(message = "Adres zorunludur")
    private String adres;      // Kullanıcının adres bilgisi

    @NotNull(message = "Doğum tarihi zorunludur")
    private LocalDate birthDate; // Kullanıcının doğum tarihi

    @NotBlank(message = "Kan grubu zorunludur")
    private String kanGrubu;   // Kullanıcının kan grubu

    @NotBlank(message = "TC Kimlik numarası zorunludur")
    private String tcKimlik;    // Kullanıcının T.C. Kimlik numarası
}