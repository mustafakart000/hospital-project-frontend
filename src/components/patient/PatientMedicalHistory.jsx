import React, { useState, useEffect } from 'react';
import { Card, Timeline, Tag, Button, Modal, Select, Empty } from 'antd';
import { Activity, AlertCircle, File, Heart, Thermometer, Pill, Stethoscope } from 'lucide-react';
import axios from 'axios';
import { getAuthHeader } from '../../services/auth-header';
import { config } from '../../helpers/config';
import moment from 'moment';
import PropTypes from 'prop-types';

const PatientMedicalHistory = ({ patientId }) => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const BASE_URL = config.api.baseUrl;

  const fetchMedicalHistory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/medical-history/${patientId}`, {
        headers: getAuthHeader(),
      });
      setMedicalHistory(response.data);
    } catch (error) {
      console.error('Tıbbi geçmiş yüklenirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    fetchMedicalHistory();
  }, [patientId]);

  const getCategoryIcon = (category) => {
    const icons = {
      'diagnosis': Stethoscope,
      'treatment': Pill,
      'test': Thermometer,
      'surgery': AlertCircle,
      'checkup': Heart,
    };
    return icons[category] || Activity;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'diagnosis': 'blue',
      'treatment': 'green',
      'test': 'purple',
      'surgery': 'red',
      'checkup': 'cyan',
    };
    return colors[category] || 'gray';
  };

  // Özet bilgileri
  const getSummaryStats = () => {
    return {
      totalRecords: medicalHistory.length,
      diagnoses: medicalHistory.filter(record => record.category === 'diagnosis').length,
      treatments: medicalHistory.filter(record => record.category === 'treatment').length,
      surgeries: medicalHistory.filter(record => record.category === 'surgery').length,
    };
  };

  const stats = getSummaryStats();

  // Filtrelenmiş kayıtları al
  const getFilteredRecords = () => {
    if (activeCategory === 'all') {
      return medicalHistory;
    }
    return medicalHistory.filter(record => record.category === activeCategory);
  };

  const renderTimelineItem = (record) => {
    const Icon = getCategoryIcon(record.category);
    const color = getCategoryColor(record.category);

    return (
      <Timeline.Item
        key={record.id}
        dot={<Icon className={`w-5 h-5 text-${color}-500`} />}
      >
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <Tag color={color}>{record.category.toUpperCase()}</Tag>
                <span className="text-sm text-gray-500">
                  {moment(record.date).format('DD.MM.YYYY')}
                </span>
              </div>
              <h4 className="font-medium mt-2">{record.title}</h4>
              <p className="text-gray-600 mt-1">{record.description}</p>
            </div>
            <Button
              type="link"
              onClick={() => {
                setSelectedRecord(record);
                setViewModalVisible(true);
              }}
            >
              Detay
            </Button>
          </div>
        </div>
      </Timeline.Item>
    );
  };

  return (
    <div className="space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalRecords}</div>
            <div className="text-sm text-gray-500">Toplam Kayıt</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <Stethoscope className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.diagnoses}</div>
            <div className="text-sm text-gray-500">Tanı</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <Pill className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.treatments}</div>
            <div className="text-sm text-gray-500">Tedavi</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.surgeries}</div>
            <div className="text-sm text-gray-500">Ameliyat</div>
          </div>
        </Card>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <Select
          className="w-full"
          value={activeCategory}
          onChange={setActiveCategory}
          options={[
            { value: 'all', label: 'Tüm Kayıtlar' },
            { value: 'diagnosis', label: 'Tanılar' },
            { value: 'treatment', label: 'Tedaviler' },
            { value: 'test', label: 'Testler' },
            { value: 'surgery', label: 'Ameliyatlar' },
            { value: 'checkup', label: 'Kontroller' },
          ]}
        />
      </div>

      {/* Zaman Çizelgesi */}
      <Card className="bg-white shadow-sm">
        {getFilteredRecords().length > 0 ? (
          <Timeline>
            {getFilteredRecords()
              .sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())
              .map(renderTimelineItem)}
          </Timeline>
        ) : (
          <Empty
            description="Kayıt bulunamadı"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      {/* Detay Modalı */}
      <Modal
        title="Tıbbi Kayıt Detayı"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Kapat
          </Button>
        ]}
        width={700}
      >
        {selectedRecord && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tarih</p>
                  <p className="font-medium">
                    {moment(selectedRecord.date).format('DD.MM.YYYY')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kategori</p>
                  <Tag color={getCategoryColor(selectedRecord.category)}>
                    {selectedRecord.category.toUpperCase()}
                  </Tag>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Başlık</p>
                  <p className="font-medium">{selectedRecord.title}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Açıklama</p>
                  <p className="font-medium">{selectedRecord.description}</p>
                </div>
              </div>
            </div>

            {/* Doktor Notları */}
            {selectedRecord.doctorNotes && (
              <div>
                <h3 className="text-lg font-medium mb-2">Doktor Notları</h3>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-gray-700">{selectedRecord.doctorNotes}</p>
                </div>
              </div>
            )}

            {/* Ek Bilgiler */}
            {selectedRecord.additionalInfo && (
              <div>
                <h3 className="text-lg font-medium mb-2">Ek Bilgiler</h3>
                <div className="space-y-2">
                  {Object.entries(selectedRecord.additionalInfo).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-500">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ekler */}
            {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Ekler</h3>
                <div className="space-y-2">
                  {selectedRecord.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                    >
                      <File className="w-4 h-4 text-gray-400" />
                      <span>{attachment.name}</span>
                      <Button type="link" size="small">
                        Görüntüle
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

PatientMedicalHistory.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default PatientMedicalHistory;