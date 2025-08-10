import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Activate from "./pages/Activate.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import CreateAdvertisement from "./pages/CreateAdvertisement.jsx";
import { PrivateRoute } from "./helpers/PrivateRoute.jsx";
import useUserStore from "./context/UserContext.jsx";

export default function App() {
  const checkAuth = useUserStore((store) => store.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route
        path="/login"
        element={
          // <PrivateRoute>
          <Login />
          // </PrivateRoute>
        }
      />
      <Route path="/register" Component={Register} />
      <Route path="/activate" Component={Activate} />
      <Route path="/forgot-password" Component={ForgotPassword} />
      <Route path="/reset-password" Component={ResetPassword} />
      <Route
        path="/create"
        element={
          // <PrivateRoute>
          <CreateAdvertisement />
          // </PrivateRoute>
        }
      />
    </Routes>
  );
}
