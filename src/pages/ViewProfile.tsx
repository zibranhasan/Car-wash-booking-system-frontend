import { useGetProfileQuery } from "../redux/api/authApi";
import "./ViewProfile.css"; // Import your styles

const ViewProfile = () => {
  const { data: userProfile, isLoading } = useGetProfileQuery(undefined);
  const profileData = userProfile?.response.user;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>
      {profileData && (
        <div className="profile-card">
          <h2 className="profile-name">{profileData.name}</h2>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Phone:</strong> {profileData.phone}
          </p>
          <p>
            <strong>Role:</strong> {profileData.role}
          </p>
          <p>
            <strong>Address:</strong> {profileData.address}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(profileData.createdAt).toDateString()}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(profileData.updatedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
