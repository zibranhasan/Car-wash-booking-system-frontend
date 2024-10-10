import { Button, Input, Typography, Card, Divider, Modal } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch } from "../redux/hook";
import { useLoginMutation } from "../redux/api/authApi";
import { verifyToken } from "../utils/verifyToken";
import { setUser } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

const { Text, Title } = Typography;

const Login = () => {
  const {
    control,
    handleSubmit,
    setValue, // Allows programmatically setting form values
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  type TuserInfo = {
    email: string;
    password: string;
  };

  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  // Modal visibility states
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);

  // Open modals
  const showAdminModal = () => setIsAdminModalVisible(true);
  const showUserModal = () => setIsUserModalVisible(true);

  // Close modals
  const handleAdminModalClose = () => setIsAdminModalVisible(false);
  const handleUserModalClose = () => setIsUserModalVisible(false);

  // Auto-fill credentials
  const handleAdminFill = () => {
    setValue("email", "admin@gmail.com");
    setValue("password", "123456");
    setIsAdminModalVisible(false); // Close modal after filling credentials
  };

  const handleUserFill = () => {
    setValue("email", "user1@gmail.com");
    setValue("password", "123456");
    setIsUserModalVisible(false); // Close modal after filling credentials
  };

  const onSubmit = async (data: TuserInfo) => {
    try {
      const res = await login(data).unwrap(); // Perform the login and get the token
      const user = verifyToken(res.token); // Verify and decode the token to get user info

      // Dispatch the user data and token to the store
      dispatch(setUser({ user, token: res.token }));

      // Check the role of the user (assuming the user object contains a 'role' field)
      if (user?.role === "admin") {
        navigate("/dashboard/admin/adminDashboard", { replace: true }); // Redirect to admin dashboard
      } else {
        navigate("/dashboard/user/myDashboard", { replace: true }); // Redirect to user dashboard
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <Card bordered={false} className="login-card">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <Title level={2} className="form-title">
            Welcome Back!
          </Title>
          <Text className="sub-title">Log in to access your account</Text>
          <Divider />

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address:
            </label>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="example@mail.com"
                  className="input-field"
                />
              )}
            />
            {errors.email && (
              <Text type="danger" className="error-message">
                {errors.email?.message}
              </Text>
            )}
            {/* Buttons for Admin and User credentials */}
            <div className="credentials-buttons">
              <Button type="link" onClick={showAdminModal}>
                Admin credentials
              </Button>
              <Button type="link" onClick={showUserModal}>
                User credentials
              </Button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="••••••••"
                  className="input-field"
                />
              )}
            />
            {errors.password && (
              <Text type="danger" className="error-message">
                {errors.password?.message}
              </Text>
            )}
          </div>

          {error && (
            <Text type="danger" className="error-message">
              Login failed. Please try again.
            </Text>
          )}

          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="login-button"
          >
            Log In
          </Button>

          <Divider>OR</Divider>

          <div className="register-redirect">
            <Text className="register-label">Don't have an account?</Text>
            <Button
              type="link"
              className="register-button"
              onClick={handleRegisterRedirect}
            >
              Register
            </Button>
          </div>
        </form>
      </Card>

      {/* Admin Credentials Modal */}
      <Modal
        title="Admin Credentials"
        visible={isAdminModalVisible}
        onOk={handleAdminFill}
        onCancel={handleAdminModalClose}
        okText="Fill Credentials"
      >
        <p>Email: admin@gmail.com</p>
        <p>Password: 123456</p>
      </Modal>

      {/* User Credentials Modal */}
      <Modal
        title="User Credentials"
        visible={isUserModalVisible}
        onOk={handleUserFill}
        onCancel={handleUserModalClose}
        okText="Fill Credentials"
      >
        <p>Email: user1@gmail.com</p>
        <p>Password: 123456</p>
      </Modal>
    </div>
  );
};

export default Login;
