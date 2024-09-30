import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hook";
import { userCurrentToken } from "../../redux/features/authSlice";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector(userCurrentToken);

  if (!token) {
    // Redirect to login and pass the intended path via the `state` property
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
