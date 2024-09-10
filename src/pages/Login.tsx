import { Button, Input, Typography } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch } from "../redux/hook";
import { useLoginMutation } from "../redux/api/authApi";
import { verifyToken } from "../utils/verifyToken";
import { setUser } from "../redux/features/authSlice";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import "./Login.css"; // Import custom CSS file

const { Text } = Typography;

const Login = () => {
  const {
    control,
    handleSubmit,
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
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Capture location state
  const from = location.state?.from?.pathname || "/"; // Default to homepage if no location is passed

  const onSubmit = async (data: TuserInfo) => {
    try {
      const userInfo = {
        email: data.email,
        password: data.password,
      };

      // Make login request
      const res = await login(userInfo).unwrap();

      // Verify the token from the response
      const user = verifyToken(res.token);

      // Dispatch the user and token to the Redux store
      dispatch(setUser({ user: user, token: res.token }));

      // Redirect to the previous route or homepage
      navigate(from, { replace: true }); // Redirect to the previous route after login
    } catch (err) {
      // Handle login error
      console.error("Login failed:", err);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register"); // Redirect to the registration page
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <Controller
            name="email"
            control={control}
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
          Login
        </Button>

        <div className="register-redirect">
          <Text className="register-label">Are you new?</Text>
          <Button
            type="default"
            className="register-button"
            onClick={handleRegisterRedirect}
          >
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
