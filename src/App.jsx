import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./redux/slices/auth-slice";
import LoadingPage from "./components/common/LoadingPage";
import AppRouter from "./router";
import { Toaster } from "react-hot-toast";
import { getUser } from "./services/auth-service";
import { getFromLocalStorage, removeFromLocalStorage } from "./helpers/functions/encrypted-storage";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const loadData = async () => {
    try {
      // Ana URL kontrolü için window.location.pathname kullan
      if (window.location.pathname === '/') {
        dispatch(logout());
        removeFromLocalStorage('token');
        setLoading(false);
        return;
      }

      const storedToken = getFromLocalStorage('token');
      const userData = await getUser();
      console.log("userData: ", userData)
      
      dispatch(loginSuccess({
        ...userData,
        token: storedToken,
        ad: userData.ad || '',
        soyad: userData.soyad || ''
      }));
      
    } catch (err) {
      console.error(err);
      dispatch(logout());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []); // URL değişimini izlemek için window.location'ı kullanacağız

  return (
    <>
      <Toaster position="top-right" />
      {loading ? <LoadingPage/> : <AppRouter />}
    </>
  );
};

export default App;
