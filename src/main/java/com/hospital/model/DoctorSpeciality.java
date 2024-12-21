package com.hospital.model;


public enum DoctorSpeciality {

    CARDIOLOGIST("Kardiyolog (Kalp ve Damar Hastalıkları Uzmanı)"),
    NEUROLOGIST("Nörolog (Sinir Sistemi Hastalıkları Uzmanı)"),
    ORTHOPEDIST("Ortopedi Uzmanı (Kemik ve Eklem Hastalıkları)"),
    PEDIATRICIAN("Pediatrist (Çocuk Sağlığı ve Hastalıkları Uzmanı)"),
    DERMATOLOGIST("Dermatolog (Cilt Hastalıkları Uzmanı)"),
    PSYCHIATRIST("Psikiyatrist (Ruh Sağlığı ve Hastalıkları Uzmanı)"),
    GYNECOLOGIST("Jinekolog (Kadın Hastalıkları ve Doğum Uzmanı)"),
    ONCOLOGIST("Onkolog (Kanser Hastalıkları Uzmanı)"),
    UROLOGIST("Ürolog (Üreme ve İdrar Yolları Hastalıkları Uzmanı)"),
    GASTROENTEROLOGIST("Gastroenterolog (Sindirim Sistemi Hastalıkları Uzmanı)"),
    ENT_SPECIALIST("KBB Uzmanı (Kulak Burun Boğaz Hastalıkları)"),
    RADIOLOGIST("Radyolog (Tıbbi Görüntüleme Uzmanı)"),
    PATHOLOGIST("Patolog (Hastalıkların Mikroskobik İncelemesi)"),
    ANESTHESIOLOGIST("Anesteziyolog (Anestezi ve Reanimasyon Uzmanı)"),
    PULMONOLOGIST("Pulmonolog (Akciğer ve Solunum Hastalıkları Uzmanı)"),
    OPHTHALMOLOGIST("Göz Doktoru (Göz Sağlığı ve Hastalıkları Uzmanı)"),
    RHEUMATOLOGIST("Romatolog (Romatizmal Hastalıklar Uzmanı)"),
    ENDOCRINOLOGIST("Endokrinolog (Hormon Hastalıkları Uzmanı)"),
    NEPHROLOGIST("Nefrolog (Böbrek Hastalıkları Uzmanı)"),
    HEMATOLOGIST("Hematolog (Kan Hastalıkları Uzmanı)"),
    SURGEON("Cerrah (Genel Cerrahi Uzmanı)"),
    IMMUNOLOGIST("İmmünolog (Bağışıklık Sistemi Hastalıkları Uzmanı)"),
    ALLERGIST("Alerji Uzmanı"),
    GENERAL_PHYSICIAN("Pratisyen Hekim (Genel Sağlık Hizmetleri)"),
    PLASTIC_SURGEON("Plastik Cerrah (Estetik ve Rekonstrüktif Cerrahi)"),
    VASCULAR_SURGEON("Damar Cerrahı"),
    TRAUMA_SURGEON("Travma Cerrahı"),
    FAMILY_MEDICINE("Aile Hekimi"),
    SPORTS_MEDICINE("Spor Hekimi"),
    OCCUPATIONAL_MEDICINE("İşyeri Hekimi (Meslek Hastalıkları Uzmanı)");

    private final String displayName;

    DoctorSpeciality(String displayName) {
        this.displayName = displayName;
    }

   
    public String getDisplayName() {
        return displayName;
    }

    public static DoctorSpeciality getByDisplayName(String displayName) {
        for (DoctorSpeciality speciality : values()) {
            if (speciality.getDisplayName().equalsIgnoreCase(displayName)) {
                return speciality;
            }
        }
        throw new IllegalArgumentException("Geçersiz uzmanlık alanı: " + displayName);
    }
}

