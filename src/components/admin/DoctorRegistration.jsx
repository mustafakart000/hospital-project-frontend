import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import * as Yup from "yup";

import {
  Form as AntdForm,
  Button,
  DatePicker,
  Input,
  Select,
  Typography,
} from "antd";
import moment from "moment";
import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSpecialties } from "../../redux/slices/specialities-thunk";
import { createDoctor } from "../../services/doctor-service";
import "./floating-label.css";

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
    .matches(/^[0-9]{11}$/, "Geçerli bir TC Kimlik numarası giriniz"),
  uzmanlik: Yup.string().required("Uzmanlık zorunludur"),
  diplomaNo: Yup.string().required("Diploma notu zorunludur"),
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
};

const DoctorRegistration = ({ labelCol, wrapperCol }) => {
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
      style={{
        maxWidth: "80%",
        margin: "0 auto",
        marginBottom: "100px",
        padding: "15px",
        paddingBottom: "100px",
        background: "#c0ccd8",
        borderRadius: "8px",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
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
          <Form className="grid md:grid-cols-2 gap-1 sm:grid-cols-1 lg:grid-cols-3">
            {/* Ad */}
            <AntdForm.Item
              layout="horizontal"
              label="Ad"
              className="custom-form-item col-span-1 md:col-span-1 lg:col-span-1"
              validateStatus={errors.ad && touched.ad ? "error" : ""}
              help={errors.ad && touched.ad ? errors.ad : ""}
            >
              <Input
                placeholder="Ad"
                onChange={(e) => setFieldValue("ad", e.target.value)}
                onBlur={() => setFieldTouched("ad", true)}
                value={values.ad}
                style={{ width: "70%" }}
              />
            </AntdForm.Item>

            {/* Soyad */}
            <AntdForm.Item
              layout="horizontal"
              label="Soyad"
              validateStatus={errors.soyad && touched.soyad ? "error" : ""}
              help={errors.soyad && touched.soyad ? errors.soyad : ""}
            >
              <Input
                name="soyad"
                placeholder="Soyad"
                onChange={(e) => setFieldValue("soyad", e.target.value)}
                onBlur={() => setFieldTouched("soyad", true)}
                value={values.soyad}
                style={{ width: "70%" }}
              />
            </AntdForm.Item>
            {/* Uzmanlık dropdown */}
            <AntdForm.Item
              layout="horizontal"
              label="Uzmanlık"
              validateStatus={
                errors.uzmanlik && touched.uzmanlik ? "error" : ""
              }
              help={errors.uzmanlik && touched.uzmanlik ? errors.uzmanlik : ""}
            >
              <Select
                placeholder="Uzmanlık Seçiniz"
                showSearch
                onChange={(value) => setFieldValue("uzmanlik", value)}
                onBlur={() => setFieldTouched("speciality", true)}
                value={
                  values.uzmanlik || "Pratisyen Hekim (Genel Sağlık Hizmetleri)"
                }
                style={{ width: "70%" }}
              >
                {specialties.map((specialty) => (
                  <Select.Option key={specialty.id} value={specialty.name}>
                    {specialty.name}
                  </Select.Option>
                ))}
              </Select>
            </AntdForm.Item>

            {/* TC Kimlik */}
            <AntdForm.Item
              layout="horizontal"
              label="TC Kimlik"
              validateStatus={
                errors.tcKimlik && touched.tcKimlik ? "error" : ""
              }
              help={errors.tcKimlik && touched.tcKimlik ? errors.tcKimlik : ""}
            >
              <Input
                name="tcKimlik"
                placeholder="TC Kimlik"
                onChange={(e) => setFieldValue("tcKimlik", e.target.value)}
                onBlur={() => setFieldTouched("tcKimlik", true)}
                value={values.tcKimlik}
                style={{ width: "70%" }}
              />
            </AntdForm.Item>

            {/* diploma not */}
            <AntdForm.Item
              layout="horizontal"
              label="Diploma Notu"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
            >
              <Input
                name="diplomaNo"
                placeholder="Diploma Notu"
                onChange={(e) => setFieldValue("diplomaNo", e.target.value)}
                onBlur={() => setFieldTouched("diplomaNo", true)}
                value={values.diplomaNo}
                style={{ width: "70%" }}
              />
            </AntdForm.Item>
            {/* unvan */}
            <AntdForm.Item
              layout="horizontal"
              label="Unvan"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
            >
              <Input
                name="unvan"
                placeholder="Unvan"
                onChange={(e) => setFieldValue("unvan", e.target.value)}
                onBlur={() => setFieldTouched("unvan", true)}
                value={values.unvan}
                style={{ width: "70%" }}
              />
            </AntdForm.Item>
            {/* Kullanıcı Adı */}
            <AntdForm.Item
              layout="horizontal"
              label="Kullanıcı Adı"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              validateStatus={
                errors.username && touched.username ? "error" : ""
              }
              help={errors.username && touched.username ? errors.username : ""}
            >
              <Input
                name="username"
                placeholder="Kullanıcı Adı"
                onChange={(e) => setFieldValue("username", e.target.value)}
                onBlur={() => setFieldTouched("username", true)}
                value={values.username}
                autoComplete="off"
                style={{ width: "70%" }}
              />
            </AntdForm.Item>

            {/* Email */}
            <AntdForm.Item
              layout="horizontal"
              label="Email"
              validateStatus={errors.email && touched.email ? "error" : ""}
              help={errors.email && touched.email ? errors.email : ""}
            >
              <Input
                name="email"
                placeholder="Email"
                onChange={(e) => setFieldValue("email", e.target.value)}
                onBlur={() => setFieldTouched("email", true)}
                value={values.email}
                style={{ width: "70%" }}
              />
            </AntdForm.Item>

            {/* Telefon */}
            <AntdForm.Item
              layout="horizontal"
              label="Telefon"
              validateStatus={errors.telefon && touched.telefon ? "error" : ""}
              help={errors.telefon && touched.telefon ? errors.telefon : ""}
            >
              <Input
                name="telefon"
                placeholder="Telefon"
                onChange={(e) => setFieldValue("telefon", e.target.value)}
                onBlur={() => setFieldTouched("telefon", true)}
                value={values.telefon}
                style={{ width: "70%" }}
              />
            </AntdForm.Item>

            {/* Doğum Tarihi */}
            <AntdForm.Item
              layout="horizontal"
              label="Doğum Tarihi"
              validateStatus={
                errors.birthDate && touched.birthDate ? "error" : ""
              }
              help={
                errors.birthDate && touched.birthDate ? errors.birthDate : ""
              }
            >
              <DatePicker
                style={{ width: "50%" }}
                placeholder="Doğum Tarihi"
                onChange={(date) => setFieldValue("birthDate", date)}
                onBlur={() => setFieldTouched("birthDate", true)}
                value={values.birthDate ? moment(values.birthDate) : null}
              />
            </AntdForm.Item>

            {/* Adres */}
            <AntdForm.Item
              layout="horizontal"
              label="Adres"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              validateStatus={errors.adres && touched.adres ? "error" : ""}
              help={errors.adres && touched.adres ? errors.adres : ""}
            >
              <Input.TextArea
                name="adres"
                placeholder="Adres"
                rows={3}
                onChange={(e) => setFieldValue("adres", e.target.value)}
                onBlur={() => setFieldTouched("adres", true)}
                value={values.adres}
              />
            </AntdForm.Item>

            {/* Kan Grubu */}
            <AntdForm.Item
              layout="horizontal"
              label="Kan Grubu"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              validateStatus={
                errors.kanGrubu && touched.kanGrubu ? "error" : ""
              }
              help={errors.kanGrubu && touched.kanGrubu ? errors.kanGrubu : ""}
            >
              <Select
                placeholder="Kan Grubu Seçiniz"
                onChange={(value) => setFieldValue("kanGrubu", value)}
                onBlur={() => setFieldTouched("kanGrubu", true)}
                value={values.kanGrubu || ""}
                style={{ width: "100%" }}
              >
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

            {/* Şifre */}
            <AntdForm.Item
              layout="horizontal"
              label="Şifre"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              validateStatus={
                errors.password && touched.password ? "error" : ""
              }
              help={errors.password && touched.password ? errors.password : ""}
            >
              <Input.Password
                name="password"
                placeholder="Şifre"
                onChange={(e) => setFieldValue("password", e.target.value)}
                onBlur={() => setFieldTouched("password", true)}
                value={values.password}
                style={{ width: "100%" }}
              />
            </AntdForm.Item>
            {/* confirm password */}
            <AntdForm.Item
              layout="horizontal"
              label="Şifre Tekrar"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              validateStatus={
                errors.confirmPassword && touched.confirmPassword ? "error" : ""
              }
              help={
                errors.confirmPassword && touched.confirmPassword
                  ? errors.confirmPassword
                  : ""
              }
            >
              <Input.Password
                name="confirmPassword"
                placeholder="Şifre Tekrar"
                onChange={(e) =>
                  setFieldValue("confirmPassword", e.target.value)
                }
                onBlur={() => setFieldTouched("confirmPassword", true)}
                value={values.confirmPassword}
                style={{ width: "100%" }}
              />
            </AntdForm.Item>

            {errors.submit && (
              <div style={{ color: "red", marginBottom: "16px" }}>
                {errors.submit}
              </div>
            )}

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Kaydet
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

DoctorRegistration.propTypes = {
  labelCol: PropTypes.object,
  wrapperCol: PropTypes.object,
};

export default DoctorRegistration;
