import BookingManagement from "../pages/BookingManagement";
import MyDashboard from "../pages/MyDashboard";

import UpdateProfile from "../pages/UpdateProfile";
import ViewProfile from "../pages/ViewProfile";

export const userPaths = [
  {
    name: "Dashboard",
    path: "myDashboard",
    element: <MyDashboard />,
  },
  {
    name: "Bookings",
    path: "bookingsManagement",
    element: <BookingManagement />,
  },
  {
    path: "update-profile",
    element: <UpdateProfile />,
  },
  { name: "My Profile", path: "view-profile", element: <ViewProfile /> },
];
