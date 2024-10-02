import { useGetProfileQuery } from "../redux/api/authApi";
import { Card, Avatar, Typography, Spin } from "antd"; // Ant Design Components
import "./ViewProfile.css";

const { Title, Text } = Typography; // Destructuring Typography components

const ViewProfile = () => {
  const { data: userProfile, isLoading } = useGetProfileQuery(undefined);
  const profileData = userProfile?.response.user;

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Title className="profile-title">User Profile</Title>
      {profileData && (
        <Card
          className="profile-card"
          bordered
          style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}
        >
          {/* Render the user's profile photo */}
          {profileData.photo && (
            <Avatar
              src={profileData.photo}
              size={120}
              className="profile-avatar"
              alt={`${profileData.name}'s Profile`}
            />
          )}

          {/* Display user details */}
          <Title level={2} className="profile-name">
            {profileData.name}
          </Title>
          <Text className="profile-text">
            <strong>Email:</strong> {profileData.email}
          </Text>
          <br />
          <Text className="profile-text">
            <strong>Phone:</strong> {profileData.phone}
          </Text>
          <br />
          <Text className="profile-text">
            <strong>Role:</strong> {profileData.role}
          </Text>
          <br />
          <Text className="profile-text">
            <strong>Address:</strong> {profileData.address}
          </Text>
          <br />
          <Text className="profile-text">
            <strong>Joined:</strong>{" "}
            {new Date(profileData.createdAt).toDateString()}
          </Text>
          <br />
          <Text className="profile-text">
            <strong>Last Updated:</strong>{" "}
            {new Date(profileData.updatedAt).toLocaleString()}
          </Text>
        </Card>
      )}
    </div>
  );
};

export default ViewProfile;
