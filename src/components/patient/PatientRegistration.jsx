import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Col, Row, Typography, Select, DatePicker, Form as AntdForm, Input } from 'antd';
import { EyeTwoTone, EyeInvisibleTwoTone } from "@ant-design/icons";
import CustomInput from '../common/custom-input';
import PropTypes from 'prop-types';
import { createPatient } from '../../services/patient-service';
import { toast } from 'react-hot-toast';
import TcInput from '../common/tc-input';
import PhoneInput from '../common/phone-input';

const { Title } = Typography;

const validationSchema = Yup.object({
  ad: Yup.string().required('Ad zorunludur'),
  soyad: Yup.string().required('Soyad zorunludur'),
  username: Yup.string().required('Kullanıcı adı zorunludur'),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required('Şifre zorunludur'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı zorunludur"),
  email: Yup.string().email('Geçerli bir email giriniz').required('Email zorunludur'),
  telefon: Yup.string().matches(/^[0-9]{10,11}$/, 'Geçerli bir telefon numarası giriniz'),
  adres: Yup.string().required('Adres zorunludur'),
  tcKimlik: Yup.string().required('TC Kimlik numarası zorunludur').matches(/^\d{11}$/, 'TC Kimlik 11 haneli olmalıdır'),
  birthDate: Yup.date().required('Doğum tarihi zorunludur'),
  kanGrubu: Yup.string(),
});

const initialValues = {
  ad: '',
  soyad: '',
  username: '',
  password: '',
  confirmPassword: '',
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
      if (response.includes('Başarılı bir şekilde kayıt oldunuz.')) { 
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
        {({ values, setFieldValue, setFieldTouched, isSubmitting, errors, touched }) => {
          return (
            <Form noValidate>
              <Row gutter={[16, 24]}>
                <Col xs={24} sm={12}>
                  <div className="mb-2">
                    <CustomInput
                      id="ad"
                      label="Ad"
                      onChange={(e) => setFieldValue('ad', e.target.value)}
                      onBlur={() => setFieldTouched('ad', true)}
                      value={values.ad}
                      className="w-full"
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="mb-2">
                    <CustomInput
                      id="soyad"
                      label="Soyad"
                      onChange={(e) => setFieldValue('soyad', e.target.value)}
                      onBlur={() => setFieldTouched('soyad', true)}
                      value={values.soyad}
                      className="w-full"
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <AntdForm.Item
                    className="w-full"
                    validateStatus={errors.tcKimlik && touched.tcKimlik ? "error" : "success"}
                    help={errors.tcKimlik && touched.tcKimlik ? errors.tcKimlik : null}
                  >
                    <TcInput
                      value={values.tcKimlik}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,11}$/.test(value)) {
                          setFieldValue("tcKimlik", value);
                        }
                      }}
                      className="w-full"
                      onBlur={() => setFieldTouched("tcKimlik", true)}
                    />
                  </AntdForm.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="mb-2">
                    <CustomInput
                      id="email"
                      label="E-posta"
                      type="email"
                      onChange={(e) => setFieldValue('email', e.target.value)}
                      onBlur={() => setFieldTouched('email', true)}
                      value={values.email}
                      className="w-full"
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <AntdForm.Item
                    className="w-full"
                    validateStatus={errors.telefon && touched.telefon ? "error" : "success"}
                    help={errors.telefon && touched.telefon ? errors.telefon : null}
                  >
                    <PhoneInput
                      name="telefon"
                      placeholder="Telefon"
                      onChange={(e) => setFieldValue("telefon", e.target.value)}
                      onBlur={() => setFieldTouched("telefon", true)}
                      value={values.telefon}
                      className="w-full"
                    />
                  </AntdForm.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="mb-2">
                    <CustomInput
                      id="username"
                      label="Kullanıcı Adı"
                      onChange={(e) => setFieldValue('username', e.target.value)}
                      onBlur={() => setFieldTouched('username', true)}
                      value={values.username}
                      className="w-full"
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="mb-2">
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Doğum Tarihi
                    </label>
                    <DatePicker
                      id="birthDate"
                      className="w-full"
                      onChange={(date) => setFieldValue('birthDate', date)}
                      onBlur={() => setFieldTouched('birthDate', true)}
                      value={values.birthDate}
                      format="YYYY-MM-DD"
                      disabledDate={(current) => current && current.isAfter(new Date(), 'day')}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="mb-2">
                    <label htmlFor="kanGrubu" className="block text-sm font-medium text-gray-700 mb-1">
                      Kan Grubu
                    </label>
                    <Select
                      id="kanGrubu"
                      className="w-full"
                      onChange={(value) => setFieldValue('kanGrubu', value)}
                      onBlur={() => setFieldTouched('kanGrubu', true)}
                      value={values.kanGrubu}
                    >
                      <Select.Option value="">Seçiniz</Select.Option>
                      <Select.Option value="A+">A+</Select.Option>
                      <Select.Option value="A-">A-</Select.Option>
                      <Select.Option value="B+">B+</Select.Option>
                      <Select.Option value="B-">B-</Select.Option>
                      <Select.Option value="AB+">AB+</Select.Option>
                      <Select.Option value="AB-">AB-</Select.Option>
                      <Select.Option value="0+">0+</Select.Option>
                      <Select.Option value="0-">0-</Select.Option>
                    </Select>
                  </div>
                </Col>
                <Col xs={24}>
                  <div className="mb-2">
                    <CustomInput
                      id="adres"
                      label="Adres"
                      onChange={(e) => setFieldValue('adres', e.target.value)}
                      onBlur={() => setFieldTouched('adres', true)}
                      value={values.adres}
                      className="w-full"
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Şifre
                    </label>
                    <Input.Password
                      id="password"
                      placeholder="Şifre"
                      onChange={(e) => setFieldValue('password', e.target.value)}
                      onBlur={() => setFieldTouched('password', true)}
                      value={values.password}
                      className="w-full h-9"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleTwoTone />)}
                    />
                    {touched.password && errors.password && (
                      <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                    )}
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="mb-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Şifre Tekrar
                    </label>
                    <Input.Password
                      id="confirmPassword"
                      placeholder="Şifre Tekrar"
                      onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
                      onBlur={() => setFieldTouched('confirmPassword', true)}
                      value={values.confirmPassword}
                      className="w-full h-9"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleTwoTone />)}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                    )}
                  </div>
                </Col>
                <Col xs={24} className="mt-6">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Kaydet
                  </Button>
                  {Object.keys(errors).length > 0 && (
                    <div className="text-red-500 mt-2">
                      {Object.keys(errors).map((fieldName) => (
                        touched[fieldName] && (
                          <div key={fieldName} className="mb-1">
                            {errors[fieldName]}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

PatientRegistration.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

export default PatientRegistration; 