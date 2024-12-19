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
} from "antd";
import moment from "moment";
import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSpecialties } from "../../redux/slices/specialities-thunk";
import { createDoctor } from "../../services/doctor-service";
import "./floating-label.css";
import TcInput from "../common/tc-input";
import CustomInput from "../common/custom-input";
import BloodTypeSelector from "../common/blood-type-selector";
import PhoneInput from "../common/phone-input";
import SelectApi from "../common/select-api";

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

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      console.log("Gönderilen veriler:", values); // Form verilerini kontrol edin
      const formattedValues = {
        ...values,
        username: values.username.replace(/\s/g, ""),
        birthDate: values.birthDate
          ? values.birthDate.format("YYYY-MM-DD")
          : "",
      };
      console.log("DoctorRegistration.jsx formattedValues", formattedValues);
      const response = await createDoctor(formattedValues);
      console.log("API Yanıtı:", response); // API yanıtını kontrol edin
      if (response.includes("Doktor başarıyla eklendi")) {
        toast.success("Başarılı bir şekilde kayıt oldunuz.");
        Form.resetFields();
        navigate("/dashboard/doctor-management");
      }
    } catch (error) {
      console.error("Hata:", error); // Hataları konsolda göster

      setErrors({
        submit: error.response?.data?.message || "Kayıt işlemi başarısız",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const specialties = useSelector((state) => state.specialties);
  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  console.log("specialties", specialties);
  return (
    <div
      className="sm:w-full md:w-full lg:[50%] xl:[50%]"
      style={{
        
        maxWidth: '900px',
        margin: '0 auto',
        marginBottom: '20px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        Doktor Kaydı
      </Title>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => handleSubmit(values, actions)}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
        }) => (
          <Form >
            <Row justify="sm:center" align="middle" gutter={[24, 16]} className="sm:w-full md:w-full lg:[50%] xl:[50%]">
              <Col xs={24} sm={24} md={24}>
                <AntdForm.Item
                  className="w-full mb-0"
                  validateStatus={errors.uzmanlik && touched.uzmanlik ? "error" : ""}
                  help={errors.uzmanlik && touched.uzmanlik ? errors.uzmanlik : ""}
                >
                  <SelectApi
                    onChange={(value) => setFieldValue("uzmanlik", value)}
                    onBlur={() => setFieldTouched("speciality", true)}
                    value={values.uzmanlik || "lütfen bir uzmanlık seçiniz"}
                    options={specialties}
                    label="Uzmanlık"
                    className="w-full"
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <AntdForm.Item
                  className="w-full flex xs:justify-center sm:justify-center md:justify-end m-0"
                  validateStatus={errors.ad && touched.ad ? "error" : "success"}
                  help={errors.ad && touched.ad ? errors.ad : null}
                >
                  <CustomInput
                    containerClassName="w-full"
                    id="ad"
                    label="Ad"
                    onChange={(e) => setFieldValue("ad", e.target.value)}
                    onBlur={() => setFieldTouched("ad", true)}
                    value={values.ad}
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <AntdForm.Item
                  className="w-full flex sm:justify-center md:justify-start m-0"
                  validateStatus={errors.soyad && touched.soyad ? "error" : "success"}
                  help={errors.soyad && touched.soyad ? errors.soyad : null}
                >
                  <CustomInput
                    id="soyad"
                    label="Soyad"
                    onChange={(e) => setFieldValue("soyad", e.target.value)}
                    onBlur={() => setFieldTouched("soyad", true)}
                    value={values.soyad}
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <AntdForm.Item
                  className="w-full flex sm:justify-center md:justify-end m-0"
                  validateStatus={errors.tcKimlik && touched.tcKimlik ? "error" : "success"}
                  help={errors.tcKimlik && touched.tcKimlik ? errors.tcKimlik : null}
                >
                  <TcInput
                    value={values.tcKimlik}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Sadece sayısal değer ve 11 karakterden uzun olmadığını kontrol et
                      if (/^\d{0,11}$/.test(value)) {
                        setFieldValue("tcKimlik", value);
                      }
                    }}
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                    onBlur={() => setFieldTouched("tcKimlik", true)}
                    error={
                      touched.tcKimlik && errors.tcKimlik ? errors.tcKimlik : ""
                    }
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <AntdForm.Item
                  className="w-full flex sm:justify-center md:justify-start m-0"
                  validateStatus={errors.diplomaNo && touched.diplomaNo ? "error" : "success"}
                  help={errors.diplomaNo && touched.diplomaNo ? errors.diplomaNo : null}
                >
                  <CustomInput
                    id="diplomaNo"
                    label="Diploma Notu"
                    onChange={(e) => setFieldValue("diplomaNo", e.target.value)}
                    onBlur={() => setFieldTouched("diplomaNo", true)}
                    value={values.diplomaNo}
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <AntdForm.Item
                  className="w-full flex sm:justify-center md:justify-end m-0"
                  validateStatus={errors.unvan && touched.unvan ? "error" : "success"}
                  help={errors.unvan && touched.unvan ? errors.unvan : null}
                >
                  <CustomInput
                    id="unvan"
                    label="Unvan"
                    onChange={(e) => setFieldValue("unvan", e.target.value)}
                    onBlur={() => setFieldTouched("unvan", true)}
                    value={values.unvan}
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <AntdForm.Item
                  className="w-full flex sm:justify-center md:justify-start m-0"
                  validateStatus={errors.username && touched.username ? "error" : "success"}
                  help={errors.username && touched.username ? errors.username : null}
                >
                  <CustomInput
                    id="username"
                    label="Kullanıcı Adı"
                    onChange={(e) => setFieldValue("username", e.target.value)}
                    onBlur={() => setFieldTouched("username", true)}
                    value={values.username}
                    autoComplete="off"
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <AntdForm.Item
                  className="w-full flex sm:justify-center md:justify-end m-0"
                  validateStatus={errors.email && touched.email ? "error" : "success"}
                  help={errors.email && touched.email ? errors.email : null}
                >
                  <CustomInput
                    id="email"
                    label="Email"
                    onChange={(e) => setFieldValue("email", e.target.value)}
                    onBlur={() => setFieldTouched("email", true)}
                    value={values.email}
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <AntdForm.Item
                  className="w-full flex sm:justify-center md:justify-start m-0"
                  validateStatus={errors.telefon && touched.telefon ? "error" : "success"}
                  help={errors.telefon && touched.telefon ? errors.telefon : null}
                >
                  <PhoneInput
                    name="telefon"
                    placeholder="Telefon"
                    onChange={(e) => setFieldValue("telefon", e.target.value)}
                    onBlur={() => setFieldTouched("telefon", true)}
                    value={values.telefon}
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12} md={12} >
                <AntdForm.Item
                  className="w-full flex sm:justify-center md:justify-end m-0 "
                  validateStatus={errors.birthDate && touched.birthDate ? "error" : "success"}
                  help={errors.birthDate && touched.birthDate ? errors.birthDate : null}
                >
                  <DatePicker
                    showLabel={true}
                    label="Doğum Tarihi"
                    style={{ width: "196.8px" }}
                    placeholder="Doğum Tarihi"
                    onChange={(date) => setFieldValue("birthDate", date)}
                    onBlur={() => setFieldTouched("birthDate", true)}
                    value={values.birthDate ? moment(values.birthDate) : null}
                    className="h-9 border-gray-400 focus:border-blue-500 focus:ring-0"
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <AntdForm.Item
                  className="w-full flex sm:justify-center md:justify-start m-0"
                  validateStatus={errors.kanGrubu && touched.kanGrubu ? "error" : "success"}
                  help={errors.kanGrubu && touched.kanGrubu ? errors.kanGrubu : null}
                >
                  <BloodTypeSelector
                    value={values.kanGrubu}
                    onChange={(newValue) => setFieldValue("kanGrubu", newValue)}
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={24} md={24}>
                <AntdForm.Item
                  className="w-full mb-0 flex justify-center"
                  validateStatus={errors.adres && touched.adres ? "error" : "success"}
                  help={errors.adres && touched.adres ? errors.adres : null}
                >
                  <textarea
                    id="adres"
                    placeholder="Adres"
                    onChange={(e) => setFieldValue("adres", e.target.value)}
                    onBlur={() => setFieldTouched("adres", true)}
                    value={values.adres}
                    style={{
                      borderRadius: "4px",
                      border: "1px solid #b4b8b6",
                      width: "100%",
                      maxWidth: "300px",
                      minHeight: "100px",
                      resize: "vertical",
                      margin: "0 auto",
                    }}
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <AntdForm.Item
                  className="w-full flex xs:justify-center sm:justify-center md:justify-end  m-0"
                  validateStatus={errors.password && touched.password ? "error" : "success"}
                  help={errors.password && touched.password ? errors.password : null}
                >
                  <CustomInput
                    id="password"
                    label="Şifre"
                    type="password"
                    onChange={(e) => setFieldValue("password", e.target.value)}
                    onBlur={() => setFieldTouched("password", true)}
                    value={values.password}
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                    containerClassName="w-full"
                  />
                </AntdForm.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <AntdForm.Item
                  className="w-full flex sm:justify-center md:justify-start m-0"
                  validateStatus={errors.confirmPassword && touched.confirmPassword ? "error" : "success"}
                  help={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : null}
                >
                  <CustomInput
                    id="confirmPassword"
                    label="Şifre Tekrar"
                    type="password"
                    onChange={(e) => setFieldValue("confirmPassword", e.target.value)}
                    onBlur={() => setFieldTouched("confirmPassword", true)}
                    value={values.confirmPassword}
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                  />
                </AntdForm.Item>
              </Col>

              {errors.submit && (
                <div style={{ color: "red", marginBottom: "16px" }}>
                  {errors.submit}
                </div>
              )}

              <div className="col-span-full flex justify-center mt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  style={{ width: '100%', maxWidth: '220px' }}
                >
                  Kaydet
                </Button>
              </div>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DoctorRegistration;
