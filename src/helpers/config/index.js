export const config = {
    api: {
        baseUrl: "http://healwell.online/api",
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
    }
}

