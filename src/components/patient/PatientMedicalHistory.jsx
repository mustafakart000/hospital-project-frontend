import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Tabs, message, List, Select, Space } from 'antd';
import { FileTextOutlined, ExperimentOutlined, PictureOutlined, CalendarOutlined, UserOutlined, FileSearchOutlined, FilterOutlined } from '@ant-design/icons';
import { getLabRequestPdf, getImagingRequestByPatientId, getLabRequestPdfById, getImagingRequestImageById } from '../../services/technicians-service';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import PropTypes from 'prop-types';

const labResultPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  testType: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  completedAt: PropTypes.string
});

const imagingResultPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  imagingType: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  bodyPart: PropTypes.string.isRequired,
  doctorName: PropTypes.string.isRequired,
  findings: PropTypes.string,
  createdAt: PropTypes.string.isRequired
});

const PatientMedicalHistory = () => {
  const [labResults, setLabResults] = useState([]);
  const [imagingResults, setImagingResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeKey, setActiveKey] = useState('1');
  const patientId = useSelector(state => state.auth.user.id.toString());
  const isMobile = useMediaQuery({ maxWidth: 700 });

  useEffect(() => {
    fetchResults();
  }, [patientId]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const [labData, imagingData] = await Promise.all([
        getLabRequestPdf(patientId),
        getImagingRequestByPatientId(patientId)
      ]);
      
      const sortedLabData = [...labData].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      
      const sortedImagingData = [...imagingData].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      
      setLabResults(sortedLabData);
      setImagingResults(sortedImagingData);
    } catch (error) {
      message.error(`Sonuçlar yüklenirken bir hata oluştu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfView = async (recordId) => {
    try {
      setLoading(true);
      const response = await getLabRequestPdfById(patientId, recordId);
      
      if (!response || !response.pdfData) {
        message.error('PDF verisi bulunamadı');
        return;
      }

      // Base64'ten PDF oluştur
      const pdfContent = atob(response.pdfData);
      const bytes = new Uint8Array(pdfContent.length);
      for (let i = 0; i < pdfContent.length; i++) {
        bytes[i] = pdfContent.charCodeAt(i);
      }
      
      // PDF'i görüntüle
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      
      // Yeni pencerede aç
      const newWindow = window.open(pdfUrl, '_blank');
      
      // Pencere kapandığında URL'i temizle
      if (newWindow) {
        newWindow.onunload = () => {
          URL.revokeObjectURL(pdfUrl);
        };
      }

      // Yedek temizleme (30 saniye sonra)
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 30000);

    } catch (error) {
      console.error('PDF görüntüleme hatası:', error);
      message.error('PDF görüntülenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageView = async (imageId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      setLoading(true);
      const response = await getImagingRequestImageById(patientId, imageId);
      
      if (!response || !response.imageData) {
        message.error('Görüntü verisi bulunamadı. Lütfen teknisyenin görüntüyü yüklemesini bekleyin.');
        return;
      }

      // Base64'ten görüntü oluştur
      const imageContent = atob(response.imageData);
      const bytes = new Uint8Array(imageContent.length);
      for (let i = 0; i < imageContent.length; i++) {
        bytes[i] = imageContent.charCodeAt(i);
      }
      
      // Görüntüyü görüntüle
      const blob = new Blob([bytes], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      
      // Yeni pencerede aç
      const newWindow = window.open(imageUrl, '_blank');
      
      // Pencere kapandığında URL'i temizle
      if (newWindow) {
        newWindow.onunload = () => {
          URL.revokeObjectURL(imageUrl);
        };
      }

      // Yedek temizleme (30 saniye sonra)
      setTimeout(() => {
        URL.revokeObjectURL(imageUrl);
      }, 30000);

    } catch (error) {
      console.error('Görüntü görüntüleme hatası:', error);
      
      if (error.response?.status === 403) {
        message.error('Bu görüntüye erişim yetkiniz bulunmamaktadır. Lütfen tekrar giriş yapın.');
      } else if (error.response?.status === 404) {
        message.error('Görüntü henüz yüklenmemiş. Lütfen teknisyenin görüntüyü yüklemesini ve işlemi tamamlamasını bekleyin.');
      } else if (error.code === 'ERR_NETWORK') {
        message.error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
      } else if (error.message.includes('Görüntü verisi bulunamadı')) {
        message.error('Görüntü verisi henüz hazır değil. Lütfen teknisyenin işlemi tamamlamasını bekleyin.');
      } else {
        message.error('Görüntü görüntülenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterByStatus = (data) => {
    if (statusFilter === 'ALL') return data;
    return data.filter(item => item.status === statusFilter);
  };

  const StatusFilter = () => (
    <Space style={{ marginBottom: 16 }}>
      <FilterOutlined />
      <Select
        value={statusFilter}
        onChange={setStatusFilter}
        style={{ width: 120 }}
        options={[
          { value: 'ALL', label: 'Tümü' },
          { value: 'COMPLETED', label: 'Tamamlandı' },
          { value: 'PENDING', label: 'Bekliyor' }
        ]}
      />
    </Space>
  );

  const labColumns = [
    {
      title: 'Test Tipi',
      dataIndex: 'testType',
      key: 'testType',
      render: (text) => text.replace(/_/g, ' ')
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'COMPLETED' ? 'green' : 'gold'}>
          {status === 'COMPLETED' ? 'Tamamlandı' : 'Bekliyor'}
        </Tag>
      )
    },
    !isMobile && {
      title: 'Oluşturulma Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('tr-TR')
    },
    !isMobile && {
      title: 'Tamamlanma Tarihi',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date) => date ? new Date(date).toLocaleDateString('tr-TR') : '-'
    },
    {
      title: 'İşlem',
      key: 'action',
      render: (_, record) => (
        <Button 
          type={isMobile ? "link" : "primary"}
          size={isMobile ? "small" : "middle"}
          icon={<FileTextOutlined />}
          onClick={() => handlePdfView(record.id)}
          disabled={record.status !== 'COMPLETED'}
          loading={loading}
        >
          {!isMobile && "PDF Görüntüle"}
        </Button>
      )
    }
  ].filter(Boolean);

  const imagingColumns = [
    {
      title: 'Görüntüleme Tipi',
      dataIndex: 'imagingType',
      key: 'imagingType'
    },
    !isMobile && {
      title: 'Öncelik',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={priority === 'URGENT' ? 'red' : 'blue'}>
          {priority === 'URGENT' ? 'Acil' : 'Normal'}
        </Tag>
      )
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'COMPLETED' ? 'green' : 'gold'}>
          {status === 'COMPLETED' ? 'Tamamlandı' : 'Bekliyor'}
        </Tag>
      )
    },
    !isMobile && {
      title: 'Vücut Bölgesi',
      dataIndex: 'bodyPart',
      key: 'bodyPart'
    },
    !isMobile && {
      title: 'Doktor',
      dataIndex: 'doctorName',
      key: 'doctorName'
    },
    !isMobile && {
      title: 'Bulgular',
      dataIndex: 'findings',
      key: 'findings',
      ellipsis: true
    },
    !isMobile && {
      title: 'Tarih',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('tr-TR')
    },
    {
      title: 'Görüntü',
      key: 'action',
      render: (_, record) => (
        <Button 
          type={isMobile ? "link" : "primary"}
          size={isMobile ? "small" : "middle"}
          icon={<PictureOutlined />}
          onClick={(e) => handleImageView(record.id, e)}
          disabled={record.status !== 'COMPLETED'}
          loading={loading}
        >
          {!isMobile && "Görüntüle"}
        </Button>
      )
    }
  ].filter(Boolean);

  const LabResultCard = ({ item }) => (
    <Card size="small" style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <strong>Test Tipi:</strong> {item.testType.replace(/_/g, ' ')}
        </div>
        <div>
          <strong>Durum:</strong>{' '}
          <Tag color={item.status === 'COMPLETED' ? 'green' : 'gold'}>
            {item.status === 'COMPLETED' ? 'Tamamlandı' : 'Bekliyor'}
          </Tag>
        </div>
        <div>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {new Date(item.createdAt).toLocaleDateString('tr-TR')}
        </div>
        {item.completedAt && (
          <div>
            <strong>Tamamlanma:</strong> {new Date(item.completedAt).toLocaleDateString('tr-TR')}
          </div>
        )}
        <Button 
          type="primary"
          size="small"
          icon={<FileTextOutlined />}
          onClick={() => handlePdfView(item.id)}
          disabled={item.status !== 'COMPLETED'}
          loading={loading}
          block
        >
          PDF Görüntüle
        </Button>
      </div>
    </Card>
  );

  LabResultCard.propTypes = {
    item: labResultPropType.isRequired
  };

  const ImagingResultCard = ({ item }) => (
    <Card size="small" style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <strong>Görüntüleme Tipi:</strong> {item.imagingType}
        </div>
        <div>
          <strong>Durum:</strong>{' '}
          <Tag color={item.status === 'COMPLETED' ? 'green' : 'gold'}>
            {item.status === 'COMPLETED' ? 'Tamamlandı' : 'Bekliyor'}
          </Tag>
        </div>
        <div>
          <Tag color={item.priority === 'URGENT' ? 'red' : 'blue'}>
            {item.priority === 'URGENT' ? 'Acil' : 'Normal'}
          </Tag>
        </div>
        <div>
          <strong>Vücut Bölgesi:</strong> {item.bodyPart}
        </div>
        <div>
          <UserOutlined style={{ marginRight: 8 }} />
          {item.doctorName}
        </div>
        {item.findings && (
          <div>
            <FileSearchOutlined style={{ marginRight: 8 }} />
            {item.findings}
          </div>
        )}
        <div>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {new Date(item.createdAt).toLocaleDateString('tr-TR')}
        </div>
        <Button 
          type="primary"
          size="small"
          icon={<PictureOutlined />}
          onClick={(e) => handleImageView(item.id, e)}
          disabled={item.status !== 'COMPLETED'}
          loading={loading}
          block
        >
          Görüntüle
        </Button>
      </div>
    </Card>
  );

  ImagingResultCard.propTypes = {
    item: imagingResultPropType.isRequired
  };

  const renderLabContent = () => {
    const filteredData = filterByStatus(labResults);
    
    if (isMobile) {
      return (
        <>
          <StatusFilter />
          <List
            dataSource={filteredData}
            renderItem={(item) => <LabResultCard item={item} />}
            pagination={{
              pageSize: 5,
              size: "small",
              style: { marginBottom: 0 }
            }}
          />
        </>
      );
    }

    return (
      <>
        <StatusFilter />
        <Table
          columns={labColumns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 5,
            position: ['bottomRight'],
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total) => `Toplam ${total} kayıt`,
            style: { marginBottom: 0 }
          }}
          sortable={false}
        />
      </>
    );
  };

  const renderImagingContent = () => {
    const filteredData = filterByStatus(imagingResults);
    
    if (isMobile) {
      return (
        <>
          <StatusFilter />
          <List
            dataSource={filteredData}
            renderItem={(item) => <ImagingResultCard item={item} />}
            pagination={{
              pageSize: 5,
              size: "small",
              style: { marginBottom: 0 }
            }}
          />
        </>
      );
    }

    return (
      <>
        <StatusFilter />
        <Table
          columns={imagingColumns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 5,
            position: ['bottomRight'],
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total) => `Toplam ${total} kayıt`,
            style: { marginBottom: 0 }
          }}
          sortable={false}
        />
      </>
    );
  };

  return (
    <Card loading={loading}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        size={isMobile ? "small" : "middle"}
        items={[
          {
            key: '1',
            label: (
              <span>
                <ExperimentOutlined style={{ marginRight: isMobile ? '4px' : '8px' }} />
                {isMobile ? 'Lab' : 'Laboratuvar Sonuçları'}
              </span>
            ),
            children: renderLabContent()
          },
          {
            key: '2',
            label: (
              <span>
                <PictureOutlined style={{ marginRight: isMobile ? '4px' : '8px' }} />
                {isMobile ? 'Görüntüleme' : 'Görüntüleme Sonuçları'}
              </span>
            ),
            children: renderImagingContent()
          }
        ]}
      />
    </Card>
  );
};

export default PatientMedicalHistory;