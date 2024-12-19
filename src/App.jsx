import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./redux/slices/auth-slice";
import LoadingPage from "./components/common/LoadingPage";
import AppRouter from "./router";
import { Toaster } from "react-hot-toast";
import { getUser } from "./services/auth-service";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const loadData= async () =>{
    try {
      const resp = await getUser();
       dispatch(loginSuccess(resp));
      
    } catch (err) {
      console.error(err);
      dispatch(logout());
    }finally{
      setLoading(false);
    }
    
  }

  useEffect(() => {
    loadData();
  });



 

  return (
    <>
      <Toaster position="top-right" />
      {loading ? <LoadingPage/> : <AppRouter />}
    </>
  );
};

export default App;
