import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Tabs, message } from 'antd';
import { FileTextOutlined, ExperimentOutlined, PictureOutlined } from '@ant-design/icons';
import { getLabRequestPdf, getImagingRequestByPatientId, getLabRequestPdfById, getImagingRequestImageById } from '../../services/technicians-service';
import { useSelector } from 'react-redux';

const LabAndImagingResults = () => {
  const [labResults, setLabResults] = useState([]);
  const [imagingResults, setImagingResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const patientId = useSelector(state => state.auth.user.id.toString());

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

  const handleImageView = async (imageId) => {
    try {
      setLoading(true);
      const response = await getImagingRequestImageById(patientId, imageId);
      
      // JSON'ı parse et
      const textDecoder = new TextDecoder('utf-8');
      const jsonStr = textDecoder.decode(response);
      const data = JSON.parse(jsonStr);
      
      console.log('Parsed response:', data);

      // imagingUrl veya imageData alanını kontrol et
      if (data.imagingUrl) {
        window.open(data.imagingUrl, '_blank');
      } else if (data.imageData) {
        // Base64 görüntü verisi varsa
        const imageUrl = `data:image/jpeg;base64,${data.imageData}`;
        window.open(imageUrl, '_blank');
      } else {
        message.error('Görüntü verisi bulunamadı');
      }

    } catch (error) {
      console.error('Görüntü görüntüleme hatası:', error);
      message.error('Görüntü görüntülenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

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
    {
      title: 'Oluşturulma Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('tr-TR')
    },
    {
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
          type="primary" 
          icon={<FileTextOutlined />}
          onClick={() => handlePdfView(record.id)}
          disabled={record.status !== 'COMPLETED'}
          loading={loading}
        >
          PDF Görüntüle
        </Button>
      )
    }
  ];

  const imagingColumns = [
    {
      title: 'Görüntüleme Tipi',
      dataIndex: 'imagingType',
      key: 'imagingType'
    },
    {
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
      title: 'Vücut Bölgesi',
      dataIndex: 'bodyPart',
      key: 'bodyPart'
    },
    {
      title: 'Doktor',
      dataIndex: 'doctorName',
      key: 'doctorName'
    },
    {
      title: 'Bulgular',
      dataIndex: 'findings',
      key: 'findings',
      ellipsis: true
    },
    {
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
          type="primary" 
          icon={<PictureOutlined />}
          onClick={() => handleImageView(record.id)}
          loading={loading}
        >
          Görüntüle
        </Button>
      )
    }
  ];

  return (
    <Card loading={loading}>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: (
              <span>
                <ExperimentOutlined style={{ marginRight: '8px' }} />
                Laboratuvar Sonuçları
              </span>
            ),
            children: (
              <Table
                columns={labColumns}
                dataSource={labResults}
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
            )
          },
          {
            key: '2',
            label: (
              <span>
                <PictureOutlined style={{ marginRight: '8px' }} />
                Görüntüleme Sonuçları
              </span>
            ),
            children: (
              <Table
                columns={imagingColumns}
                dataSource={imagingResults}
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
            )
          }
        ]}
      />
    </Card>
  );
};

export default LabAndImagingResults;