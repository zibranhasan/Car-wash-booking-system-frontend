import { useState } from "react";
import { Modal, Button, Card, Avatar, Divider } from "antd";
import {
  UserOutlined,
  CarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useGetAllBookingsQuery } from "../redux/api/bookingApi";

const { Meta } = Card;

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
  photo: string;
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
    <div style={{ padding: "20px" }}>
      <h1
        style={{ textAlign: "center", marginBottom: "20px", color: "#1890ff" }}
      >
        All User Bookings
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {userBookings.length > 0 ? (
          userBookings.map(({ userInfo, bookings }) => (
            <Card
              key={userInfo._id}
              style={{
                width: 300,
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleShowBookings(bookings)}
                >
                  Show Bookings
                </Button>,
              ]}
            >
              <Meta
                avatar={
                  <Avatar
                    size={64}
                    src={userInfo.photo}
                    icon={<UserOutlined />}
                  />
                }
                title={userInfo.name}
                description={
                  <p style={{ marginBottom: 0 }}>
                    <strong>Email:</strong> {userInfo.email}
                  </p>
                }
              />
            </Card>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </div>

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
            <Card
              key={booking._id}
              style={{
                marginBottom: "10px",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              }}
            >
              <Meta
                avatar={
                  <Avatar
                    icon={<CarOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                }
                title={
                  <>
                    <strong>Service:</strong> {booking.service.name}
                  </>
                }
                description={
                  <>
                    <Divider />
                    <p>
                      <CalendarOutlined /> <strong>Date:</strong>{" "}
                      {booking.slot.date}
                    </p>
                    <p>
                      <ClockCircleOutlined /> <strong>Time:</strong>{" "}
                      {booking.slot.startTime} - {booking.slot.endTime}
                    </p>
                    <p>
                      <CarOutlined /> <strong>Vehicle:</strong>{" "}
                      {booking.vehicleBrand} {booking.vehicleModel} (
                      {booking.vehicleType})
                    </p>
                    <p>
                      <strong>Registration Plate:</strong>{" "}
                      {booking.registrationPlate}
                    </p>
                    <p>
                      <strong>Booking Status:</strong>{" "}
                      {booking.slot.isBooked ? (
                        <span style={{ color: "green" }}>Booked</span>
                      ) : (
                        <span style={{ color: "orange" }}>Available</span>
                      )}
                    </p>
                  </>
                }
              />
            </Card>
          ))
        ) : (
          <p>No bookings for this user.</p>
        )}
      </Modal>
    </div>
  );
};

export default AllUserBookings;
