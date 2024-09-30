import { useState } from "react";
import { Modal, Button } from "antd";
import { useGetAllBookingsQuery } from "../redux/api/bookingApi";

// Define types for Booking, Customer, Slot, etc.
interface Slot {
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
}

interface Booking {
  _id: string;
  service: { name: string };
  slot: Slot;
  customer: Customer;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleType: string;
  registrationPlate: string;
}

const AllUserBookings = () => {
  const { data: Bookings } = useGetAllBookingsQuery(undefined);
  const AllBookings: Booking[] = Bookings?.response.data || [];

  // State for selected user's bookings and modal visibility
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);

  // Function to group bookings by user
  const groupBookingsByUser = (bookings: Booking[]) => {
    const userBookingsMap: {
      [key: string]: { userInfo: Customer; bookings: Booking[] };
    } = {};
    bookings.forEach((booking) => {
      const userId = booking.customer._id;
      if (!userBookingsMap[userId]) {
        userBookingsMap[userId] = {
          userInfo: booking.customer,
          bookings: [],
        };
      }
      userBookingsMap[userId].bookings.push(booking);
    });
    return Object.values(userBookingsMap); // Convert to array
  };

  // Open modal with bookings for a particular user
  const handleShowBookings = (bookings: Booking[]) => {
    setSelectedBookings(bookings);
    setIsModalVisible(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Group bookings by user
  const userBookings = groupBookingsByUser(AllBookings);

  return (
    <div>
      <h1>All User Bookings</h1>
      {userBookings.length > 0 ? (
        userBookings.map(({ userInfo, bookings }) => (
          <div
            key={userInfo._id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            <h2>User: {userInfo.name}</h2>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <Button onClick={() => handleShowBookings(bookings)}>
              Show Bookings
            </Button>
          </div>
        ))
      ) : (
        <p>No bookings found.</p>
      )}

      {/* Modal for displaying user bookings */}
      <Modal
        title="User Bookings"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
      >
        {selectedBookings.length > 0 ? (
          selectedBookings.map((booking) => (
            <div key={booking._id} style={{ marginBottom: "10px" }}>
              <h3>Service: {booking.service.name}</h3>
              <p>
                <strong>Slot Date:</strong> {booking.slot.date}
              </p>
              <p>
                <strong>Time:</strong> {booking.slot.startTime} -{" "}
                {booking.slot.endTime}
              </p>
              <p>
                <strong>Vehicle:</strong> {booking.vehicleBrand}{" "}
                {booking.vehicleModel} ({booking.vehicleType})
              </p>
              <p>
                <strong>Registration Plate:</strong> {booking.registrationPlate}
              </p>
              <p>
                <strong>Booking Status:</strong>{" "}
                {booking.slot.isBooked ? "Booked" : "Available"}
              </p>
              <hr />
            </div>
          ))
        ) : (
          <p>No bookings for this user.</p>
        )}
      </Modal>
    </div>
  );
};

export default AllUserBookings;
