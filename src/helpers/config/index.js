export const config = {
    api: {
        baseUrl: "https://hospitalproject53.onrender.com",
      },
      pageRoles: {
        dashboard: ["ADMIN", "DOCTOR", "SECRETARY" ],
        adminManagement: ["ADMIN"],
        doctorManagement: ["DOCTOR"],
        patientManagement: ["PATIENT"],
        secretaryManagement: ["SECRETARY"],
        prescriptionManagement: ["DOCTOR"],
        profile: ["ADMIN", "DOCTOR", "PATIENT", "SECRETARY"],
      },

      
}