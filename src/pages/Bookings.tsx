// import { useState } from "react";
// import { Button, Modal, Form, Input } from "antd";
// import { useGetBookingsByUserQuery } from "../redux/api/bookingApi";
// import { useAppSelector } from "../redux/hook";
// import { useCreateTransactionMutation } from "../redux/api/transactionApi";

// const Bookings = () => {
//   const { data: bookings } = useGetBookingsByUserQuery(undefined);
//   const [createTransaction, { data: transactionData, isSuccess }] =
//     useCreateTransactionMutation();
//   const { user } = useAppSelector((state) => state.auth);
//   const userEmail = user?.email;

//   // Modal state
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [form] = Form.useForm();

//   // Filter bookings with "available" slots
//   const userBookings = bookings?.response?.data || [];
//   const availableBookings = userBookings.filter(
//     (booking) => booking.slot.isBooked === "available"
//   );

//   // Open modal
//   const showModal = (booking) => {
//     setSelectedBooking(booking);
//     form.setFieldsValue({
//       email: userEmail,
//       slotId: booking.slot._id,
//       amount: booking.service.price,
//     });
//     setIsModalVisible(true);
//   };

//   // Handle modal submission
//   const handleOk = () => {
//     form
//       .validateFields()
//       .then((values) => {
//         // Trigger createTransaction mutation
//         createTransaction(values);
//         setIsModalVisible(false);
//         form.resetFields(); // Reset form after submission
//       })
//       .catch((info) => {
//         console.log("Validate Failed:", info);
//       });
//   };

//   // Close modal
//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields(); // Reset form when modal is closed
//   };

//   // Redirect if transaction is successful and URL is available
//   if (isSuccess && transactionData?.url) {
//     window.location.replace(transactionData.url);
//   }

//   return (
//     <div>
//       <h2>User Bookings</h2>
//       {availableBookings.length === 0 ? (
//         <p>No available bookings for payment</p>
//       ) : (
//         availableBookings.map((booking) => (
//           <div key={booking._id}>
//             <h3>{booking.service.name}</h3>
//             <p>Slot Date: {booking.slot.date}</p>
//             <p>
//               Slot Time: {booking.slot.startTime} - {booking.slot.endTime}
//             </p>
//             <Button type="primary" onClick={() => showModal(booking)}>
//               Clear Payment
//             </Button>
//           </div>
//         ))
//       )}

//       {/* Payment Modal */}
//       <Modal
//         title="Clear Payment"
//         visible={isModalVisible}
//         onOk={handleOk}
//         onCancel={handleCancel}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[{ required: true, message: "Please enter your email" }]}
//           >
//             <Input disabled />
//           </Form.Item>
//           <Form.Item
//             label="Slot ID"
//             name="slotId"
//             rules={[{ required: true, message: "Slot ID is required" }]}
//           >
//             <Input disabled />
//           </Form.Item>
//           <Form.Item
//             label="Amount"
//             name="amount"
//             rules={[{ required: true, message: "Amount is required" }]}
//           >
//             <Input disabled />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Bookings;
