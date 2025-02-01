// Bu kod Ant Design kullanılarak formun yeniden oluşturulmuş halidir.
// Önceki haline göre değişiklikler (Kod yapısı, stil, bileşenler):
// 1. Tailwind class'ları kaldırıldı, Ant Design bileşenleri eklendi.
// 2. InputWrapper, custom DateInput, TCKimlikInput, TelefonInput kaldırıldı.
// 3. Ant Design'ın Form.Item yapısı ve validateMessages sistemi kullanıldı.
// 4. Ant Design'ın Input, Select, DatePicker, Button bileşenleri eklendi.
// 5. Kodun genel yapısı daha profesyonel ve okunabilir hale getirildi.

// Değişikliklerin kod üzerinde satır satır açıklaması yapılmıştır.

// -----------------------------------------------------
// Gerekli importlar:
import React from "react"; // React kütüphanesi
import { Link, useNavigate } from "react-router-dom"; // Sayfa yönlendirme için useNavigate
import { Formik, Form } from "formik"; // Formik bileşeni, form yönetimi için
import * as Yup from "yup"; // Yup ile doğrulama şeması
import axios from "axios"; // API istekleri için axios
import {
  Form as AntdForm, // Ant Design'ın Form bileşenini Form olarak kullandığımız için 'as' ile yeniden adlandırıyoruz
  Input,
  Select,
  Button,
  DatePicker,
  Typography
} from "antd"; // Ant Design bileşenleri
import moment from "moment"; // Tarih formatlama için moment (Doğum tarihi seçimi)
import toast from "react-hot-toast";
import { config } from "../../helpers/config";

import PhoneInputRegister from "../../components/common/phone-input-register";
import TcInputRegister from "../../components/common/tc-input-register";
// Ant Design tipografi ayarı (Daha iyi başlıklar):
const { Title, Text } = Typography;

// -----------------------------------------------------
// Validation şeması (Yup) - Güncelleme yok, önceki kodla aynı mantık:
const validationSchema = Yup.object({
  username: Yup.string().required("TC Kimlik numarası zorunludur"),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı zorunludur"),
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
});

// -----------------------------------------------------
// Başlangıç değerleri:
const initialValues = {
  username: "",
  password: "",
  confirmPassword: "",
  ad: "",
  soyad: "",
  email: "",
  telefon: "",
  adres: "",
  birthDate: null, // Tarih artık DatePicker ile moment nesnesi olarak alınacak
  kanGrubu: "",
  tcKimlik: ""
};

// -----------------------------------------------------
// Register bileşeni:
const Register = () => {
  // useNavigate ile sayfa yönlendirme
  const navigate = useNavigate();

  // Form submit fonksiyonu
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    
    try {
      // Formdan alınan değerleri API'ye uygun formata çeviriyoruz.
      // Kullanıcı adını trim ediyoruz (boşlukları kaldır)
      const formattedValues = {
        ...values,
        username: values.username.replace(/\s/g, "").toString(),
        // birthDate alanını 'YYYY-MM-DD' formatına çeviriyoruz.
        birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : ""
      };

      // API isteği
      const response = await axios.post( config.api.baseUrl + "/auth/register", formattedValues);
      //console.log("response: ",response);
      // Başarılıysa login sayfasına yönlendir
      if (response.data.includes("Başarılı bir şekilde kayıt oldunuz.")) {
        toast.success("Başarılı bir şekilde kayıt oldunuz.");
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // Hata durumunda Formik'in setErrors fonksiyonu ile genel bir hata mesajı gösteriyoruz
      if (error.response && error.response.status === 409) {
        setErrors({
          submit: error.response?.data?.message || "Bu kullanıcı adı zaten mevcut"
        });
      } else {
        setErrors({
          submit: error.response?.data?.message || "Kayıt işlemi başarısız"
          
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------------------------------
  // Arayüz:
  // Ant Design form yapısı kullanıldı.
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "24px", background: "#fff", borderRadius: "8px" }}>
      {/* Başlık */}
      <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
        Kayıt Ol
      </Title>

      {/* Formik ile Form kontrolü */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          handleSubmit(values, actions);
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting, setFieldTouched }) => (
          <Form>
            {/* Ad */}
            <AntdForm.Item
              label={<span style={{ color: "gray", fontWeight: "bold" }}>Ad</span>}
              validateStatus={errors.ad && touched.ad ? "error" : ""}
              help={errors.ad && touched.ad ? errors.ad : ""}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                name="ad"
                placeholder="Ad"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.ad}
              />
            </AntdForm.Item>

            {/* Soyad */}
            <AntdForm.Item
              label={<span style={{ color: "gray", fontWeight: "bold" }}>Soyad</span>}
              validateStatus={errors.soyad && touched.soyad ? "error" : ""}
              help={errors.soyad && touched.soyad ? errors.soyad : ""}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                name="soyad"
                placeholder="Soyad"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.soyad}
              />
            </AntdForm.Item>

            {/* TC Kimlik */}
            <AntdForm.Item
              label={<span style={{ color: "gray", fontWeight: "bold" }}>TC Kimlik</span>}
              validateStatus={errors.tcKimlik && touched.tcKimlik ? "error" : ""}
              help={errors.tcKimlik && touched.tcKimlik ? errors.tcKimlik : ""}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
               <TcInputRegister
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

            {/* Username (Aynı TC kimlik alanı gibi zorunluluk) */}
            <AntdForm.Item
              label={<span style={{ color: "gray", fontWeight: "bold" }}>Kullanıcı Adı</span>}
              validateStatus={errors.username && touched.username ? "error" : ""}
              help={errors.username && touched.username ? errors.username : ""}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                name="username"
                placeholder="Kullanıcı Adı"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
              />
            </AntdForm.Item>

            {/* Email */}
            <AntdForm.Item
              label={<span style={{ color: "gray", fontWeight: "bold" }}>Email</span>}
              validateStatus={errors.email && touched.email ? "error" : ""}
              help={errors.email && touched.email ? errors.email : ""}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                name="email"
                placeholder="Email"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
            </AntdForm.Item>

            {/* Telefon */}
            <AntdForm.Item
              label={<span style={{ color: "gray", fontWeight: "bold" }}>Telefon</span>}
              validateStatus={errors.telefon && touched.telefon ? "error" : ""}
              help={errors.telefon && touched.telefon ? errors.telefon : ""}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
               <PhoneInputRegister
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

            {/* Doğum Tarihi */}
            <AntdForm.Item
              label={<span style={{ color: "gray", fontWeight: "bold" }}>Doğum Tarihi</span>}
              validateStatus={errors.birthDate && touched.birthDate ? "error" : ""}
              help={errors.birthDate && touched.birthDate ? errors.birthDate : ""}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Doğum Tarihi Seçiniz"
                onChange={(date) => setFieldValue("birthDate", date)}
                onBlur={handleBlur}
                value={values.birthDate ? moment(values.birthDate) : null}
                format="YYYY-MM-DD"
              />
            </AntdForm.Item>

            {/* Adres */}
            <AntdForm.Item
              label={<span style={{ color: "gray", fontWeight: "bold" }}>Adres</span>}
              validateStatus={errors.adres && touched.adres ? "error" : ""}
              help={errors.adres && touched.adres ? errors.adres : ""}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.TextArea
                name="adres"
                placeholder="Adres"
                rows={3}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.adres}
              />
            </AntdForm.Item>

            {/* Kan Grubu */}
            <AntdForm.Item
              label={<span style={{ color: "gray", fontWeight: "bold" }}>Kan Grubu</span>}
              validateStatus={errors.kanGrubu && touched.kanGrubu ? "error" : ""}
              help={errors.kanGrubu && touched.kanGrubu ? errors.kanGrubu : ""}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                placeholder="Kan grubu seçiniz"
                onChange={(value) => setFieldValue("kanGrubu", value)}
                onBlur={handleBlur}
                value={values.kanGrubu || ""}
              >
                <Select.Option value="" disabled>Kan grubu seçiniz</Select.Option>
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
              label={<span style={{ color: "gray", fontWeight: "bold" }}>Şifre</span>}
              validateStatus={errors.password && touched.password ? "error" : ""}
              help={errors.password && touched.password ? errors.password : ""}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.Password
                name="password"
                placeholder="Şifre"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
            </AntdForm.Item>

            {/* Şifre Tekrar */}
            <AntdForm.Item
              label={<span style={{ color: "gray", fontWeight: "bold" }}>Şifre Tekrar</span>}
              validateStatus={errors.confirmPassword && touched.confirmPassword ? "error" : ""}
              help={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ""}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.Password
                name="confirmPassword"
                placeholder="Şifre Tekrar"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
              />
            </AntdForm.Item>

            {/* Genel hata mesajı (submit hatası) */}
            {errors.submit && (
              <div style={{ textAlign: "center", color: "red", marginBottom: "16px" }}>
                {errors.submit}
              </div>
            )}

            {/* Kayıt Ol butonu */}
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Kaydediliyor..." : "Kayıt Ol"}
            </Button>
          </Form>
        )}
      </Formik>

      {/* Giriş yap linki */}
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <Text>
          Zaten hesabınız var mı?{" "}
          <Link to="/auth/login">
            Giriş Yap
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default Register;
