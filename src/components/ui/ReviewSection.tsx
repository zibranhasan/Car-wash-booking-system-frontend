import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { Button, Input, Card, Col, Row, Typography } from "antd";

const { Title, Text } = Typography;
export interface IReview {
  _id: string;
  userId?: { name: string };
  feedback: string;
  rating: number;
  createdAt?: Date;
}

const ReviewSection = ({
  reviews,
  overallRating,
  isLoggedIn,
  onSubmitReview,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviews: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overallRating: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isLoggedIn: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmitReview: any;
}) => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFeedbackChange = (e: any) => {
    setFeedback(e.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRatingChange = (rate: any) => {
    setRating(rate / 1); // Convert to 1-5 scale
  };

  const handleSubmit = async () => {
    if (feedback && rating) {
      await onSubmitReview({ feedback, rating });
      setFeedback("");
      setRating(0);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleSeeAllReviews = () => {
    navigate("/reviews");
  };

  const lastTwoReviews = reviews.slice(-2);

  return (
    <Row gutter={16}>
      <Col span={16}>
        <Card
          bordered={false}
          style={{
            padding: "10px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",

            border: "1px solid #5899f5",
            boxShadow: "0 2px 4px #5899f5",
          }}
        >
          <Title level={4} style={{ marginBottom: "8px" }}>
            Overall Rating
          </Title>
          <Text style={{ fontSize: "20px", color: "#faad14" }}>
            {overallRating.toFixed(1)} / 5
          </Text>
          <div style={{ marginTop: "16px" }}>
            <Title level={5} style={{ marginBottom: "8px" }}>
              Recent Reviews:
            </Title>
            {lastTwoReviews.map((review: IReview) => (
              <Card
                key={review._id}
                style={{
                  marginBottom: "8px",
                  padding: "8px",
                  fontSize: "14px",
                }}
                size="small"
              >
                <Text strong>{review?.userId?.name}:</Text> {review.feedback} (
                {review.rating} stars)
              </Card>
            ))}
          </div>
        </Card>
      </Col>
      <Col
        span={8}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {!isLoggedIn && (
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.1)",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            <Button type="primary" onClick={handleLoginRedirect}>
              Login to Leave a Review
            </Button>
          </div>
        )}

        {isLoggedIn && (
          <Card
            bordered={false}
            style={{
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <Title level={5} style={{ marginBottom: "8px" }}>
              Leave a Review
            </Title>
            <Input.TextArea
              rows={3}
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Write your feedback..."
              style={{ marginBottom: "8px" }}
            />
            <Rating
              onClick={handleRatingChange}
              initialValue={rating}
              size={20}
              allowHover
              style={{ marginBottom: "8px" }}
            />

            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!feedback || !rating}
              style={{ width: "100%" }}
            >
              Submit Review
            </Button>
          </Card>
        )}

        <Button
          type="default"
          onClick={handleSeeAllReviews}
          style={{ marginTop: "16px", width: "100%" }}
        >
          See All Reviews
        </Button>
      </Col>
    </Row>
  );
};

export default ReviewSection;
