export const config = {
    api: {
        baseUrl: "http://localhost:8080",
      },
      pageRoles: {
        dashboard: ["ADMIN", "DOCTOR", "SECRETARY"],
        adminManagement: ["ADMIN"],
        doctorManagement: ["DOCTOR"],
        patientManagement: ["PATIENT"],
        secretaryManagement: ["SECRETARY"],
        prescriptionManagement: ["DOCTOR"],
        profile: ["ADMIN", "DOCTOR", "PATIENT", "SECRETARY"],
      },

      
}