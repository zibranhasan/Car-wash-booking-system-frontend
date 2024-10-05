import { useState } from "react";
import { Input, Select, Row, Col, Card, Typography, Button, Rate } from "antd"; // Import Rate
import { DollarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useGetAllServiceQuery } from "../redux/api/serviceApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion

const { Title, Text } = Typography;
const { Option } = Select;

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  photo: string;
  reviews: number[]; // Assuming reviews is an array of numbers
}

const Services = () => {
  const { data: servicesData, isLoading } = useGetAllServiceQuery(undefined);

  // Ensure to type the services data correctly
  const services: Service[] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    servicesData?.data?.data.map((service: any) => ({
      ...service,
      photo: service.photo || "", // Provide a default value for photo
    })) || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("price-asc");
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleDetailsClick = (id: string) => {
    navigate(`/services/${id}`);
  };

  const filteredServices = services
    .filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortType === "price-asc") return a.price - b.price;
      if (sortType === "price-desc") return b.price - a.price;
      if (sortType === "duration-asc") return a.duration - b.duration;
      if (sortType === "duration-desc") return b.duration - a.duration;
      return 0;
    });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Car Wash Services</Title>

      {/* Search Input */}
      <Input
        placeholder="Search services..."
        onChange={handleSearch}
        style={{
          marginBottom: 16,
          borderRadius: 5,
          border: "1px solid #5899f5",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          maxWidth: "300px",
        }}
      />

      {/* Sort Select */}
      <Select
        defaultValue="price-asc"
        onChange={(value) => setSortType(value)}
        style={{
          marginBottom: 16,
          width: 200,
          borderRadius: 5,
          boxShadow: "0 2px 4px #5899f5",
        }}
      >
        <Option value="price-asc">Price: Low to High</Option>
        <Option value="price-desc">Price: High to Low</Option>
        <Option value="duration-asc">Duration: Short to Long</Option>
        <Option value="duration-desc">Duration: Long to Short</Option>
      </Select>

      {/* Service Cards */}
      <Row gutter={[16, 16]}>
        {filteredServices.map((service) => {
          // Calculate the average rating
          const totalRating = service.reviews.reduce(
            (sum, rating) => sum + rating,
            0
          );
          const avgRating = totalRating / service.reviews.length || 0;

          return (
            <Col key={service._id} xs={24} sm={12} md={8} lg={6}>
              {/* Animate each card using framer-motion */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    width: "100%",
                    height: "480px", // Adjust height to fit the rating
                    border: "1px solid #5899f5",
                    display: "flex",
                    flexDirection: "column",
                    paddingBottom: 10,
                  }}
                  cover={
                    <img
                      alt={service.name}
                      src={service.photo}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  }
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      {/* Title & Description Section */}
                      <Title
                        level={4}
                        style={{
                          textAlign: "center",
                          height: "40px",
                          opacity: "0.7", // Adjust transparency as needed (0 to 1)
                          fontSize: "inherit", // Allows font size to adjust based on content
                          lineHeight: "1.5", // Adjust line height for readability
                          overflow: "hidden", // Prevents text from overflowing the specified height
                          textOverflow: "ellipsis", // Adds ellipsis (...) for text overflow
                          whiteSpace: "nowrap", // Prevents wrapping
                        }}
                      >
                        {service.name}
                      </Title>

                      <Text
                        type="secondary"
                        style={{
                          marginBottom: "10px",
                          display: "block",
                          textAlign: "center",
                        }}
                      >
                        {service.description.slice(0, 40)}
                        {service.description.length > 40 ? "..." : ""}
                      </Text>

                      {/* Rating Section */}
                      <div style={{ textAlign: "center", marginBottom: 10 }}>
                        <Rate
                          allowHalf
                          value={avgRating} // Show average rating as stars
                          disabled
                        />
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                          ({service.reviews.length} reviews)
                        </Text>
                      </div>
                    </div>

                    {/* Price & Duration Section */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0 16px",
                      }}
                    >
                      <div>
                        <DollarOutlined
                          style={{ fontSize: 16, marginRight: 8 }}
                        />
                        <Text strong>${service.price}</Text>
                      </div>
                      <div>
                        <ClockCircleOutlined
                          style={{ fontSize: 16, marginRight: 8 }}
                        />
                        <Text>{service.duration} mins</Text>
                      </div>
                    </div>

                    {/* Details Button */}
                    <Button
                      type="primary"
                      block
                      style={{
                        marginTop: 16,
                        borderRadius: 5,
                        backgroundColor: "#4caf50",
                        border: "none",
                      }}
                      onClick={() => handleDetailsClick(service._id)}
                    >
                      Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Services;
