import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./redux/slices/auth-slice";
import LoadingPage from "./components/common/LoadingPage";
import AppRouter from "./router";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log("App loading...");
    setTimeout(() => {
      dispatch(logout());
      setLoading(false);
    }, 1000);
  }, []);

  console.log("Loading state:", loading);

  if (loading) {
    return <LoadingPage />;
  }

  return <AppRouter />;
};

export default App;
