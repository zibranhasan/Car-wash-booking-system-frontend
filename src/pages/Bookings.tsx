import React, { useState } from "react";
import { Card, Row, Col, Button, Modal, List, Divider, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  useGetBookingsByUserQuery,
  useRemoveBookingMutation,
} from "../redux/api/bookingApi";
import {
  useCreateTransactionMutation,
  useGetAllTransactionQuery,
} from "../redux/api/transactionApi";
import { useAppSelector } from "../redux/hook";

const { Title, Text } = Typography;

// Define types for booking, service, slot, transaction, etc.
interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Service {
  name: string;
  description: string;
  price: number;
}

interface Booking {
  _id: string;
  service: Service;
  slot: Slot;
  vehicleBrand: string;
  vehicleModel: string;
}

interface Transaction {
  email: string;
  slotIds: Slot[];
}

const Bookings = () => {
  const { data: bookings } = useGetBookingsByUserQuery(undefined);
  const { data: allTransaction } = useGetAllTransactionQuery(undefined);
  const [removeBooking] = useRemoveBookingMutation();
  const [createTransaction] = useCreateTransactionMutation();
  const { user } = useAppSelector((state) => state.auth);
  const userEmail = user?.email;

  // Modal visibility state
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Fallback to empty arrays if the API responses are undefined
  const userBookings: Booking[] = bookings?.response.data || [];
  const transactions: Transaction[] = allTransaction?.response || [];

  // Map to match slots with emails from transactions
  const slotEmailMap = transactions.flatMap((transaction) =>
    transaction.slotIds.map((slot) => ({
      slotId: slot._id,
      email: transaction.email,
    }))
  );

  // Filter out bookings that are already paid by another user
  const filteredBookings = userBookings.filter((booking) => {
    const slotEntry = slotEmailMap.find(
      (entry) => entry.slotId === booking.slot._id
    );
    return !slotEntry || slotEntry.email === userEmail;
  });

  // Paid slot IDs for the current user
  const paidSlotIds = slotEmailMap
    .filter((entry) => entry.email === userEmail)
    .map((entry) => entry.slotId);

  // Add payment status to each booking
  const userBookingsWithStatus = filteredBookings.map((booking) => ({
    ...booking,
    paymentStatus: paidSlotIds.includes(booking.slot._id) ? "PAID" : "UNPAID",
  }));

  // Unpaid bookings for the current user
  const unpaidBookings = userBookingsWithStatus.filter(
    (booking) => booking.paymentStatus === "UNPAID"
  );

  // Calculate the total amount for unpaid bookings
  const netAmount = unpaidBookings.reduce(
    (total, booking) => total + booking.service.price,
    0
  );

  // Get slot IDs for the unpaid bookings
  const slotIds = unpaidBookings.map((booking) => booking.slot._id);

  // Modal control
  const showModal = () => setIsModalVisible(true);
  const handleOk = async () => {
    if (userEmail && slotIds.length > 0 && netAmount > 0) {
      await createTransaction({
        email: userEmail,
        amount: netAmount,
        slotIds,
      });
      setIsModalVisible(false);
    }
  };
  const handleCancel = () => setIsModalVisible(false);

  // Remove booking handler
  const handleRemoveBooking = async (bookingId: string) => {
    try {
      await removeBooking(bookingId);
    } catch (error) {
      console.error("Error removing booking:", error);
    }
  };

  // Render each booking card
  const renderBookingCard = (booking: Booking) => (
    <Card
      key={booking._id}
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Title level={5} style={{ marginBottom: 0 }}>
            {booking.service.name}
          </Title>
          <Button
            type="text"
            icon={<CloseOutlined style={{ color: "#ff4d4f" }} />}
            onClick={() => handleRemoveBooking(booking._id)}
          />
        </div>
      }
      bordered={false}
      style={{
        borderRadius: "6px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <p style={{ fontSize: "14px", marginBottom: "4px" }}>
        <Text strong>Description:</Text> {booking.service.description}
      </p>
      <p style={{ fontSize: "14px", marginBottom: "4px" }}>
        <Text strong>Price:</Text> ${booking.service.price}
      </p>
      <p style={{ fontSize: "14px", marginBottom: "4px" }}>
        <Text strong>Date:</Text> {booking.slot.date}
      </p>
      <p style={{ fontSize: "14px", marginBottom: "4px" }}>
        <Text strong>Time:</Text> {booking.slot.startTime} -{" "}
        {booking.slot.endTime}
      </p>
      <p style={{ fontSize: "14px", marginBottom: "4px" }}>
        <Text strong>Vehicle:</Text> {booking.vehicleBrand}{" "}
        {booking.vehicleModel}
      </p>
    </Card>
  );

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <Row gutter={16}>
          <Col span={24}>
            <Title level={3}>Unpaid Bookings</Title>
            <List
              dataSource={unpaidBookings}
              renderItem={(booking) => renderBookingCard(booking)}
            />
          </Col>
          <Col span={24} style={{ marginTop: "20px" }}>
            <Title level={3}>Paid Bookings</Title>
            <List
              dataSource={userBookingsWithStatus.filter(
                (booking) => booking.paymentStatus === "PAID"
              )}
              renderItem={(booking) => renderBookingCard(booking)}
            />
          </Col>
        </Row>
      </div>
      <div
        style={{
          width: "300px",
          position: "sticky",
          top: "20px",
          marginLeft: "20px",
        }}
      >
        <Card
          title={<Title level={4}>Transaction Summary</Title>}
          bordered={false}
          style={{
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: "20px",
          }}
        >
          {unpaidBookings.length > 0 ? (
            <>
              {unpaidBookings.map((booking) => (
                <div key={booking._id}>
                  <Divider />
                  <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                    <Text strong>Service:</Text> {booking.service.name}
                  </p>
                  <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                    <Text strong>Time:</Text> {booking.slot.startTime} -{" "}
                    {booking.slot.endTime}
                  </p>
                  <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                    <Text strong>Amount:</Text> ${booking.service.price}
                  </p>
                </div>
              ))}
              <Divider />
              <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                <Text strong>Total Amount:</Text> ${netAmount}
              </p>
              <Button
                type="primary"
                block
                onClick={showModal}
                size="large"
                style={{ backgroundColor: "#4caf50", borderColor: "#4caf50" }}
              >
                PAY NOW
              </Button>
            </>
          ) : (
            <Text>No unpaid bookings</Text>
          )}
        </Card>
      </div>

      {/* Modal for payment confirmation */}
      <Modal
        title="Confirm Payment"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confirm Payment"
        cancelText="Cancel"
        width={400}
      >
        <p style={{ fontSize: "14px" }}>
          <Text strong>Email:</Text> {userEmail}
        </p>
        <p style={{ fontSize: "14px" }}>
          <Text strong>Net Amount:</Text> ${netAmount}
        </p>
        <p style={{ fontSize: "14px" }}>
          <Text strong>Selected Slots:</Text> {slotIds.join(", ")}
        </p>
        {slotEmailMap.some(
          (entry) => slotIds.includes(entry.slotId) && entry.email !== userEmail
        ) && (
          <p style={{ fontSize: "14px", color: "red" }}>
            Warning: Some slots may have been booked by other users.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default Bookings;
