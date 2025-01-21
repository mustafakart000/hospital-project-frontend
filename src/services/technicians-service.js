import axios from 'axios';
import { config } from "../helpers/config";
import { getAuthHeader } from "./auth-header";
const baseUrl = config.api.baseUrl;

// Teknisyen bilgilerini getir
export const getTechnicianById = async (technicianId) => {
  try {
    const response = await axios.get(`${baseUrl}/technicians/${technicianId}`, { headers: getAuthHeader() });
    console.log("Teknisyen bilgileri:", response.data);
    return response.data;
  } catch (error) {
    console.error('Teknisyen bilgileri alınamadı:', error);
    throw error;
  }
};

// {{baseUrl}}/technicians

export const createTechnician = async (technicianData) => {
  try {
    const response = await axios.post(`${baseUrl}/technicians`, technicianData, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Teknisyen oluşturulamadı:', error);
    throw error;
  }
};



// /technicians/{id}
export const deleteTechnicianById = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/technicians/${id}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Teknisyen silinemedi:', error);
    throw error;
  }
};

// {{baseUrl}}/technicians

export const getAllTechnicians = async () => {
  try {
    const response = await axios.get(`${baseUrl}/technicians`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Teknisyenler alınamadı:', error);
    throw error;
  }
};

// Teknisyen bilgilerini güncelle
export const updateTechnician = async (technicianId, technicianData) => {
  try {
    const response = await axios.put(`${baseUrl}/technicians/${technicianId}`, technicianData, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Teknisyen bilgileri güncellenemedi:', error);
    throw error;
  }
};

// {{baseUrl}}/technicians/lab-requests/{labId}/complete

export const completeLabRequest = async (labId, labResults) => {
  try {
    const response = await axios.put(
      `${baseUrl}/technicians/lab-requests/${labId}/complete`, 
      labResults,  // JSON verisi gövde olarak gönderiliyor
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Lab isteği tamamlanamadı:', error);
    throw error;
  }
};

// {{baseUrl}}/technicians/lab-requests

export const getLabRequests = async () => {
  try {
    const response = await axios.get(`${baseUrl}/technicians/lab-requests`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Lab istekleri alınamadı:', error);
    throw error;
  }
};

// {{baseUrl}}/technicians/imaging-requests/1/complete

export const completeImagingRequest = async (imagingId, imagingResults) => {
  try {
    const response = await axios.put(`${baseUrl}/technicians/imaging-requests/${imagingId}/complete`, imagingResults, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Görüntüleme isteği tamamlanamadı:', error);
    throw error;
  }
};



// {{baseUrl}}/imaging-requests/patient/4

export const getImagingRequestByPatientId = async (patientId) => {
  try {
    const response = await axios.get(`${baseUrl}/imaging-requests/patient/${patientId}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Görüntüleme isteği alınamadı:', error);
    throw error;
  }
};

// /patient/{patientId}/images/{imageId}

export const getImagingRequestImageById = async (patientId, imageId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/imaging-requests/patient/${patientId}/images/${imageId}`,
      { 
        headers: getAuthHeader(),
        responseType: 'arraybuffer'
      }
    );
    return response.data;
  } catch (error) {
    console.error('Görüntüleme isteği alınamadı:', error);
    throw error;
  }
};


// {{baseUrl}}/technicians/imaging-requests

export const getImagingRequests = async () => {
  try {
    const response = await axios.get(`${baseUrl}/technicians/imaging-requests`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Görüntüleme istekleri alınamadı:', error);
    throw error;
  }
};

// {{baseUrl}}/lab-requests/patient/4/pdfs

export const getLabRequestPdf = async (patientId) => {
  try {
    const response = await axios.get(`${baseUrl}/lab-requests/patient/${patientId}/pdfs`, { headers: getAuthHeader() });
    console.log("Lab sonuçları:", response.data);
    return response.data;
  } catch (error) {
    console.error('Lab istekleri alınamadı:', error);
    throw error;
  }
};

// /patient/{patientId}/pdfs/{pdfId}

export const getLabRequestPdfById = async (patientId, pdfId) => {
  try {
    const response = await axios.get(`${baseUrl}/lab-requests/patient/${patientId}/pdfs/${pdfId}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Lab istekleri alınamadı:', error);
    throw error;
  }
};


// {{baseUrl}}/lab-requests/patient/4/all

export const getLabRequestAll = async (patientId) => {
  try {
    const response = await axios.get(`${baseUrl}/lab-requests/patient/${patientId}/all`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Lab istekleri alınamadı:', error);
    throw error;
  }
};

// /lab-requests/patient/{patientId}/all?status=COMPLETED

export const getLabRequestCompleted = async (patientId) => {
  try {
    const response = await axios.get(`${baseUrl}/lab-requests/patient/${patientId}/all?status=COMPLETED`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Lab istekleri alınamadı:', error);
    throw error;
  }
};

// /technicians/lab-requests/all

export const getTechniciansLabRequestAll = async () => {
  try {
    const response = await axios.get(`${baseUrl}/technicians/lab-requests/all`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Lab istekleri alınamadı:', error);
    throw error;
  }
};

// {{baseUrl}}/technicians/lab-requests/all?status=COMPLETED

export const getCompletedLabRequestAll = async () => {
  try {
    const response = await axios.get(`${baseUrl}/technicians/lab-requests/all?status=COMPLETED`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Lab istekleri alınamadı:', error);
    throw error;
  }
};

// {{baseUrl}}/technicians/imaging-requests/all

export const getTechniciansImagingRequestAll = async () => {
  try {
    const response = await axios.get(`${baseUrl}/technicians/imaging-requests/all`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Görüntüleme istekleri alınamadı:', error);
    throw error;
  }
};

// {{baseUrl}}/technicians/imaging-requests/all?status=COMPLETED

export const getCompletedImagingRequestAll = async () => {
  try {
    const response = await axios.get(`${baseUrl}/technicians/imaging-requests/all?status=COMPLETED`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Görüntüleme istekleri alınamadı:', error);
    throw error;
  }
};

// {{baseUrl}}/technicians/imaging-requests/all?status=PENDING

export const getTechniciansPendingImagingRequestAll = async () => {
  try {
    const response = await axios.get(`${baseUrl}/technicians/imaging-requests/all?status=PENDING`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Görüntüleme istekleri alınamadı:', error);
    throw error;
  }
};

// GET /technicians/lab-requests/all?status=PENDING

export const getTechniciansPendingLabRequestAll = async () => {
  try {
    const response = await axios.get(`${baseUrl}/technicians/lab-requests/all?status=PENDING`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Lab istekleri alınamadı:', error);
    throw error;
  }
};

