import AdminDashboard from "../pages/AdminDashboard";
import AllUserBookings from "../pages/AllUserBookings";

import ManageService from "../pages/ManageService";
import ManageSlots from "../pages/ManageSlots";
import UsersProfile from "../pages/UsersProfile";

export const adminPaths = [
  {
    name: "Dashboard",
    path: "adminDashboard",
    element: <AdminDashboard />,
  },
  {
    name: "Service Management",
    children: [
      {
        name: "Manage Service",
        path: "manage-service",
        element: <ManageService />,
      },
    ],
  },
  {
    name: "Slot Management",
    children: [
      {
        name: "Manage-Slots",
        path: "manage-slots",
        element: <ManageSlots />,
      },
    ],
  },
  {
    name: "User Management",
    children: [
      {
        name: "User-Bookings",
        path: "user-bookings",
        element: <AllUserBookings />,
      },
      {
        name: "Users-Profile",
        path: "users-profile",
        element: <UsersProfile />,
      },
    ],
  },
];
