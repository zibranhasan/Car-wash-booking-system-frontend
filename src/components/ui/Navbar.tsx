import { Menu, Layout, Row, Col, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Countdown from "react-countdown";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { handleLogout } from "../../redux/features/authSlice";
import { useGetBookingsByUserQuery } from "../../redux/api/bookingApi";
import { useEffect } from "react";
import {
  setNextSlotTime,
  clearNextSlotTime,
} from "../../redux/features/countdownSlice";

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const nextSlotTime = useSelector(
    (state: RootState) => state.countdown.nextSlotTime
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch: AppDispatch = useDispatch();

  const { data: bookings, refetch } = useGetBookingsByUserQuery(undefined, {
    skip: !currentUser, // Skip query until the user is logged in
  });

  const userBookings = bookings?.response?.data || [];

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateNextSlotTime = (userBookings: any) => {
      const now = new Date().getTime();
      const upcomingBookings = userBookings.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (booking: any) =>
          booking &&
          booking.slot &&
          booking.slot.date &&
          booking.slot.startTime &&
          new Date(
            `${booking.slot.date}T${booking.slot.startTime}`
          ).getTime() >= now
      );

      if (upcomingBookings.length > 0) {
        const nextSlot = upcomingBookings[0];
        const nextSlotTime = new Date(
          `${nextSlot.slot.date}T${nextSlot.slot.startTime}`
        ).getTime();
        dispatch(setNextSlotTime(nextSlotTime));
      } else {
        dispatch(clearNextSlotTime());
      }
    };

    if (userBookings.length > 0) {
      updateNextSlotTime(userBookings);
    }
  }, [userBookings, dispatch]);

  useEffect(() => {
    if (currentUser) {
      refetch(); // Refetch bookings immediately after login
    }
  }, [currentUser, refetch]);

  const countdownRenderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any) => {
    if (completed) {
      return <span>No upcoming slots</span>;
    } else {
      return (
        <div className="countdown-timer" style={{ color: "#e6e6e6" }}>
          {days > 0 && <span>{days}d </span>}
          {hours > 0 && <span>{hours}h </span>}
          {minutes > 0 && <span>{minutes}m </span>}
          <span>{seconds}s</span>
        </div>
      );
    }
  };

  const isValidTime =
    typeof nextSlotTime === "number" && nextSlotTime > Date?.now();

  const items = [
    { key: "1", icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
    {
      key: "2",
      icon: <AppstoreOutlined />,
      label: <Link to="/services">Services</Link>,
    },
    !currentUser && {
      key: "3",
      icon: <LoginOutlined />,
      label: <Link to="/login">Login</Link>,
    },
    !currentUser && {
      key: "4",
      icon: <UserAddOutlined />,
      label: <Link to="/register">Register</Link>,
    },
    currentUser && {
      key: "5",
      icon: <LogoutOutlined />,
      label: (
        <span
          onClick={() => dispatch(handleLogout())}
          style={{ cursor: "pointer" }}
        >
          Logout
        </span>
      ),
    },
  ].filter(Boolean) as Array<{
    key: string;
    icon: JSX.Element;
    label: JSX.Element;
  }>;

  return (
    <Header style={{ backgroundColor: "#001529", marginTop: 0 }}>
      <Row align="middle" justify="space-between">
        <Col>
          <Title
            level={3}
            style={{ color: "white", margin: 0, fontSize: "20px" }}
          >
            <Link to="/" style={{ color: "white" }}>
              CarWashBooker
            </Link>
          </Title>
        </Col>
        <Col>
          <Menu
            theme="dark"
            mode="horizontal"
            items={items}
            style={{ lineHeight: "64px" }}
          />
        </Col>
        {currentUser && (
          <Col>
            <div
              style={{
                color: "white",
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
              }}
            >
              <span style={{ marginRight: "10px" }}>Next Slot:</span>
              {isValidTime ? (
                <Countdown
                  date={nextSlotTime}
                  renderer={countdownRenderer}
                  zeroPadTime={2}
                />
              ) : (
                <span>No upcoming slots</span>
              )}
            </div>
          </Col>
        )}
      </Row>
    </Header>
  );
};

export default Navbar;
