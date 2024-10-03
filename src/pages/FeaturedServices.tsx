import { useGetAllServiceQuery } from "../redux/api/serviceApi";
import { Card, Row, Col, Spin, Button } from "antd";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DollarOutlined, ClockCircleOutlined } from "@ant-design/icons";

const FeaturedServices = () => {
  const { data: servicesData, isLoading } = useGetAllServiceQuery(undefined);
  const services = servicesData?.data.data || [];

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px 0" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)" },
  };

  return (
    <div style={{ padding: "25px", backgroundColor: "#f4f7f9" }}>
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
                      height: "160px",
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
                  height: "400px", // Uniform card height
                  backgroundColor: "#fff",
                  border: "1px solid #e6e6e6",
                  position: "relative",
                  transition: "all 0.3s ease-in-out",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <h3
                  style={{
                    color: "#3b5998",
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "12px",
                  }}
                >
                  {service.name}
                </h3>
                {/* Price and Duration with icons */}
                <p
                  style={{
                    margin: "12px 0",
                    color: "#555",
                    fontSize: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    <DollarOutlined
                      style={{ marginRight: "5px", color: "#1890ff" }}
                    />
                    <strong></strong> ${service.price}
                  </span>
                  <span>
                    <ClockCircleOutlined
                      style={{ marginRight: "5px", color: "#1890ff" }}
                    />
                    <strong></strong> {service.duration} mins
                  </span>
                </p>
                {/* Description truncated to a single line */}
                <p
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    color: "#777",
                    fontSize: "14px",
                    marginBottom: "16px",
                  }}
                >
                  {service.description}
                </p>
                {/* "See All" button */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "20px",
                    right: "20px",
                    textAlign: "center",
                  }}
                >
                  <Link to={`/services/${service._id}`}>
                    <Button type="primary">Book This Service</Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* "All Services" button below the card container */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <Link to="/services">
          <Button type="primary" size="large">
            All Services
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedServices;
