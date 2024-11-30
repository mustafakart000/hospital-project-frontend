import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import DateInput from "../../components/inputs/DateInput";
import TCKimlikInput from "../../components/inputs/TCKimlikInput";
import TelefonInput from "../../components/inputs/TelefonInput";
import { InputWrapper } from "../../components/common/InputIcons";
const validationSchema = Yup.object({
  username: Yup.string().required("TC Kimlik numarası zorunludur"),
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
});

const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
    ad: "",
    soyad: "",
    email: "",
    telefon: "",
    adres: "",
    birthDate: "",
    kanGrubu: "",
  };
  console.log("first")
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formattedValues = {
        ...values,
        username: values.username.replace(/\s/g, '').toString()
      };
        console.log(formattedValues.username)
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        formattedValues
      );
      
      if (response.data.success) {
          navigate("/auth/login");
        }
    } catch (error) {
        if(error.response.status === 409){ 
            setErrors({
                submit: error.response?.data?.message || "Kayıt işlemi başarısız",
            });
        }
        console.log("response: ",error.message)
        setErrors({
            submit: error.response?.data?.message || "Kayıt işlemi başarısız",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Kayıt Ol
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, isSubmitting }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputWrapper showCheck={values.ad && !errors.ad && touched.ad}>
                  <Field
                    name="ad"
                    type="text"
                    className={`w-full p-2 pr-8 border rounded-md ${
                      errors.ad && touched.ad 
                        ? "border-red-500" 
                        : values.ad && !errors.ad && touched.ad 
                          ? "border-green-500"
                          : ""
                    }`}
                    placeholder="Ad"
                  />
                </InputWrapper>
                {errors.ad && touched.ad && (
                  <div className="text-red-500 text-sm mt-1">{errors.ad}</div>
                )}
              </div>
              <div>
                <InputWrapper showCheck={values.soyad && !errors.soyad && touched.soyad}>
                  <Field
                    name="soyad"
                    type="text"
                    className={`w-full p-2 pr-8 border rounded-md ${
                      errors.soyad && touched.soyad 
                        ? "border-red-500" 
                        : values.soyad && !errors.soyad && touched.soyad 
                          ? "border-green-500"
                          : ""
                    }`}
                    placeholder="Soyad"
                  />
                </InputWrapper>
                {errors.soyad && touched.soyad && (
                  <div className="text-red-500 text-sm mt-1">{errors.soyad}</div>
                )}
              </div>
            </div>

            <div>
              <Field name="username" component={TCKimlikInput} />
            </div>

            <div>
              <InputWrapper showCheck={values.email && !errors.email && touched.email}>
                <Field
                  name="email"
                  type="email"
                  className={`w-full p-2 pr-8 border rounded-md ${
                    errors.email && touched.email 
                      ? "border-red-500" 
                      : values.email && !errors.email && touched.email 
                        ? "border-green-500"
                        : ""
                  }`}
                  placeholder="Email"
                />
              </InputWrapper>
              {errors.email && touched.email && (
                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
              )}
            </div>

            <div>
              <Field name="telefon" component={TelefonInput} />
            </div>

            <div>
              <Field name="birthDate" component={DateInput} />
            </div>

            <div>
              <InputWrapper showCheck={values.adres && !errors.adres && touched.adres}>
                <Field
                  as="textarea"
                  name="adres"
                  rows="3"
                  className={`w-full p-2 pr-8 border rounded-md ${
                    errors.adres && touched.adres 
                      ? "border-red-500" 
                      : values.adres && !errors.adres && touched.adres 
                        ? "border-green-500"
                        : ""
                  }`}
                  placeholder="Adres"
                />
              </InputWrapper>
              {errors.adres && touched.adres && (
                <div className="text-red-500 text-sm mt-1">{errors.adres}</div>
              )}
            </div>

            <div>
              <InputWrapper showCheck={values.kanGrubu && !errors.kanGrubu && touched.kanGrubu}>
                <Field
                  as="select"
                  name="kanGrubu"
                  className={`w-full p-2 pr-8 border rounded-md ${
                    errors.kanGrubu && touched.kanGrubu 
                      ? "border-red-500" 
                      : values.kanGrubu && !errors.kanGrubu && touched.kanGrubu 
                        ? "border-green-500"
                        : ""
                  }`}
                >
                  <option value="">Kan grubu seçiniz</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="0+">0+</option>
                  <option value="0-">0-</option>
                </Field>
              </InputWrapper>
              {errors.kanGrubu && touched.kanGrubu && (
                <div className="text-red-500 text-sm mt-1">{errors.kanGrubu}</div>
              )}
            </div>

            <div>
              <InputWrapper showCheck={values.password && !errors.password && touched.password}>
                <Field
                  name="password"
                  type="password"
                  className={`w-full p-2 pr-8 border rounded-md ${
                    errors.password && touched.password 
                      ? "border-red-500" 
                      : values.password && !errors.password && touched.password 
                        ? "border-green-500"
                        : ""
                  }`}
                  placeholder="Şifre"
                />
              </InputWrapper>
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm mt-1">{errors.password}</div>
              )}
            </div>

            {errors.submit && (
              <div className="text-red-500 text-sm text-center">{errors.submit}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Kaydediliyor..." : "Kayıt Ol"}
            </button>
          </Form>
        )}
      </Formik>

      <p className="mt-4 text-center text-gray-600">
        Zaten hesabınız var mı?{" "}
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
};

export default Register;
