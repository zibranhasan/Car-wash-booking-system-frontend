import { useGetProfileQuery } from "../redux/api/authApi";
import {
  Card,
  Typography,
  Row,
  Col,
  Avatar,
  Spin,
  Divider,
  Tag,
  Button,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./ViewProfile.css";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const ViewProfile = () => {
  const { data: userProfile, isLoading } = useGetProfileQuery(undefined);
  const profileData = userProfile?.response?.user;

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Title className="profile-title">My Profile</Title>
      {profileData && (
        <Card
          className="profile-card"
          bordered
          style={{
            maxWidth: 800,
            margin: "20px auto",
            borderRadius: "15px",
            padding: "20px",
            background: "linear-gradient(135deg, #f9f9f9, #ffffff)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Profile Header with Avatar and Info */}
          <Row
            justify="center"
            align="middle"
            gutter={[16, 16]}
            className="profile-header-row"
          >
            <Col xs={24} md={6} className="profile-avatar-col">
              <Avatar
                src={profileData.photo}
                size={150}
                className="profile-avatar"
                alt={`${profileData.name}'s Profile`}
                style={{
                  border: "3px solid #1890ff",
                  boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)",
                }}
              />
            </Col>
            <Col xs={24} md={12} className="profile-info-col">
              <Title level={2} className="profile-name">
                {profileData.name}
              </Title>
              <Tag color="blue" style={{ fontSize: "14px" }}>
                {profileData.role.toUpperCase()}
              </Tag>
              <br />
              <Text type="secondary" style={{ fontSize: "16px" }}>
                Account verified
              </Text>
            </Col>
            <Col xs={24} md={6} style={{ textAlign: "center" }}>
              <Link to="/dashboard/user/update-profile">
                <Button
                  type="primary"
                  shape="round"
                  icon={<EditOutlined />}
                  size="large"
                  className="edit-profile-button"
                >
                  Edit Profile
                </Button>
              </Link>
            </Col>
          </Row>
          <Divider />

          {/* Personal Details Section */}
          <Title level={4} style={{ color: "#1d3557", textAlign: "left" }}>
            Personal Details
          </Title>
          <Row gutter={[16, 16]} className="profile-details-row">
            <Col xs={24} sm={12}>
              <Text className="profile-text">
                <strong>Phone Number: </strong>
                <PhoneOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                {profileData.phone}
              </Text>
              <br />
              <Text className="profile-text">
                <strong>Email: </strong>
                <MailOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                {profileData.email}
              </Text>
              <br />
              <Text className="profile-text">
                <strong>Date Joined: </strong>
                <CalendarOutlined
                  style={{ color: "#1890ff", marginRight: 8 }}
                />
                {new Date(profileData.createdAt).toDateString()}
              </Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text className="profile-text">
                <strong>Address: </strong>
                <HomeOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                {profileData.address}
              </Text>
              <br />
              <Text className="profile-text">
                <strong>Last Updated: </strong>
                <CalendarOutlined
                  style={{ color: "#1890ff", marginRight: 8 }}
                />
                {new Date(profileData.updatedAt).toLocaleString()}
              </Text>
            </Col>
          </Row>
          <Divider />
        </Card>
      )}
    </div>
  );
};

export default ViewProfile;
