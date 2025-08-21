import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Activate from "./pages/Activate.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import CreateAdvertisement from "./pages/CreateAdvertisement.jsx";
import useUserStore from "./context/UserContext.jsx";
import Contact from "./pages/Contact.jsx";
import Profile from "./pages/Profile.jsx";

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
      <Route path="/contact" Component={Contact} />
      <Route path="/login" Component={Login} />
      <Route path="/register" Component={Register} />
      <Route path="/activate" Component={Activate} />
      <Route path="/forgot-password" Component={ForgotPassword} />
      <Route path="/reset-password" Component={ResetPassword} />
      <Route path="/create" Component={CreateAdvertisement} />
    </Routes>
  );
}
