package com.hospital.dto;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DoctorRegisterRequest {

    @NotBlank(message = "Kullanıcı adı boş olamaz")
    private String username;

    @NotBlank(message = "Şifre boş olamaz")
    @Size(min = 6, message = "Şifre en az 6 karakter olmalıdır")
    private String password;

    @NotBlank(message = "Ad boş olamaz")
    private String ad;

    @NotBlank(message = "Soyad boş olamaz")
    private String soyad;

    @NotBlank(message = "Uzmanlık boş olamaz")
    private String uzmanlik;

    @NotBlank(message = "Diploma numarası boş olamaz")
    private String diplomaNo;

    @NotBlank(message = "Unvan boş olamaz")
    private String unvan;

    @Pattern(regexp = "^[0-9]{10}$", message = "Telefon numarası 10 haneli olmalıdır")
    private String telefon;

    @Email(message = "Geçerli bir e-posta adresi giriniz")
    @NotBlank(message = "E-posta boş olamaz")
    private String email;

    @NotBlank(message = "E-posta boş olamaz")
    private String adres;

    @Pattern(regexp = "^[0-9]{11}$", message = "T.C. Kimlik numarası 11 haneli olmalıdır")
    private String tcKimlik;

    @NotNull(message = "Doğum tarihi boş olamaz")
    @Column(name = "birth_date")
    private LocalDate birthDate;

    @NotBlank(message = "Kan grubu boş olamaz")
    private String kanGrubu;
}
