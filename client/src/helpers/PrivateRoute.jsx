import { Navigate } from "react-router-dom";
import useUserStore from "../context/UserContext";

export const PrivateRoute = ({ children }) => {
  const { user } = useUserStore();

  return user?.length === 0 ? <Navigate to="/" /> : children;
};
