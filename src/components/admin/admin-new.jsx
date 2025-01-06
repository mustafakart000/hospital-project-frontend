import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";


import {
  Form as AntdForm,
  Button,
  DatePicker,
  Typography,
  Col,
  Row,
} from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";


import { createAdmin } from "../../services/admin-service";
import "./floating-label.css";
import TcInput from "../common/tc-input";
import CustomInput from "../common/custom-input";
import BloodTypeSelector from "../common/blood-type-selector";
import PhoneInput from "../common/phone-input";
import PropTypes from 'prop-types';

const { Title } = Typography;

const validationSchema = Yup.object({
  username: Yup.string().required("Kullanıcı adı zorunludur"),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur"),
  ad: Yup.string().required("Ad zorunludur"),
  soyad: Yup.string().required("Soyad zorunludur"),
  email: Yup.string()
    .email("Geçerli bir email giriniz")
    .required("Email zorunludur"),
  telefon: Yup.string()
    .matches(/^[0-9]{10,11}$/, "Geçerli bir telefon numarası giriniz")
    .required("Telefon zorunludur"),
  adres: Yup.string().required("Adres zorunludur"),
  birthDate: Yup.date().required("Doğum tarihi zorunludur"),
  kanGrubu: Yup.string().required("Kan grubu zorunludur"),
  tcKimlik: Yup.string()
    .required("TC Kimlik numarası zorunludur")
    .matches(/^\d{11}$/, "TC Kimlik 11 haneli olmalıdır"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı zorunludur"),
});

const initialValues = {
    "username": "",
    "password": "",
    "ad": "",
    "soyad": "",
    "email": "",
    "telefon": "",
    "adres": "",
    "birthDate": "",
    "kanGrubu": "",
    "tcKimlik":""
  }

const AdminNew = ({setActiveTab}) => {
  const handleSubmit = async (
    values,
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      const formattedValues = {
        ...values,
        username: values.username.replace(/\s/g, ""),
        birthDate: values.birthDate
          ? values.birthDate.format("YYYY-MM-DD")
          : "",
      };
      console.log("admin-new.jsx formattedValues", formattedValues);
      const response = await createAdmin(formattedValues);
      console.log("API Yanıtı:", response);
      if (response.includes("Admin başarıyla eklendi")) {
        toast.success("Başarılı bir şekilde kayıt oldunuz.");
        setActiveTab("list");
        resetForm();
      }
    } catch (error) {
      console.error("Hata:", error);
      
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        
        if (errorMessage.includes("username")) {
          setErrors({
            username: "Bu kullanıcı adı zaten kullanılmaktadır.",
          });
          toast.error("Bu kullanıcı adı zaten kullanılmaktadır.");
        } else if (errorMessage.includes("email")) {
          setErrors({
            email: "Bu email adresi zaten kullanılmaktadır.",
          });
          toast.error("Bu email adresi zaten kullanılmaktadır.");
        } else {
          setErrors({
            submit: errorMessage,
          });
          toast.error(errorMessage);
        }
      } else {
        setErrors({
          submit: "Kayıt işlemi başarısız...",
        });
        toast.error("Kayıt işlemi başarısız...");
      }
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
            fontFamily:
              "Poppins, -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 500,
            color: "#2d3748",
            fontSize: "clamp(1.15rem, 5vw, 2.25rem)", // responsive font size
          }}
        >
          Yeni Admin Personeli
        </Title>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
        }) => (
          <Form>
            <Row gutter={[16, 8]}>
             
              {/* Kişisel Bilgiler */}
              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={errors.ad && touched.ad ? "error" : "success"}
                  help={errors.ad && touched.ad ? errors.ad : null}
                >
                  <CustomInput
                    id="ad"
                    label="Ad"
                    onChange={(e) => setFieldValue("ad", e.target.value)}
                    onBlur={() => setFieldTouched("ad", true)}
                    value={values.ad}
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={
                    errors.soyad && touched.soyad ? "error" : "success"
                  }
                  help={errors.soyad && touched.soyad ? errors.soyad : null}
                >
                  <CustomInput
                    id="soyad"
                    label="Soyad"
                    onChange={(e) => setFieldValue("soyad", e.target.value)}
                    onBlur={() => setFieldTouched("soyad", true)}
                    value={values.soyad}
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

              {/* TC ve Diploma */}
              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={
                    errors.tcKimlik && touched.tcKimlik ? "error" : "success"
                  }
                  help={
                    errors.tcKimlik && touched.tcKimlik ? errors.tcKimlik : null
                  }
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
                <AntdForm.Item
                  className="w-full"
                  validateStatus={
                    errors.username && touched.username ? "error" : "success"
                  }
                  help={
                    errors.username && touched.username ? errors.username : null
                  }
                >
                  <CustomInput
                    id="username"
                    label="Kullanıcı Adı"
                    onChange={(e) => setFieldValue("username", e.target.value)}
                    onBlur={() => setFieldTouched("username", true)}
                    value={values.username}
                    autoComplete="off"
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

              {/* Email ve Telefon */}
              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={
                    errors.email && touched.email ? "error" : "success"
                  }
                  help={errors.email && touched.email ? errors.email : null}
                >
                  <CustomInput
                    id="email"
                    label="Email"
                    onChange={(e) => setFieldValue("email", e.target.value)}
                    onBlur={() => setFieldTouched("email", true)}
                    value={values.email}
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={
                    errors.telefon && touched.telefon ? "error" : "success"
                  }
                  help={
                    errors.telefon && touched.telefon ? errors.telefon : null
                  }
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

              {/* Doğum Tarihi ve Kan Grubu */}
              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={
                    errors.birthDate && touched.birthDate ? "error" : "success"
                  }
                  help={
                    errors.birthDate && touched.birthDate
                      ? errors.birthDate
                      : null
                  }
                >
                  <DatePicker
                    showLabel={true}
                    label="Doğum Tarihi"
                    placeholder="Doğum Tarihi"
                    onChange={(date) => setFieldValue("birthDate", date)}
                    onBlur={() => setFieldTouched("birthDate", true)}
                    value={values.birthDate ? dayjs(values.birthDate) : null}
                    className="w-full h-9 border-gray-400 focus:border-blue-500 focus:ring-0"
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={
                    errors.kanGrubu && touched.kanGrubu ? "error" : "success"
                  }
                  help={
                    errors.kanGrubu && touched.kanGrubu ? errors.kanGrubu : null
                  }
                >
                  <BloodTypeSelector
                    value={values.kanGrubu}
                    onChange={(newValue) => setFieldValue("kanGrubu", newValue)}
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

              {/* Adres - Tam Genişlik */}
              <Col xs={24}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={
                    errors.adres && touched.adres ? "error" : "success"
                  }
                  help={errors.adres && touched.adres ? errors.adres : null}
                >
                  <textarea
                    id="adres"
                    placeholder="Adres"
                    onChange={(e) => setFieldValue("adres", e.target.value)}
                    onBlur={() => setFieldTouched("adres", true)}
                    value={values.adres}
                    className="w-full min-h-[100px] p-2 border border-gray-400 rounded-md resize-vertical"
                  />
                </AntdForm.Item>
              </Col>

              {/* Şifre ve Şifre Tekrar */}
              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={
                    errors.password && touched.password ? "error" : "success"
                  }
                  help={
                    errors.password && touched.password ? errors.password : null
                  }
                >
                  <CustomInput
                    id="password"
                    label="Şifre"
                    type="password"
                    onChange={(e) => setFieldValue("password", e.target.value)}
                    onBlur={() => setFieldTouched("password", true)}
                    value={values.password}
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={
                    errors.confirmPassword && touched.confirmPassword
                      ? "error"
                      : "success"
                  }
                  help={
                    errors.confirmPassword && touched.confirmPassword
                      ? errors.confirmPassword
                      : null
                  }
                >
                  <CustomInput
                    id="confirmPassword"
                    label="Şifre Tekrar"
                    type="password"
                    onChange={(e) =>
                      setFieldValue("confirmPassword", e.target.value)
                    }
                    onBlur={() => setFieldTouched("confirmPassword", true)}
                    value={values.confirmPassword}
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

              {/* Submit Button ve Hata Mesajı */}
              <Col xs={24}>
                {errors.submit && (
                  <div className="text-red-500 mb-4 text-center">
                    {errors.submit}
                  </div>
                )}

                <div className="flex justify-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full max-w-xs"
                  >
                    Kaydet
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

AdminNew.propTypes = {
  setActiveTab: PropTypes.func.isRequired
};

export default AdminNew;
