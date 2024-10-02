import { useState, useEffect, ChangeEvent } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../redux/api/authApi";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios for image upload
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const { data: userProfile, isLoading } = useGetProfileQuery(undefined);
  const [updateProfile] = useUpdateProfileMutation();
  const profileData = userProfile?.response.user;
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Initialize formData with profile data once it is loaded
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: "", // Photo URL field
  });

  const [image, setImage] = useState<File | null>(null); // For storing the selected image file
  const [preview, setPreview] = useState<string | undefined>(undefined); // Image preview URL
  const [imageLoading, setImageLoading] = useState(false); // Loading state for image upload

  // Load profile data into formData when it is available
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        photo: profileData.photo || "", // Existing profile photo URL
      });
      setPreview(profileData.photo); // Set initial preview to current profile picture
    }
  }, [profileData]);

  // Handle text field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image file selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0])); // Set preview to the selected image
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = formData.photo; // Use the existing image URL if no new image is selected

    // If a new image is selected, upload it to imgBB
    if (image) {
      setImageLoading(true); // Start loading
      const formData = new FormData();
      formData.append("image", image);

      try {
        const response = await axios.post(
          "https://api.imgbb.com/1/upload?key=963ca9297bc7cea248773301a33b8428",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = response.data.data.display_url; // Get the uploaded image URL
        setImageLoading(false); // Stop loading
      } catch (error) {
        console.error("Image upload failed:", error);
        setImageLoading(false);
        alert("Image upload failed. Please try again.");
        return;
      }
    }

    // Update the profile data with the new or existing image URL
    try {
      await updateProfile({ ...formData, photo: imageUrl }).unwrap();
      alert("Profile updated successfully!");
      navigate("/dashboard/user/view-profile"); // Redirect to the profile view
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="update-profile-container">
      <h1 className="update-profile-title">Update Profile</h1>
      <form className="update-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* File input for updating profile picture */}
        <div className="form-group">
          <label htmlFor="photo">Profile Photo:</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Display the current or selected profile picture */}
        {preview && (
          <div className="image-preview">
            <img
              src={preview}
              alt="Profile Preview"
              className="profile-image"
            />
          </div>
        )}

        <button type="submit" className="update-button" disabled={imageLoading}>
          {imageLoading ? "Uploading..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
