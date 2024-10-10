import { jwtDecode } from "jwt-decode";

// Define your custom payload interface that matches your JWT structure
interface CustomJwtPayload {
  role: string;
  email: string;
  // Add other fields if necessary
}

// Use jwt-decode to decode the token
export const verifyToken = (token: string): CustomJwtPayload => {
  return jwtDecode<CustomJwtPayload>(token);
};
