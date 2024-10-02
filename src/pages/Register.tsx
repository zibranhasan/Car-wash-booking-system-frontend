import React, { useState, ChangeEvent } from "react";
import { Button, Input, Typography } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux/api/authApi";
import axios from "axios";
import "./Register.css"; // Import custom CSS file

const { Text } = Typography;

// Define the form shape
type TuserInfo = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  photo?: string; // Add the photo field to the form shape
};

const Register: React.FC = () => {
  // Pass the TuserInfo type to useForm to type-check the form fields
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TuserInfo>();

  const [register] = useRegisterMutation();
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null); // Add a preview state

  // Handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setPreview(URL.createObjectURL(selectedImage)); // Set preview to the selected image URL
    }
  };

  // Handle form submission
  const onSubmit = async (data: TuserInfo) => {
    let imageUrl = "";
    try {
      // If an image is selected, upload it first
      if (image) {
        setImageLoading(true);
        const formData = new FormData();
        formData.append("image", image);

        const response = await axios.post(
          "https://api.imgbb.com/1/upload?key=963ca9297bc7cea248773301a33b8428",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = response.data.data.display_url;
        setImageLoading(false);
      }

      // Include the image URL in the user data
      const userData = { ...data, photo: imageUrl };

      // Send registration data to the backend
      const response = await register(userData).unwrap();
      if (response.success) {
        console.log("Registration successful", response);
        navigate("/login");
      }
    } catch (error) {
      setImageLoading(false);
      console.error("Registration failed", error);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: "Name is required" }}
            render={({ field }) => <Input {...field} className="input-field" />}
          />
          {errors.name && (
            <Text type="danger" className="error-message">
              {errors.name?.message}
            </Text>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <Input {...field} type="email" className="input-field" />
            )}
          />
          {errors.email && (
            <Text type="danger" className="error-message">
              {errors.email?.message}
            </Text>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <Input {...field} type="password" className="input-field" />
            )}
          />
          {errors.password && (
            <Text type="danger" className="error-message">
              {errors.password?.message}
            </Text>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone:
          </label>
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            rules={{ required: "Phone number is required" }}
            render={({ field }) => <Input {...field} className="input-field" />}
          />
          {errors.phone && (
            <Text type="danger" className="error-message">
              {errors.phone?.message}
            </Text>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="address" className="form-label">
            Address:
          </label>
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: "Address is required" }}
            render={({ field }) => <Input {...field} className="input-field" />}
          />
          {errors.address && (
            <Text type="danger" className="error-message">
              {errors.address?.message}
            </Text>
          )}
        </div>

        {/* Image Upload Section with Preview */}
        <div className="form-group">
          <label htmlFor="photo" className="form-label">
            Photo:
          </label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <div className="image-preview">
              <img
                src={preview}
                alt="Selected Profile Preview"
                className="preview-image"
              />
            </div>
          )}
          {imageLoading && <Text type="warning">Uploading image...</Text>}
        </div>

        <Button type="primary" htmlType="submit" className="register-button">
          Register
        </Button>

        <div className="login-redirect">
          <Text className="login-label">Already have an account?</Text>
          <Button
            type="default"
            onClick={handleLoginRedirect}
            className="login-button"
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
