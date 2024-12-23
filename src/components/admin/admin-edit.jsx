import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

import {
    Form as AntdForm,
    Button,
    Card,
    DatePicker,
    Input,
    Select,
} from "antd";
import moment from "moment";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { updateDoctor } from "../../services/doctor-service";

import { useDispatch } from "react-redux";
import { fetchSpecialties } from "../../redux/slices/specialities-thunk";
import { getAdminById } from "../../services/admin-service";

// DEĞİŞİKLİK YAPILDI: Validation schema alan adları backend ile aynı olacak şekilde düzenlendi.
// Burada phone -> telefon, address -> adres, speciality -> uzmanlik vb.
const validationSchema = Yup.object({
  ad: Yup.string().required("Ad zorunludur"),
  soyad: Yup.string().required("Soyad zorunludur"),
  email: Yup.string()
    .email("Geçerli bir email giriniz")
    .required("Email zorunludur"),
  // telefon alanı numeric kontrol istenirse regex kullanılabilir.
  telefon: Yup.string()
    .matches(/^[0-9]{10,11}$/, "Geçerli bir telefon numarası giriniz")
    .required("Telefon zorunludur"),
  adres: Yup.string().required("Adres zorunludur"),
  birthDate: Yup.date().required("Doğum tarihi zorunludur"),
  kanGrubu: Yup.string().required("Kan grubu zorunludur"),
  tcKimlik: Yup.string().required("TC Kimlik numarası zorunludur"),

  password: Yup.string().required("Şifre zorunludur"),
});

const AdminEdit = () => {
  const [initialValues, setInitialValues] = useState({
    username: "",
    ad: "",
    soyad: "",
    email: "",
    telefon: "",
    adres: "",
    birthDate: "",
    tcKimlik: "",
    kanGrubu: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        //console.log("id", id);
        const response = await getAdminById(id);
        const adminData = response;
        //console.log("adminData", adminData);
        // DEĞİŞİKLİK YAPILDI: Burada backend’den dönen alanlar ile initialValues alanları aynı isimde olmalı.
        setInitialValues({
          ...adminData,
          birthDate: adminData.birthDate ? moment(adminData.birthDate) : null,
        });
        setIsLoading(false);
      } catch (error) {
        console.log("AdminEdit.jsx fetchAdminDetails error: ", error);
        toast.error("Admin bilgileri yüklenemedi");
        //console.log("error", error);
        navigate("/dashboard/admin-management");
      }
    };

    fetchAdminDetails();
  }, [id, navigate]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // DEĞİŞİKLİK YAPILDI: values içindeki alanlar backend ile aynı isimde zaten.
      const formattedValues = {
        ...values,
        birthDate: values.birthDate
          ? values.birthDate.format("YYYY-MM-DD")
          : "",
      };
      //console.log("doctor-edit.jsx-values: ", values);
      //console.log("doctor-edit.jsx-formattedValues: ", formattedValues);
      const response = await updateDoctor(id, formattedValues);
      //console.log("response:  ", response);
      if (response === "OK") {
        toast.success("Doktor bilgileri başarıyla güncellendi");
        navigate("/dashboard/admin-management");
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Güncelleme işlemi başarısız",
      });
      toast.error("Güncelleme sırasında bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <Card
        title={
          <h2 className="md:text-xl font-semibold sm:text-xs">
            Admin Bilgileri Düzenleme
          </h2>
        }
        className="max-w-[800px] mx-auto my-8 shadow-md rounded-lg"
      >
        <Button
          className="absolute top-4 right-4 bg-blue-500 text-white"
          onClick={() => navigate("/dashboard/admin-management")}
        >
          <ArrowLeftOutlined /> Vazgeç
        </Button>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => handleSubmit(values, actions)}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
            setFieldTouched,
          }) => (
            <Form autoComplete="off">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  {/* Kişisel Bilgiler */}
                  <AntdForm.Item
                    label="Ad"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    validateStatus={errors.ad && touched.ad ? "error" : ""}
                    help={errors.ad && touched.ad ? errors.ad : ""}
                  >
                    <Input
                      name="ad"
                      placeholder="Ad"
                      onChange={(e) => setFieldValue("ad", e.target.value)}
                      onBlur={() => setFieldTouched("ad", true)}
                      value={values.ad}
                      className="w-full"
                    />
                  </AntdForm.Item>

                  <AntdForm.Item
                    label="Soyad"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    validateStatus={
                      errors.soyad && touched.soyad ? "error" : ""
                    }
                    help={errors.soyad && touched.soyad ? errors.soyad : ""}
                  >
                    <Input
                      name="soyad"
                      placeholder="Soyad"
                      onChange={(e) => setFieldValue("soyad", e.target.value)}
                      onBlur={() => setFieldTouched("soyad", true)}
                      value={values.soyad}
                      className="w-full"
                    />
                  </AntdForm.Item>

                  <AntdForm.Item
                    label="TC Kimlik"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    validateStatus={
                      errors.tcKimlik && touched.tcKimlik ? "error" : ""
                    }
                    help={
                      errors.tcKimlik && touched.tcKimlik ? errors.tcKimlik : ""
                    }
                  >
                    <Input
                      name="tcKimlik"
                      placeholder="TC Kimlik"
                      onChange={(e) =>
                        setFieldValue("tcKimlik", e.target.value)
                      }
                      onBlur={() => setFieldTouched("tcKimlik", true)}
                      value={values.tcKimlik}
                      className="w-full"
                    />
                  </AntdForm.Item>

                  <AntdForm.Item
                    label="Email"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    validateStatus={
                      errors.email && touched.email ? "error" : ""
                    }
                    help={errors.email && touched.email ? errors.email : ""}
                  >
                    <Input
                      name="email"
                      placeholder="Email"
                      onChange={(e) => setFieldValue("email", e.target.value)}
                      onBlur={() => setFieldTouched("email", true)}
                      value={values.email}
                      className="w-full"
                    />
                  </AntdForm.Item>

                  <AntdForm.Item
                    label="Telefon"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    validateStatus={
                      errors.telefon && touched.telefon ? "error" : ""
                    }
                    help={
                      errors.telefon && touched.telefon ? errors.telefon : ""
                    }
                  >
                    <Input
                      name="telefon"
                      placeholder="Telefon"
                      onChange={(e) => setFieldValue("telefon", e.target.value)}
                      onBlur={() => setFieldTouched("telefon", true)}
                      value={values.telefon}
                      className="w-full"
                    />
                  </AntdForm.Item>
                </div>

                <div className="space-y-4">
                 

                  <AntdForm.Item
                    label="Doğum Tarihi"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    validateStatus={
                      errors.birthDate && touched.birthDate ? "error" : ""
                    }
                    help={
                      errors.birthDate && touched.birthDate
                        ? errors.birthDate
                        : ""
                    }
                  >
                    <DatePicker
                      className="w-full"
                      placeholder="Doğum Tarihi"
                      onChange={(date) => setFieldValue("birthDate", date)}
                      onBlur={() => setFieldTouched("birthDate", true)}
                      value={values.birthDate}
                    />
                  </AntdForm.Item>

                  <AntdForm.Item
                    label="Kan Grubu"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    validateStatus={
                      errors.kanGrubu && touched.kanGrubu ? "error" : ""
                    }
                    help={
                      errors.kanGrubu && touched.kanGrubu ? errors.kanGrubu : ""
                    }
                  >
                    <Select
                      placeholder="Kan Grubu Seçiniz"
                      onChange={(value) => setFieldValue("kanGrubu", value)}
                      onBlur={() => setFieldTouched("kanGrubu", true)}
                      value={values.kanGrubu}
                      className="w-full"
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"].map(
                        (group) => (
                          <Select.Option key={group} value={group}>
                            {group}
                          </Select.Option>
                        )
                      )}
                    </Select>
                  </AntdForm.Item>
                </div>
              </div>

              {/* Full Width Fields */}
              <div className="mt-4 space-y-4">
                <AntdForm.Item
                  label="Adres"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
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
                    className="w-full"
                  />
                </AntdForm.Item>

                <AntdForm.Item
                  label="Şifre"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  validateStatus={
                    errors.password && touched.password ? "error" : ""
                  }
                  help={
                    errors.password && touched.password ? errors.password : ""
                  }
                >
                  <Input.Password
                    name="password"
                    placeholder="Şifre"
                    onChange={(e) => setFieldValue("password", e.target.value)}
                    onBlur={() => setFieldTouched("password", true)}
                    value={values.password}
                    className="w-full"
                  />
                </AntdForm.Item>
              </div>

              {errors.submit && (
                <div className="text-red-500 mt-4 mb-4">{errors.submit}</div>
              )}

              <div className="mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="w-full h-10"
                >
                  Güncelle
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
};

AdminEdit.propTypes = {
  labelCol: PropTypes.object,
  wrapperCol: PropTypes.object,
};

export default AdminEdit;
