import { useGetAllServiceQuery } from "../redux/api/serviceApi";
import { Card, Row, Col, Spin } from "antd";

const FeaturedServices = () => {
  const { data: servicesData, isLoading } = useGetAllServiceQuery(undefined);
  const services = servicesData?.data.data || [];

  if (isLoading) {
    return <Spin />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]} justify="space-between">
        {services.slice(0, 6).map((service) => (
          <Col xs={24} sm={12} md={8} lg={4} key={service._id}>
            <Card
              title={service.name}
              bordered={true}
              hoverable
              style={{
                width: "100%",
                height: "250px",
                border: "1px solid #5899f5",
                boxShadow: "0 2px 4px #5899f5",
              }} // Set a fixed height
              size="small"
            >
              <p>
                <strong>Price:</strong> ${service.price}
              </p>
              <p>
                <strong>Duration:</strong> {service.duration} mins
              </p>
              <p
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  height: "38px",
                }}
              >
                <strong>Description:</strong> {service.description}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FeaturedServices;
