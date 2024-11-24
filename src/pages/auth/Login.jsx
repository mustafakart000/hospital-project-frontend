import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Giriş Yap</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md"
            placeholder="Email adresiniz"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Şifre</label>
          <input
            type="password"
            className="w-full p-2 border rounded-md"
            placeholder="Şifreniz"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Giriş Yap
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Hesabınız yok mu?{' '}
        <Link to="/auth/register" className="text-blue-600 hover:underline">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
};

export default Login;