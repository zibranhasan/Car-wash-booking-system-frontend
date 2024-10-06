import { useState, useEffect } from "react";
import { Rating } from "react-simple-star-rating";
import { Button, Input, Card, Col, Row, Typography, Avatar, Modal } from "antd";
import { StarFilled } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const { Title, Text } = Typography;

export interface IReview {
  _id: string;
  userId?: { name: string; photo: string };
  feedback: string;
  rating: number;
  createdAt?: Date;
}

const ReviewSection = ({
  reviews,

  isLoggedIn,
  onSubmitReview,
}: {
  reviews: IReview[];
  overallRating: number;
  isLoggedIn: boolean;
  onSubmitReview: (data: { feedback: string; rating: number }) => void;
}) => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleRatingChange = (rate: number) => {
    setRating(rate / 1);
  };

  const handleSubmit = async () => {
    if (feedback && rating) {
      await onSubmitReview({ feedback, rating });
      setFeedback("");
      setRating(0);
      setIsModalVisible(false); // Close modal after submitting review
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Auto-slide logic for the card sets (3 cards at a time)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide + 3 >= reviews.length ? 0 : prevSlide + 3
      );
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [reviews.length]);

  // Animation variants for sliding cards
  const slideVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <Row
      style={{ padding: "0 0", width: "100vw", margin: "0 auto" }}
      justify="center"
    >
      {/* Reviews Section */}
      <Col xs={24} sm={24} md={16} style={{ width: "100%" }}>
        <Title
          level={3}
          style={{
            color: "#2c3e50", // Title color
            marginBottom: "16px", // Space below the title
            textAlign: "center", // Align center
            fontWeight: "bold", // Make the title bold
            fontSize: "28px", // Increase font size
            textTransform: "uppercase", // Uppercase letters
            letterSpacing: "1px", // Increase space between letters
            background: "linear-gradient(to right, #ff4d4f, #001529)", // Background gradient
            WebkitBackgroundClip: "text", // Clip the background to text
            WebkitTextFillColor: "transparent", // Make text fill transparent for gradient effect
            padding: "10px 0", // Add padding for spacing
            borderBottom: "2px solid #faad14", // Bottom border for emphasis
          }}
        >
          What Our Customers Are Saying
        </Title>

        {/* Review Cards (3 at a time) */}
        <div
          style={{
            display: "flex",
            overflow: "hidden", // Ensure overflow is hidden to avoid second row
            justifyContent: "center",
            width: "100%",
            height: "300px", // Fixed height for the review section
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "nowrap", // Prevent wrapping into a second row
              }}
              key={currentSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideVariants}
              transition={{ duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }} // Smooth transition
            >
              {reviews
                .slice(currentSlide, currentSlide + 3)
                .map((review: IReview) => (
                  <Card
                    key={review._id}
                    bordered
                    style={{
                      padding: "10px",
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      border: "1px solid #001529", // Make border transparent to allow gradient
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      width: "280px",
                      height: "280px", // Set a fixed height for each card
                      textAlign: "center", // Center-align card content
                      backgroundImage:
                        "linear-gradient(#fff, #fff), linear-gradient(45deg, #ff4d4f, #faad14)", // Background gradient
                    }}
                  >
                    {/* Avatar Section */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Avatar src={review?.userId?.photo} size={64} />
                    </div>

                    {/* Star Rating Section */}
                    <div style={{ marginTop: "12px" }}>
                      <StarFilled
                        style={{ color: "#fa8c16", marginRight: 4 }}
                      />
                      <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
                        {review.rating} / 5
                      </Text>
                    </div>

                    {/* Feedback Section */}
                    <Text
                      style={{
                        marginTop: "12px",
                        display: "block",
                        fontSize: "14px",
                      }}
                    >
                      {review.feedback}
                    </Text>
                  </Card>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <Button
          type="primary"
          style={{
            marginTop: "2px",
            width: "100%",
            borderRadius: "5px",
          }}
          onClick={showModal}
          disabled={!isLoggedIn} // Disable button if user is not logged in
        >
          Leave a Review
        </Button>
      </Col>

      {/* Review Modal */}
      <Modal
        title="Leave a Review"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Input.TextArea
          rows={4}
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="Write your feedback..."
          style={{ marginBottom: "12px" }}
        />
        <Rating
          onClick={handleRatingChange}
          initialValue={rating * 20}
          size={30}
          allowHover
          style={{ marginBottom: "16px" }}
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!feedback || !rating}
          style={{ width: "100%", borderRadius: "5px" }}
        >
          Submit Review
        </Button>
      </Modal>
    </Row>
  );
};

export default ReviewSection;
