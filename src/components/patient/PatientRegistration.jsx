import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Col, Row, Typography } from 'antd';
import CustomInput from '../common/custom-input';
import PropTypes from 'prop-types';
import { createPatient } from '../../services/patient-service';
import { toast } from 'react-hot-toast';

const { Title } = Typography;

const validationSchema = Yup.object({
  ad: Yup.string().required('Ad zorunludur'),
  soyad: Yup.string().required('Soyad zorunludur'),
  email: Yup.string().email('Geçerli bir email giriniz').required('Email zorunludur'),
  telefon: Yup.string().matches(/^[0-9]{10,11}$/, 'Geçerli bir telefon numarası giriniz').required('Telefon zorunludur'),
  adres: Yup.string().required('Adres zorunludur'),
  tcKimlik: Yup.string().required('TC Kimlik numarası zorunludur').matches(/^\d{11}$/, 'TC Kimlik 11 haneli olmalıdır'),
  birthDate: Yup.date().required('Doğum tarihi zorunludur'),
  kanGrubu: Yup.string().required('Kan grubu zorunludur'),
});

const initialValues = {
  ad: '',
  soyad: '',
  email: '',
  telefon: '',
  adres: '',
  tcKimlik: '',
  birthDate: null,
  kanGrubu: '',
};

const PatientRegistration = ({ setActiveTab }) => {
  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const formattedValues = {
        ...values,
        username: values.username.replace(/\s/g, ''),
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : '',
      };
      const response = await createPatient(formattedValues);
      if (response.includes('Hasta başarıyla eklendi')) {
        toast.success('Başarılı bir şekilde kayıt oldunuz.');
        setActiveTab('list');
        resetForm();
      }
    } catch (error) {
      console.error('Hata:', error);
      setErrors({
        submit: error.response?.data?.message || 'Kayıt işlemi başarısız...',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[700px] mx-auto mb-5 p-5 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <Title
          level={2}
          className="text-center mb-8"
          style={{
            fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 500,
            color: '#2d3748',
            fontSize: 'clamp(1.15rem, 5vw, 2.25rem)',
          }}
        >
          Yeni Hasta Kaydı
        </Title>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, setFieldTouched, isSubmitting }) => (
          <Form>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12}>
                <CustomInput
                  id="ad"
                  label="Ad"
                  onChange={(e) => setFieldValue('ad', e.target.value)}
                  onBlur={() => setFieldTouched('ad', true)}
                  value={values.ad}
                  className="w-full"
                />
              </Col>
              <Col xs={24} sm={12}>
                <CustomInput
                  id="soyad"
                  label="Soyad"
                  onChange={(e) => setFieldValue('soyad', e.target.value)}
                  onBlur={() => setFieldTouched('soyad', true)}
                  value={values.soyad}
                  className="w-full"
                />
              </Col>
              {/* Add more fields as needed */}
              <Col xs={24}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="w-full max-w-xs"
                >
                  Kaydet
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

PatientRegistration.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

export default PatientRegistration; 