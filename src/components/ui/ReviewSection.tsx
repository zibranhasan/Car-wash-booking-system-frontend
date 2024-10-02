import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { Button, Input, Card, Col, Row, Typography, Avatar } from "antd";
import { StarFilled } from "@ant-design/icons"; // Ant Design icon for star

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
  overallRating,
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
  const navigate = useNavigate();

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleRatingChange = (rate: number) => {
    setRating(rate / 20); // Convert to 1-5 scale for consistency
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
    <Row gutter={[20, 20]} style={{ padding: "10px" }}>
      <Col span={16}>
        <Card
          bordered={false}
          style={{
            padding: "10px",
            backgroundColor: "#eef2f9",
            borderRadius: "10px",
            border: "1px solid #d6e0f5",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title level={3} style={{ color: "#2c3e50", marginBottom: "16px" }}>
            Overall Rating
          </Title>
          <Text
            style={{ fontSize: "24px", color: "#fa8c16", fontWeight: "bold" }}
          >
            {overallRating.toFixed(1)} / 5{" "}
            <StarFilled style={{ color: "#fa8c16" }} />
          </Text>
          <div style={{ marginTop: "24px" }}>
            <Title level={4} style={{ marginBottom: "16px", color: "#2c3e50" }}>
              Recent Reviews:
            </Title>
            {lastTwoReviews.map((review: IReview) => (
              <Card
                key={review._id}
                bordered={false}
                style={{
                  marginBottom: "16px",
                  padding: "10px",
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
                size="small"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* User's photo in a small circle */}
                  <Avatar
                    src={review?.userId?.photo}
                    size={32}
                    style={{
                      marginRight: "12px",
                      border: "2px solid #5899f5",
                      flexShrink: 0, // Prevent the avatar from shrinking
                    }}
                  >
                    {review?.userId?.name?.[0].toUpperCase()}
                  </Avatar>
                  {/* Container for name and feedback */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1, // Allow this container to take up remaining space
                      marginLeft: "8px",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        fontSize: "16px",
                        marginRight: "8px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "150px", // Set a max width to prevent long names from pushing other elements
                      }}
                    >
                      {review?.userId?.name}:
                    </Text>
                    <Text
                      style={{
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {review.feedback}
                    </Text>
                  </div>
                  {/* Rating text aligned to the right */}
                  <Text
                    style={{
                      color: "#fa8c16",
                      marginLeft: "12px",
                      whiteSpace: "nowrap",
                      flexShrink: 0, // Prevent the rating text from shrinking
                    }}
                  >
                    ({review.rating} stars)
                  </Text>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </Col>
      <Col span={8}>
        {!isLoggedIn ? (
          <Card
            bordered={false}
            style={{
              backgroundColor: "#f4f6f9",
              padding: "10px",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            <Title level={4} style={{ marginBottom: "16px", color: "#2c3e50" }}>
              Want to Leave a Review?
            </Title>
            <Button
              type="primary"
              onClick={handleLoginRedirect}
              style={{ borderRadius: "5px" }}
            >
              Login to Leave a Review
            </Button>
          </Card>
        ) : (
          <Card
            bordered={false}
            style={{
              backgroundColor: "#ffffff",
              padding: "10px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Title level={4} style={{ marginBottom: "16px", color: "#2c3e50" }}>
              Leave a Review
            </Title>
            <Input.TextArea
              rows={4}
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Write your feedback..."
              style={{ marginBottom: "12px", borderRadius: "5px" }}
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
          </Card>
        )}

        <Button
          type="default"
          onClick={handleSeeAllReviews}
          style={{
            marginTop: "24px",
            width: "100%",
            borderRadius: "5px",
            backgroundColor: "#eef2f9",
            borderColor: "#5899f5",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          See All Reviews
        </Button>
      </Col>
    </Row>
  );
};

export default ReviewSection;
