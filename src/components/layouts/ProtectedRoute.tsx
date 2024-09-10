import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hook";
import { userCurrentToken } from "../../redux/features/authSlice";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector(userCurrentToken);
  const location = useLocation(); // Capture the current location

  if (!token) {
    // Redirect to login and pass the intended path via the `state` property
    return <Navigate to="/login" replace={true} state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
