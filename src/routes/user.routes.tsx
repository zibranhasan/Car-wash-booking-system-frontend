import BookingManagement from "../pages/BookingManagement";

import UpdateProfile from "../pages/UpdateProfile";
import ViewProfile from "../pages/ViewProfile";

export const userPaths = [
  {
    name: "Manage Profile",
    children: [
      {
        name: "View Profile",
        path: "view-profile",
        element: <ViewProfile />,
      },
      {
        name: "Update Profile",
        path: "update-profile",
        element: <UpdateProfile />,
      },
    ],
  },
  {
    name: "Booking Management",
    children: [
      {
        name: "Bookings",
        path: "bookingsManagement",
        element: <BookingManagement />,
      },
    ],
  },
];
