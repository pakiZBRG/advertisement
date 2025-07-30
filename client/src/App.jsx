import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Register from "./pages/Register.jsx";
import Activate from "./pages/Activate.jsx";
import CreateAdvertisement from "./pages/CreateAdvertisement.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/login" Component={Login} />
      <Route path="/register" Component={Register} />
      <Route path="/activate" Component={Activate} />
      <Route path="/forgot-password" Component={ForgotPassword} />
      <Route path="/create" Component={CreateAdvertisement} />
    </Routes>
  );
}
