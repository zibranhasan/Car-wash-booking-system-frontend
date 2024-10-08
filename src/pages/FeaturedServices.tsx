import { useGetAllServiceQuery } from "../redux/api/serviceApi";
import { Card, Row, Col, Spin, Button, Rate } from "antd";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DollarOutlined, ClockCircleOutlined } from "@ant-design/icons";

const FeaturedServices = () => {
  const { data: servicesData, isLoading } = useGetAllServiceQuery(undefined);
  const services = servicesData?.data?.data || []; // Ensure services is an array
  console.log(services);

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px 0" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Function to calculate average rating from the reviews array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculateAverageRating = (reviews: number[]) => {
    if (!reviews || reviews.length === 0) return 0; // Return 0 if no reviews
    const total = reviews.reduce((acc, rating) => acc + rating, 0); // Summing the ratings
    return total / reviews.length; // Return average
  };

  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)" },
  };

  return (
    <div style={{ padding: "25px" }}>
      <Row gutter={[32, 32]} justify="center">
        {services.slice(0, 8).map((service) => (
          <Col xs={24} sm={12} md={8} lg={6} key={service._id}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ duration: 0.3 }}
            >
              <Card
                hoverable
                cover={
                  <motion.img
                    src={service.photo}
                    alt={service.name}
                    style={{
                      height: "180px",
                      objectFit: "cover",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      filter: "brightness(0.95)",
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                }
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  height: "360px", // Reduce height to remove extra space
                  border: "1px solid #001529",
                  position: "relative",
                  transition: "all 0.3s ease-in-out",
                }}
                bodyStyle={{ padding: "12px 16px" }} // Reduce padding inside the card body
              >
                <h3
                  style={{
                    color: "#3b5998",
                    fontSize: "18px", // Reduce font size slightly
                    fontWeight: "600",
                    marginBottom: "8px", // Reduce margin between the title and the rating
                  }}
                >
                  {service.name}
                </h3>

                {/* Average rating display */}
                <Rate
                  disabled
                  value={calculateAverageRating(service?.reviews)} // Call the function with reviews
                  style={{ fontSize: "14px", marginBottom: "4px" }} // Adjust size and margin
                />

                {/* Price and Duration with icons */}
                <p
                  style={{
                    color: "#555",
                    fontSize: "14px", // Adjust font size
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px", // Reduce bottom margin to decrease gap
                  }}
                >
                  <span>
                    <DollarOutlined
                      style={{ marginRight: "5px", color: "#1890ff" }}
                    />
                    <strong>${service.price}</strong>
                  </span>
                  <span>
                    <ClockCircleOutlined
                      style={{ marginRight: "5px", color: "#1890ff" }}
                    />
                    <strong>{service.duration} mins</strong>
                  </span>
                </p>

                {/* "See All" button */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "15px",
                    left: "15px",
                    right: "15px",
                    textAlign: "center",
                  }}
                >
                  <Link to={`/services/${service._id}`}>
                    <Button
                      style={{
                        backgroundColor: "#001529",
                        borderColor: "#001529",
                        color: "#fff",
                      }}
                    >
                      Book This Service
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* "All Services" button below the card container */}
      <div style={{ textAlign: "center", paddingTop: "20px" }}>
        <Link to="/services">
          <Button
            style={{
              backgroundColor: "#001529",
              borderColor: "#001529",
              color: "#fff",
            }}
          >
            All Services
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedServices;
