import { Button, Input, Typography, Card, Divider } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch } from "../redux/hook";
import { useLoginMutation } from "../redux/api/authApi";
import { verifyToken } from "../utils/verifyToken";
import { setUser } from "../redux/features/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

const { Text, Title } = Typography;

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
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data: TuserInfo) => {
    try {
      const res = await login(data).unwrap();
      const user = verifyToken(res.token);
      dispatch(setUser({ user, token: res.token }));
      navigate(from, { replace: true });
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

          <Button type="default" className="google-login-button">
            <img src="/assets/google-icon.svg" alt="Google" className="icon" />
            Continue with Google
          </Button>

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
    </div>
  );
};

export default Login;
