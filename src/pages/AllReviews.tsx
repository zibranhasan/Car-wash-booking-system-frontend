import { useGetAllReviewQuery } from "../redux/api/reviewApi";
import { Card, Row, Col } from "antd";
import moment from "moment";
export interface IReview {
  _id: string;
  userId?: { name: string; email: string };
  feedback: string;
  rating: number;
  createdAt?: Date;
}
const AllReviews = () => {
  const { data: AllReviews } = useGetAllReviewQuery(undefined);
  const allReviewData = AllReviews?.response.data || [];

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {allReviewData.map((review: IReview) => (
          <Col xs={24} sm={12} md={8} key={review._id}>
            <Card
              title={review?.userId?.name}
              bordered={true}
              style={{
                width: "100%",
                height: "250px", // Fixed height
                overflow: "hidden", // Hide overflow
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between", // Space out content
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <p>
                  <strong>Email:</strong> {review?.userId?.email}
                </p>
                <p>
                  <strong>Feedback:</strong> {review.feedback}
                </p>
                <p>
                  <strong>Rating:</strong> {review.rating} / 5
                </p>
              </div>
              <p>
                <strong>Reviewed on:</strong>{" "}
                {moment(review.createdAt).format("MMMM Do, YYYY")}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AllReviews;
