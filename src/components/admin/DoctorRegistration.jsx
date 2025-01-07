import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";

import {
  Form as AntdForm,
  Button,
  DatePicker,
  Typography,
  Col,
  Row,
  Input,
  Select
} from "antd";
import moment from "moment";
import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { fetchSpecialties } from "../../redux/slices/specialities-thunk";
import { createDoctor } from "../../services/doctor-service";
import "./floating-label.css";
import TcInput from "../common/tc-input";
import CustomInput from "../common/custom-input";
import PhoneInput from "../common/phone-input";
import SelectApi from "../common/select-api";
import PropTypes from "prop-types";
import { EyeTwoTone, EyeInvisibleTwoTone } from "@ant-design/icons";

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
  uzmanlik: Yup.string().required("Uzmanlık zorunludur"),
  diplomaNo: Yup.string().required("Diploma notu zorunludur"),
  unvan: Yup.string().required("Unvan zorunludur"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı zorunludur"),
});

const initialValues = {
  username: "",
  password: "",
  ad: "",
  soyad: "",
  email: "",
  telefon: "",
  adres: "",
  birthDate: null,
  kanGrubu: "",
  tcKimlik: "",
  uzmanlik: "",
  diplomaNo: "",
  unvan: "",
};

const DoctorRegistration = ( { setActiveTab } ) => {

  const dispatch = useDispatch();
  const handleSubmit = async (
    values,
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      //console.log("Gönderilen veriler:", values); // Form verilerini kontrol edin
      const formattedValues = {
        ...values,
        username: values.username.replace(/\s/g, ""),
        birthDate: values.birthDate
          ? values.birthDate.format("YYYY-MM-DD")
          : "",
      };
      //console.log("DoctorRegistration.jsx formattedValues", formattedValues);
      const response = await createDoctor(formattedValues);
      if (response.includes("Doktor başarıyla eklendi")) {
        toast.success("Başarılı bir şekilde kayıt oldunuz.");
        setActiveTab("list");
        resetForm();
      }
    } catch (error) {
      console.error("Hata:", error); // Hataları konsolda göster

      setErrors({
        submit: error.response?.data?.message || "Kayıt işlemi başarısız...",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const specialties = useSelector((state) => state.specialties);
  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

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
          Yeni Doktor Personeli
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
              {/* Uzmanlık Seçimi - Tam Genişlik */}
              <Col xs={24} className="flex justify-center">
                <AntdForm.Item
                  className="w-full max-w-md"
                  validateStatus={
                    errors.uzmanlik && touched.uzmanlik ? "error" : "success"
                  }
                  help={
                    errors.uzmanlik && touched.uzmanlik ? errors.uzmanlik : null
                  }
                >
                  <SelectApi
                    onChange={(value) => setFieldValue("uzmanlik", value)}
                    onBlur={() => setFieldTouched("speciality", true)}
                    value={values.uzmanlik || "lütfen bir uzmanlık seçiniz"}
                    options={specialties}
                    label="Uzmanlık"
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

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
                    errors.diplomaNo && touched.diplomaNo ? "error" : "success"
                  }
                  help={
                    errors.diplomaNo && touched.diplomaNo
                      ? errors.diplomaNo
                      : null
                  }
                >
                  <CustomInput
                    id="diplomaNo"
                    label="Diploma Notu"
                    onChange={(e) => setFieldValue("diplomaNo", e.target.value)}
                    onBlur={() => setFieldTouched("diplomaNo", true)}
                    value={values.diplomaNo}
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

              {/* Unvan ve Kullanıcı Adı */}
              <Col xs={24} sm={12}>
                <AntdForm.Item
                  className="w-full"
                  validateStatus={
                    errors.unvan && touched.unvan ? "error" : "success"
                  }
                  help={errors.unvan && touched.unvan ? errors.unvan : null}
                >
                  <Select
                    id="unvan"
                    className="w-full"
                    placeholder="Unvan"
                    onChange={(value) => setFieldValue('unvan', value)}
                    onBlur={() => setFieldTouched('unvan', true)}
                    value={values.unvan}
                  >
                    <Select.Option value="" disabled>Unvan</Select.Option>
                    <Select.Option value="Dr">Dr</Select.Option>
                    <Select.Option value="Doç">Doç</Select.Option>
                    <Select.Option value="Prof">Prof</Select.Option>
                  </Select>
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
                    onChange={(e) => {
                      const cleanNumber = e.target.value.replace(/\s/g, '');
                      setFieldValue("telefon", cleanNumber);
                    }}
                    onBlur={() => setFieldTouched("telefon", true)}
                    value={values.telefon}
                    className="w-full"
                  />
                </AntdForm.Item>
              </Col>

              {/* Doğum Tarihi ve Kan Grubu */}
              <Col xs={24} sm={12}>
                <div className="mb-2">
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Doğum Tarihi
                  </label>
                  <DatePicker
                    id="birthDate"
                    placeholder="Select date"
                    onChange={(date) => setFieldValue("birthDate", date)}
                    onBlur={() => setFieldTouched("birthDate", true)}
                    value={values.birthDate ? moment(values.birthDate) : null}
                    className="w-full h-9"
                    disabledDate={(current) => current && current > moment().endOf('day')}
                  />
                  {touched.birthDate && errors.birthDate && (
                    <div className="text-red-500 text-sm mt-1">{errors.birthDate}</div>
                  )}
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
                    placeholder="Seçiniz"
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
                  {touched.kanGrubu && errors.kanGrubu && (
                    <div className="text-red-500 text-sm mt-1">{errors.kanGrubu}</div>
                  )}
                </div>
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
                  <Input.Password
                    id="password"
                    placeholder="Şifre"
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
                  <Input.Password
                    id="confirmPassword"
                    placeholder="Şifre Tekrar"
                    onChange={(e) => setFieldValue("confirmPassword", e.target.value)}
                    onBlur={() => setFieldTouched("confirmPassword", true)}
                    value={values.confirmPassword}
                    className="w-full h-9"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleTwoTone />)}
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

DoctorRegistration.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

export default DoctorRegistration;
