export const config = {
    api: {
        // baseUrl: "http://37.148.209.189/api",
        baseUrl: "http://localhost:8080/api",
      },
      pageRoles: {
        dashboard: ["ADMIN", "DOCTOR", "SECRETARY"],
        techniciansManagement: ["TECHNICIAN"],
        adminManagement: ["ADMIN"],
        doctorManagement: ["DOCTOR"],
        patientManagement: ["PATIENT"],
        secretaryManagement: ["SECRETARY"],
        prescriptionManagement: ["DOCTOR"],
        profile: ["ADMIN", "DOCTOR", "PATIENT", "SECRETARY", "TECHNICIAN"],
      },

     
}

