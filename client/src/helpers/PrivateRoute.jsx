import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../utils/auth";

export const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  toast.warning("You are not logged in.");

  console.log({ user });

  return user !== null ? children : <Navigate to="/" />;
};
