import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import About from "../pages/About";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Services from "../pages/Services";
import ServiceDetails from "../pages/ServiceDetails";

import ProtectedRoute from "../components/layouts/ProtectedRoute";

import { routesGenerator } from "../utils/routesGenerator";
import { adminPaths } from "./admin.routes";
import { userPaths } from "./user.routes";
import AllReviews from "../pages/AllReviews";
import NotFound from "../pages/NotFound";
import PaymentSuccess from "../pages/PaymentSuccess";
import Contact from "../pages/Contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/payment/success",
        element: <PaymentSuccess />,
      },

      {
        path: "services",
        element: <Services />,
      },
      {
        path: "services/:id",
        element: (
          <>
            {" "}
            <ServiceDetails />
          </>
        ),
      },
      {
        path: "reviews",
        element: <AllReviews />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "dashboard/admin",
    element: (
      <>
        <ProtectedRoute>
          {" "}
          <App></App>
        </ProtectedRoute>
      </>
    ),
    children: routesGenerator(adminPaths),
  },
  {
    path: "dashboard/user",
    element: (
      <>
        <ProtectedRoute>
          <App></App>
        </ProtectedRoute>
      </>
    ),
    children: routesGenerator(userPaths),
  },
]);

export default router;
