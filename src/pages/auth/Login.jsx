import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-hot-toast";
import { loginThunk } from "../../redux/slices/authThunks";
const validationSchema = yup.object({
  username: yup
    .string()
    .required("Username zorunludur"),
  password: yup.string().required("Şifre zorunludur"),
});

const ErrorMessage = ({ message }) => (
  <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md animate-fadeIn">
    {message}
  </div>
);

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);
  const [hasError, setHasError] = useState(false);

    // error değiştiğinde setErrors'u çağırıyoruz
    useEffect(() => {
      if (error) {
        formikRef.current?.setErrors({
          submit: error
        });
      }
    }, [error]);

    const formikRef = useRef();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("first");
      await dispatch(loginThunk(values));
      console.log("second");
      navigate("/dashboard");
      toast.success("Giriş başarılı");
    } catch {
      setHasError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Giriş Yap
      </h2>
      <Formik
        innerRef={formikRef}
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
              </label>
              <Field
                id="username"
                name="username"
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Username giriniz"
              />
              {errors.username && touched.username && (
                <div className="text-red-500 text-sm">{errors.username}</div>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <Field
                name="password"
                type="password"
                className="w-full p-2 border rounded-md"
                placeholder="Şifreniz"
              />
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
              )}
            </div>

            <div className={hasError ? "h-[40px] flex items-center justify-center" : ""}>
              {errors.submit && <ErrorMessage message={errors.submit} />}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </Form>
        )}
      </Formik>

      <p className="mt-4 text-center text-sm text-gray-600">
        Hesabınız yok mu?{" "}
        <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
};

export default Login;
