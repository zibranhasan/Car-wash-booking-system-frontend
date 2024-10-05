import { useState } from "react";
import { Modal, Rate, Button, message } from "antd";
import Countdown from "react-countdown";
import { useGetBookingsByUserQuery } from "../redux/api/bookingApi";
import { useCreateRatingMutation } from "../redux/api/reviewApi";
import "./BookingManagement.css";

const BookingManagement = () => {
  const { data: bookings } = useGetBookingsByUserQuery(undefined);
  const [createRating] = useCreateRatingMutation();
  const userBookings = bookings?.response?.data || [];
  const now = new Date().getTime();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [rating, setRating] = useState<number>(0);

  // Open modal and set the service ID for review
  const handleOpenReviewModal = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setIsModalVisible(true);
  };

  // Close the modal and reset state
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedServiceId(null);
    setRating(0); // Reset rating
  };

  // Submit review and handle response
  const handleSubmitReview = async () => {
    if (selectedServiceId) {
      try {
        await createRating({ id: selectedServiceId, rating });
        message.success("Review submitted successfully!");
        handleCloseModal();
      } catch (error) {
        message.error("Failed to submit review. Please try again.");
      }
    }
  };

  // Custom countdown renderer
  const getCountdownRenderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any) => {
    if (completed) {
      return <span>Time's up!</span>;
    }
    return (
      <div className="countdown-timer">
        {days > 0 && <span>{days}d </span>}
        {hours > 0 && <span>{hours}h </span>}
        {minutes > 0 && <span>{minutes}m </span>}
        <span>{seconds}s</span>
      </div>
    );
  };

  return (
    <div className="booking-management">
      <h2>Upcoming Bookings</h2>
      <div className="booking-cards">
        {userBookings
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((booking: any) => {
            const bookingDateTime = new Date(
              `${booking.slot.date}T${booking.slot.startTime}`
            ).getTime();
            return bookingDateTime >= now;
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((booking: any) => (
            <div key={booking._id} className="booking-card">
              <h3>Service: {booking?.service?.name || "N/A"}</h3>
              <p>Date: {booking?.slot?.date || "N/A"}</p>
              <p>
                Time: {booking?.slot?.startTime || "N/A"} -{" "}
                {booking?.slot?.endTime || "N/A"}
              </p>
              <Countdown
                date={new Date(
                  `${booking.slot.date}T${booking.slot.startTime}`
                ).getTime()}
                renderer={getCountdownRenderer}
              />
            </div>
          ))}
      </div>

      <h2>Past Bookings</h2>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Vehicle</th>
            <th>Registration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userBookings
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((booking: any) => {
              const bookingDateTime = new Date(
                `${booking.slot.date}T${booking.slot.startTime}`
              ).getTime();
              return bookingDateTime < now;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((booking: any) => (
              <tr key={booking._id}>
                <td>{booking?.service?.name || "N/A"}</td>
                <td>{booking?.slot?.date || "N/A"}</td>
                <td>
                  {booking?.slot?.startTime || "N/A"} -{" "}
                  {booking?.slot?.endTime || "N/A"}
                </td>
                <td>{`${booking?.vehicleBrand || "N/A"} ${
                  booking?.vehicleModel || "N/A"
                }`}</td>
                <td>{booking?.registrationPlate || "N/A"}</td>
                <td>
                  <Button
                    type="primary"
                    onClick={() => handleOpenReviewModal(booking.service._id)}
                  >
                    Give Rating
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Review Modal */}
      <Modal
        title="Give Review"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onOk={handleSubmitReview}
        okText="Submit Review"
        okButtonProps={{ disabled: rating === 0 }}
      >
        <h3>Rating:</h3>
        <Rate value={rating} onChange={(value) => setRating(value)} />
      </Modal>
    </div>
  );
};

export default BookingManagement;
