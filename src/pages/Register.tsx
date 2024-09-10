import { Button, Input, Typography } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux/api/authApi";
import "./Register.css"; // Import custom CSS file

const { Text } = Typography;

// Define the form shape
type TuserInfo = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

const Register = () => {
  // Pass the TuserInfo type to useForm to type check the form fields
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TuserInfo>();

  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: TuserInfo) => {
    try {
      const response = await register(data).unwrap();
      if (response.success) {
        console.log("Registration successful", response);
        navigate("/login");
      }
    } catch (error) {
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
