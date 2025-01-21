import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import {
  Form as AntdForm,
  Button,
  Typography,
  Col,
  Row,
  Select,
  DatePicker,
  Input
} from "antd";
import moment from "moment";
import toast from "react-hot-toast";
import { createTechnician } from "../../services/technicians-service";
import CustomInput from "../common/custom-input";
import PropTypes from "prop-types";
import { EyeTwoTone, EyeInvisibleTwoTone } from "@ant-design/icons";
import TcInput from "../common/tc-input";
import PhoneInput from "../common/phone-input";

const { Title } = Typography;

const validationSchema = Yup.object({
  name: Yup.string().required("Ad zorunludur"),
  surname: Yup.string().required("Soyad zorunludur"),
  username: Yup.string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
    .matches(/^[a-zA-Z0-9_]+$/, "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir")
    .required("Kullanıcı adı zorunludur"),
  email: Yup.string()
    .email("Geçerli bir email giriniz")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Geçerli bir email giriniz")
    .required("Email zorunludur"),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı zorunludur"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10,11}$/, "Geçerli bir telefon numarası giriniz")
    .required("Telefon zorunludur"),
  tcKimlik: Yup.string()
    .required("TC Kimlik numarası zorunludur")
    .matches(/^\d{11}$/, "TC Kimlik 11 haneli olmalıdır"),
  birthDate: Yup.date().required("Doğum tarihi zorunludur"),
  adres: Yup.string().required("Adres zorunludur"),
  kanGrubu: Yup.string().required("Kan grubu zorunludur"),
  department: Yup.string().required("Departman zorunludur"),
  specialization: Yup.string().required("Uzmanlık alanı zorunludur"),
});

const initialValues = {
  name: "",
  surname: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  tcKimlik: "",
  birthDate: null,
  adres: "",
  kanGrubu: "",
  department: "",
  specialization: "",
};

const TechnicianRegistration = ({ setActiveTab }) => {
  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const formattedValues = {
        ...values,
        username: values.username.trim().replace(/\s/g, ""),
        birthDate: values.birthDate ? moment(values.birthDate).format("YYYY-MM-DD") : null,
        phoneNumber: values.phoneNumber.replace(/[^\d]/g, "")
      };
      const response = await createTechnician(formattedValues);
      if (response) {
        toast.success("Teknisyen başarıyla kaydedildi.");
        setActiveTab("list");
        resetForm();
      }
    } catch (error) {
      console.error("Hata:", error);
      toast.error(error.response?.data?.message || "Kayıt işlemi başarısız oldu");
      setErrors({
        submit: error.response?.data?.message || "Kayıt işlemi başarısız oldu. Lütfen tekrar deneyiniz.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[700px] mx-auto mb-5 p-5 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <Title level={2} className="text-center mb-8">
          Yeni Teknisyen Kaydı
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
              {/* Departman ve Uzmanlık Alanı */}
              <Col xs={24} className="flex justify-center">
                <AntdForm.Item
                  className="w-full max-w-md"
                  validateStatus={touched.department && errors.department ? "error" : ""}
                  help={touched.department && errors.department}
                >
                  <Select
                    id="department"
                    placeholder="Departman seçiniz"
                    onChange={(value) => setFieldValue("department", value)}
                    onBlur={() => setFieldTouched("department", true)}
                    value={values.department}
                    className="w-full"
                  >
                    <Select.Option value="" disabled>Departman</Select.Option>
                    <Select.Option value="Medical Laboratory">Tıbbi Laboratuvar</Select.Option>
                    <Select.Option value="Radiology">Radyoloji</Select.Option>
                  </Select>
                </AntdForm.Item>
              </Col>

              <Col xs={24} className="flex justify-center">
                <AntdForm.Item
                  className="w-full max-w-md"
                  validateStatus={touched.specialization && errors.specialization ? "error" : ""}
                  help={touched.specialization && errors.specialization}
                >
                  <Select
                    id="specialization"
                    placeholder="Uzmanlık alanı seçiniz"
                    onChange={(value) => setFieldValue("specialization", value)}
                    onBlur={() => setFieldTouched("specialization", true)}
                    value={values.specialization}
                    className="w-full"
                  >
                    <Select.Option value="" disabled>Uzmanlık Alanı</Select.Option>
                    <Select.Option value="LABORATUVAR">Laboratuvar</Select.Option>
                    <Select.Option value="RONTGEN">Röntgen</Select.Option>
                    <Select.Option value="MR">MR</Select.Option>
                    <Select.Option value="TOMOGRAFI">Tomografi</Select.Option>
                    <Select.Option value="ULTRASON">Ultrason</Select.Option>
                    <Select.Option value="EKG">EKG</Select.Option>
                  </Select>
                </AntdForm.Item>
              </Col>

              {/* Ad ve Soyad */}
              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={errors.name && touched.name ? "error" : "success"}
                  help={errors.name && touched.name ? errors.name : null}
                >
                  <CustomInput
                    id="name"
                    name="name"
                    label="Ad"
                    onChange={(e) => setFieldValue("name", e.target.value)}
                    onBlur={() => setFieldTouched("name", true)}
                    value={values.name}
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={errors.surname && touched.surname ? "error" : "success"}
                  help={errors.surname && touched.surname ? errors.surname : null}
                >
                  <CustomInput
                    id="surname"
                    name="surname"
                    label="Soyad"
                    onChange={(e) => setFieldValue("surname", e.target.value)}
                    onBlur={() => setFieldTouched("surname", true)}
                    value={values.surname}
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

              {/* Username ve Email */}
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

              {/* Adres */}
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

              {/* TC ve Telefon */}
              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={touched.tcKimlik && errors.tcKimlik ? "error" : ""}
                  help={touched.tcKimlik && errors.tcKimlik}
                >
                  <TcInput
                    value={values.tcKimlik}
                    placeholder="TC Kimlik No"
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
                  validateStatus={touched.phoneNumber && errors.phoneNumber ? "error" : ""}
                  help={touched.phoneNumber && errors.phoneNumber}
                >
                  <PhoneInput
                    name="phoneNumber"
                    placeholder="Telefon Numarası"
                    onChange={(e) => {
                      const cleanNumber = e.target.value.replace(/\s/g, '');
                      setFieldValue("phoneNumber", cleanNumber);
                    }}
                    onBlur={() => setFieldTouched("phoneNumber", true)}
                    value={values.phoneNumber}
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

              {/* Doğum Tarihi ve Kan Grubu */}
              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={touched.birthDate && errors.birthDate ? "error" : ""}
                  help={touched.birthDate && errors.birthDate}
                >
                  <DatePicker
                    id="birthDate"
                    placeholder="Doğum Tarihi Seçiniz"
                    onChange={(date) => setFieldValue("birthDate", date)}
                    onBlur={() => setFieldTouched("birthDate", true)}
                    value={values.birthDate ? moment(values.birthDate) : null}
                    className="w-full h-9"
                    disabledDate={(current) => current && current > moment().endOf('day')}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={touched.kanGrubu && errors.kanGrubu ? "error" : ""}
                  help={touched.kanGrubu && errors.kanGrubu}
                >
                  <Select
                    id="kanGrubu"
                    placeholder="Kan Grubu Seçiniz"
                    onChange={(value) => setFieldValue("kanGrubu", value)}
                    onBlur={() => setFieldTouched("kanGrubu", true)}
                    value={values.kanGrubu}
                    className="w-full"
                  >
                    <Select.Option value="" disabled>Kan Grubu Seçiniz</Select.Option>
                    <Select.Option value="A+">A+</Select.Option>
                    <Select.Option value="A-">A-</Select.Option>
                    <Select.Option value="B+">B+</Select.Option>
                    <Select.Option value="B-">B-</Select.Option>
                    <Select.Option value="AB+">AB+</Select.Option>
                    <Select.Option value="AB-">AB-</Select.Option>
                    <Select.Option value="0+">0+</Select.Option>
                    <Select.Option value="0-">0-</Select.Option>
                  </Select>
                </AntdForm.Item>
              </Col>

              {/* Şifre ve Şifre Tekrar */}
              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={touched.password && errors.password ? "error" : ""}
                  help={touched.password && errors.password}
                >
                  <Input.Password
                    id="password"
                    placeholder="Şifre Giriniz"
                    onChange={(e) => setFieldValue("password", e.target.value)}
                    onBlur={() => setFieldTouched("password", true)}
                    value={values.password}
                    className="w-full h-9"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleTwoTone />)}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={touched.confirmPassword && errors.confirmPassword ? "error" : ""}
                  help={touched.confirmPassword && errors.confirmPassword}
                >
                  <Input.Password
                    id="confirmPassword"
                    placeholder="Şifre Tekrar Giriniz"
                    onChange={(e) => setFieldValue("confirmPassword", e.target.value)}
                    onBlur={() => setFieldTouched("confirmPassword", true)}
                    value={values.confirmPassword}
                    className="w-full h-9"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleTwoTone />)}
                  />
                </AntdForm.Item>
              </Col>

              {/* Submit Button */}
              <Col xs={24}>
                <div className="flex justify-center mt-4">
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

TechnicianRegistration.propTypes = {
  setActiveTab: PropTypes.func,
};

export default TechnicianRegistration;