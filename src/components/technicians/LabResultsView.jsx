import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { completeImagingRequest, getImagingRequests } from '../../services/technicians-service';
import { Card, CardContent, Typography } from '@mui/material';

const LabResultsView = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageData, setImageData] = useState('');
  const [findings, setFindings] = useState('');
  const [notes, setNotes] = useState('');
  const [imagingRequests, setImagingRequests] = useState([]);
  const technicianId = useSelector(state => state.auth.user.id.toString());

  const fetchImagingRequests = async () => {
    try {
      const response = await getImagingRequests();
      // Tarihe göre sıralama, en eski en üstte
      const sortedRequests = response.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      );
      setImagingRequests(sortedRequests);
    } catch (error) {
      console.error('Görüntüleme istekleri yüklenirken hata oluştu:', error);
      toast.error('Görüntüleme istekleri yüklenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchImagingRequests();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Image dosyasının boyutunu kontrol et (örn: 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Görüntü dosyası 5MB\'dan küçük olmalıdır');
        return;
      }
      
      // Görüntü dosyası türünü kontrol et
      const allowedTypes = ['image/jpeg', 'image/png', 'image/dicom'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Lütfen sadece JPEG, PNG veya DICOM dosyası yükleyin');
        return;
      }

      // Dosyayı base64'e çevir
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setImageData(base64String);
        // Önizleme için URL oluştur
        setImageUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRequest) {
      toast.error('Lütfen bir görüntüleme isteği seçin');
      return;
    }

    if (!imageData) {
      toast.error('Lütfen bir görüntü dosyası yükleyin');
      return;
    }

    try {
      
      const requestData = {
        imageData,
        findings,
        notes,
        technicianId,
        status: 'COMPLETED'
      };


      // Alternatif endpoint'i deneyelim
      await completeImagingRequest(selectedRequest.id, requestData);
      toast.success('Görüntüleme sonuçları başarıyla kaydedildi');
      fetchImagingRequests();
      resetForm();
    } catch (error) {
      toast.error('Görüntüleme sonuçları kaydedilirken bir hata oluştu');
      console.error('Görüntüleme sonuçları kaydedilemedi:', error);
    }
  };

  const resetForm = () => {
    setSelectedRequest(null);
    setImageUrl('');
    setImageData('');
    setFindings('');
    setNotes('');
  };

  const imagingTypeMapping = {
    'XRAY': 'Röntgen',
    'MRI': 'MR',
    'CT': 'Tomografi',
    'USG': 'Ultrason',
    'EKG': 'EKG',
    'ULTRASOUND': 'Ultrason'
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Görüntüleme Sonuçları</h2>

      {/* Imaging Requests List */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Görüntüleme İstekleri</h3>
        <div className="space-y-4">
          {imagingRequests.map((request) => (
            <div key={request.id} className="mb-4">
              <Card 
                onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
                sx={{ 
                  cursor: 'pointer',
                  bgcolor: selectedRequest?.id === request.id ? '#3b82f6' : '#f3f4f6',
                  '&:hover': {
                    bgcolor: selectedRequest?.id === request.id ? '#3b82f6' : '#e5e7eb'
                  },
                  transition: 'background-color 0.2s'
                }}
              >
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <Typography variant="h6" sx={{ color: selectedRequest?.id === request.id ? 'white' : 'inherit' }}>
                        Hasta: {request.patient.ad} {request.patient.soyad}
                      </Typography>
                      <Typography variant="body1" sx={{ color: selectedRequest?.id === request.id ? 'white' : 'inherit' }}>
                        Görüntüleme: {request.imagingType ? imagingTypeMapping[request.imagingType] : 'Belirtilmemiş'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: selectedRequest?.id === request.id ? 'white' : 'inherit' }}>
                        Vücut Bölgesi: {request.bodyPart || 'Belirtilmemiş'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: selectedRequest?.id === request.id ? 'white' : 'inherit' }}>
                        Oluşturulma Tarihi: {new Date(request.createdAt).toLocaleString('tr-TR')}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" sx={{ color: selectedRequest?.id === request.id ? 'white' : 'text.secondary', textAlign: 'right' }}>
                        Öncelik: {request.priority || 'NORMAL'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: selectedRequest?.id === request.id ? 'white' : 'text.secondary', textAlign: 'right' }}>
                        Durum: {request.status || 'PENDING'}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedRequest?.id === request.id && (
                <div className="p-4 bg-white border-t">
                  <div className="grid gap-6">
                    {/* Upload Panel */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Görüntü Yükleme</h3>
                      
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <input
                          type="file"
                          accept="image/*,.dcm"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label 
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <Upload className="w-12 h-12 text-gray-400" />
                          <span className="text-gray-500">Görüntü yüklemek için tıklayın</span>
                          <span className="text-xs text-gray-400">(Maksimum 5MB)</span>
                        </label>
                      </div>

                      {/* Image Preview */}
                      {imageUrl && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <img
                            src={imageUrl}
                            alt="Yüklenen görüntü"
                            className="max-h-64 mx-auto"
                          />
                        </div>
                      )}

                      {/* Findings and Notes Section */}
                      <div className="space-y-4 mt-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bulgular
                          </label>
                          <textarea
                            value={findings}
                            onChange={(e) => setFindings(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows={4}
                            placeholder="Görüntüleme bulgularını buraya giriniz..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notlar
                          </label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows={4}
                            placeholder="Varsa notları buraya giriniz..."
                          />
                        </div>

                        <button
                          onClick={handleSubmit}
                          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                        >
                          Sonuçları Kaydet
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabResultsView;