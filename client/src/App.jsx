import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import useUserStore from "./context/UserContext.jsx";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import Profile from "./pages/user/Profile.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Activate from "./pages/auth/Activate.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import CreateAdvertisement from "./pages/ads/CreateAdvertisement.jsx";

export default function App() {
  const { checkAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/contact" Component={Contact} />
      <Route path="/profile" Component={Profile} />
      <Route path="/login" Component={Login} />
      <Route path="/register" Component={Register} />
      <Route path="/activate" Component={Activate} />
      <Route path="/forgot-password" Component={ForgotPassword} />
      <Route path="/reset-password" Component={ResetPassword} />
      <Route path="/create" Component={CreateAdvertisement} />
    </Routes>
  );
}
