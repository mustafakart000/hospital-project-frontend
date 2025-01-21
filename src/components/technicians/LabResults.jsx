import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { completeLabRequest, getLabRequests } from '../../services/technicians-service';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const LabResults = () => {
  const [selectedTest, setSelectedTest] = useState('');
  const [photos, setPhotos] = useState({});
  const [results, setResults] = useState('');
  const [notes, setNotes] = useState('');
  const [labRequests, setLabRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const technicianId = useSelector(state => state.auth.user.id.toString());

  const fetchLabRequests = async () => {
    try {
      const labRequestsData = await getLabRequests();


      if (!labRequestsData || labRequestsData.length === 0) {
        console.log("Lab isteği bulunamadı");
        setLabRequests([]);
        return;
      }

      // Lab isteklerini hasta bilgileriyle birleştir
      const completedRequests = labRequestsData
        .map(request => ({
          ...request,
          patientName: `${request.patient.ad} ${request.patient.soyad}`
        }))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Tarihe göre sıralama

  
      setLabRequests(completedRequests);

    } catch (error) {
      console.error('Lab istekleri yüklenirken hata oluştu:', error);
      setLabRequests([]);
      toast.error('Lab istekleri yüklenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchLabRequests();
  }, []);

  const testTypes = [
    'TAM_KAN_SAYIMI',
    'HORMON_TESTLERI',
    'BIYOKIMYA',
    'IDRAR_TAHLILI',
    'KOAGULASYON',
    'SEDIMANTASYON',
    'CRP'
  ];

  const testPanelMapping = {
    'TAM_KAN_SAYIMI': 'Tam Kan Sayımı',
    'HORMON_TESTLERI': 'Hormon Testleri',
    'BIYOKIMYA': 'Biyokimya',
    'IDRAR_TAHLILI': 'İdrar Tahlili',
    'KOAGULASYON': 'Koagülasyon',
    'SEDIMANTASYON': 'Sedimantasyon',
    'CRP': 'CRP'
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedTest) {
      // PDF dosyasının boyutunu kontrol et (örn: 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('PDF dosyası 5MB\'dan küçük olmalıdır');
        return;
      }
      
      // PDF dosyasının türünü kontrol et
      if (file.type !== 'application/pdf') {
        toast.error('Lütfen sadece PDF dosyası yükleyin');
        return;
      }

      // PDF dosyasını base64'e çevir
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1]; // base64 data kısmını al
        setPhotos(prev => ({
          ...prev,
          [selectedTest]: {
            url: URL.createObjectURL(file),
            name: file.name,
            data: base64Data
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRequest) {
      toast.error('Lütfen bir lab isteği seçin');
      return;
    }

    // PDF dosyalarını base64 formatına dönüştür
    const testPdfs = Object.entries(photos).map(([testType, photo]) => ({
      testType: testType,
      pdfUrl: photo.url,
      pdfData: photo.data // Bu veriyi dosya yüklenirken base64 olarak saklamalıyız
    }));

    const labData = {
      results: results,
      notes: notes,
      technicianId: technicianId,
      testPdfs: testPdfs,
      status: 'COMPLETED',
      completedAt: new Date().toISOString()
    };

    try {
      await completeLabRequest(selectedRequest.id, labData);
      toast.success('Lab sonuçları başarıyla kaydedildi');

      fetchLabRequests();
      setSelectedRequest(null);
      setResults('');
      setNotes('');
      setPhotos({});
      setSelectedTest('');
    } catch (error) {
      toast.error('Lab sonuçları kaydedilirken bir hata oluştu');
      console.error('Lab sonuçları kaydedilemedi:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Lab Sonuçları</h2>

      {/* Lab Requests List */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Lab İstekleri</h3>
        <div className="space-y-4">
          {labRequests.map((request) => (
            <div key={request.id} className="border rounded-lg overflow-hidden">
              <div
                onClick={() => setSelectedRequest(request)}
                className={`p-4 cursor-pointer transition-colors duration-200 ${
                  selectedRequest?.id === request.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      Hasta: {request.patientName}
                    </p>
                    <p className="text-sm">Test: {testPanelMapping[request.testPanel] || 'Belirtilmemiş'}</p>
                    <p className="text-sm">Tarih: {new Date(request.createdAt).toLocaleString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Öncelik: {request.priority}</p>
                    <p className="text-sm">Durum: {request.status}</p>
                  </div>
                </div>
              </div>

              {/* Test Panel Expansion */}
              {selectedRequest?.id === request.id && (
                <div className="p-4 bg-white border-t">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Test Selection Panel */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Test Paneli Seçiniz</h3>
                      <div className="grid gap-2">
                        {testTypes.map((test) => (
                          <div 
                            key={test}
                            onClick={() => setSelectedTest(test)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                              selectedTest === test 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {testPanelMapping[test]}
                          </div>
                        ))}
                      </div>
                    </div>

                                          {/* Upload Panel */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">PDF Yükleme</h3>
                      
                      {selectedTest ? (
                        <div className="space-y-4">
                          <p className="text-gray-600">Seçili Test: {testPanelMapping[selectedTest]}</p>
                          
                          {/* Upload Area */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={handlePdfUpload}
                              className="hidden"
                              id="pdf-upload"
                            />
                            <label 
                              htmlFor="pdf-upload"
                              className="cursor-pointer flex flex-col items-center space-y-2"
                            >
                              <Upload className="w-12 h-12 text-gray-400" />
                              <span className="text-gray-500">PDF yüklemek için tıklayın</span>
                              <span className="text-xs text-gray-400">(Maksimum 5MB)</span>
                            </label>
                          </div>

                          {/* File Info Area */}
                          {photos[selectedTest] && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Yüklenen PDF:</p>
                                  <p className="text-sm text-gray-600">{photos[selectedTest].name}</p>
                                </div>
                                <a
                                  href={photos[selectedTest].url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                                >
                                  Görüntüle
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500 p-4 bg-gray-50 rounded-lg">
                          Lütfen yükleme yapmak için sol taraftan bir test seçin
                        </div>
                      )}
                    </div>

                    {/* Results and Notes Section */}
                    <div className="col-span-2 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sonuçlar
                        </label>
                        <textarea
                          value={results}
                          onChange={(e) => setResults(e.target.value)}
                          className="w-full p-2 border rounded-md"
                          rows={4}
                          placeholder="Test sonuçlarını buraya giriniz..."
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
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabResults;