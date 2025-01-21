import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

import {
  Form as AntdForm,
  Button,
  Card,
  DatePicker,
  Input,
  Select
} from "antd";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getTechnicianById, updateTechnician } from "../../services/technicians-service";
import dayjs from "dayjs";

const validationSchema = Yup.object({
  username: Yup.string().nullable(),
  password: Yup.string().nullable(),
  ad: Yup.string().nullable(),
  soyad: Yup.string().nullable(),
  email: Yup.string()
    .email("Geçerli bir email giriniz")
    .nullable(),
  telefon: Yup.string()
    .matches(/^[0-9]{10,11}$/, "Geçerli bir telefon numarası giriniz")
    .nullable(),
  adres: Yup.string().nullable(),
  birthDate: Yup.date().nullable(),
  kanGrubu: Yup.string().nullable(),
  tcKimlik: Yup.string().nullable(),
  department: Yup.string().nullable(),
  specialization: Yup.string().nullable(),
});

const TechnicianEdit = () => {
  const [initialValues, setInitialValues] = useState({
    username: "",
    password: "",
    ad: "",
    soyad: "",
    email: "",
    telefon: "",
    adres: "",
    birthDate: "",
    tcKimlik: "",
    kanGrubu: "",
    department: "",
    specialization: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTechnicianDetails = async () => {
      try {
        const response = await getTechnicianById(id);
        setInitialValues({
          ...response,
          birthDate: response.birthDate ? dayjs(response.birthDate) : null,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("TechnicianEdit.jsx fetchTechnicianDetails error: ", error);
        toast.error("Teknisyen bilgileri yüklenemedi");
        navigate("/dashboard/technician-management");
      }
    };

    fetchTechnicianDetails();
  }, [id, navigate]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formattedValues = {
        name: values.ad,
        surname: values.soyad,
        username: values.username,
        email: values.email,
        tcKimlik: values.tcKimlik,
        adres: values.adres,
        kanGrubu: values.kanGrubu,
        phoneNumber: values.telefon,
        department: values.department,
        birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : "",
        specialization: values.specialization,
      };

      const response = await updateTechnician(id, formattedValues);
      if (response) {
        toast.success("Teknisyen bilgileri başarıyla güncellendi");
        navigate("/dashboard/technician-management");
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
    <Card
      title={<h2 className="md:text-xl font-semibold sm:text-xs">Teknisyen Bilgileri Düzenleme</h2>}
      className="max-w-[800px] mx-auto my-8 shadow-md rounded-lg"
    >
      <Button 
        className="absolute top-4 right-4 bg-blue-500 text-white" 
        onClick={() => navigate("/dashboard/technician-management")}
      >
        <ArrowLeftOutlined /> Vazgeç
      </Button>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, setFieldValue, isSubmitting }) => (
          <Form autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sol Kolon */}
              <div className="space-y-4">
                <AntdForm.Item
                  label="Kullanıcı Adı"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    name="username"
                    value={values.username}
                    onChange={(e) => setFieldValue("username", e.target.value)}
                  />
                </AntdForm.Item>

                <AntdForm.Item
                  label="Ad"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    name="ad"
                    value={values.ad}
                    onChange={(e) => setFieldValue("ad", e.target.value)}
                  />
                </AntdForm.Item>

                <AntdForm.Item
                  label="Soyad"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    name="soyad"
                    value={values.soyad}
                    onChange={(e) => setFieldValue("soyad", e.target.value)}
                  />
                </AntdForm.Item>

                <AntdForm.Item
                  label="Email"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    name="email"
                    value={values.email}
                    onChange={(e) => setFieldValue("email", e.target.value)}
                  />
                </AntdForm.Item>

                <AntdForm.Item
                  label="Telefon"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    name="telefon"
                    value={values.telefon}
                    onChange={(e) => setFieldValue("telefon", e.target.value)}
                  />
                </AntdForm.Item>
              </div>

              {/* Sağ Kolon */}
              <div className="space-y-4">
                <AntdForm.Item
                  label="Departman"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    name="department"
                    value={values.department}
                    onChange={(e) => setFieldValue("department", e.target.value)}
                  />
                </AntdForm.Item>

                <AntdForm.Item
                  label="Uzmanlık"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    name="specialization"
                    value={values.specialization}
                    onChange={(e) => setFieldValue("specialization", e.target.value)}
                  />
                </AntdForm.Item>

                <AntdForm.Item
                  label="Doğum Tarihi"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <DatePicker
                    className="w-full"
                    value={values.birthDate}
                    onChange={(date) => setFieldValue("birthDate", date)}
                  />
                </AntdForm.Item>

                <AntdForm.Item
                  label="Kan Grubu"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Select
                    value={values.kanGrubu}
                    onChange={(value) => setFieldValue("kanGrubu", value)}
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"].map((group) => (
                      <Select.Option key={group} value={group}>{group}</Select.Option>
                    ))}
                  </Select>
                </AntdForm.Item>

                <AntdForm.Item
                  label="TC Kimlik"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    name="tcKimlik"
                    value={values.tcKimlik}
                    onChange={(e) => setFieldValue("tcKimlik", e.target.value)}
                  />
                </AntdForm.Item>
              </div>
            </div>

            {/* Tam Genişlik Alanlar */}
            <div className="mt-4">
              <AntdForm.Item
                label="Adres"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Input.TextArea
                  name="adres"
                  value={values.adres}
                  onChange={(e) => setFieldValue("adres", e.target.value)}
                  rows={3}
                />
              </AntdForm.Item>

              <AntdForm.Item
                label="Şifre"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Input.Password
                  name="password"
                  value={values.password}
                  onChange={(e) => setFieldValue("password", e.target.value)}
                  placeholder="Şifreyi değiştirmek için doldurun"
                />
              </AntdForm.Item>
            </div>

            {errors.submit && (
              <div className="text-red-500 mt-4 mb-4">
                {errors.submit}
              </div>
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
  );
};

export default TechnicianEdit;