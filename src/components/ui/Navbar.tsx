// import React, { useState, useEffect } from "react";
// import { Menu, Layout, Row, Col, Typography, Button, Drawer } from "antd";
// import { Link } from "react-router-dom";
// import {
//   HomeOutlined,
//   AppstoreOutlined,
//   LoginOutlined,
//   UserAddOutlined,
//   LogoutOutlined,
//   MenuOutlined,
// } from "@ant-design/icons";
// import Countdown from "react-countdown";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState, AppDispatch } from "../../redux/store";
// import { handleLogout } from "../../redux/features/authSlice";
// import { useGetBookingsByUserQuery } from "../../redux/api/bookingApi";
// import {
//   setNextSlotTime,
//   clearNextSlotTime,
// } from "../../redux/features/countdownSlice";

// const { Header } = Layout;
// const { Title } = Typography;

// const Navbar = () => {
//   const [drawerVisible, setDrawerVisible] = useState(false);

//   const nextSlotTime = useSelector(
//     (state: RootState) => state.countdown.nextSlotTime
//   );
//   const currentUser = useSelector((state: RootState) => state.auth.user);
//   const dispatch: AppDispatch = useDispatch();

//   const { data: bookings, refetch } = useGetBookingsByUserQuery(undefined, {
//     skip: !currentUser,
//   });

//   const userBookings = bookings?.response?.data || [];

//   useEffect(() => {
//     const updateNextSlotTime = (userBookings) => {
//       const now = new Date().getTime();
//       const upcomingBookings = userBookings.filter(
//         (booking) =>
//           booking &&
//           booking.slot &&
//           booking.slot.date &&
//           booking.slot.startTime &&
//           new Date(
//             `${booking.slot.date}T${booking.slot.startTime}`
//           ).getTime() >= now
//       );

//       if (upcomingBookings.length > 0) {
//         const nextSlot = upcomingBookings[0];
//         const nextSlotTime = new Date(
//           `${nextSlot.slot.date}T${nextSlot.slot.startTime}`
//         ).getTime();
//         dispatch(setNextSlotTime(nextSlotTime));
//       } else {
//         dispatch(clearNextSlotTime());
//       }
//     };

//     if (userBookings.length > 0) {
//       updateNextSlotTime(userBookings);
//     }
//   }, [userBookings, dispatch]);

//   useEffect(() => {
//     if (currentUser) {
//       refetch();
//     }
//   }, [currentUser, refetch]);

//   const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
//     if (completed) {
//       return <span>No upcoming slots</span>;
//     } else {
//       return (
//         <div className="countdown-timer" style={{ color: "#e6e6e6" }}>
//           {days > 0 && <span>{days}d </span>}
//           {hours > 0 && <span>{hours}h </span>}
//           {minutes > 0 && <span>{minutes}m </span>}
//           <span>{seconds}s</span>
//         </div>
//       );
//     }
//   };

//   const isValidTime =
//     typeof nextSlotTime === "number" && nextSlotTime > Date.now();

//   const items = [
//     { key: "1", icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
//     {
//       key: "2",
//       icon: <AppstoreOutlined />,
//       label: <Link to="/services">Services</Link>,
//     },
//     !currentUser && {
//       key: "3",
//       icon: <LoginOutlined />,
//       label: <Link to="/login">Login</Link>,
//     },
//     !currentUser && {
//       key: "4",
//       icon: <UserAddOutlined />,
//       label: <Link to="/register">Register</Link>,
//     },
//     currentUser && {
//       key: "5",
//       icon: <LogoutOutlined />,
//       label: (
//         <span
//           onClick={() => dispatch(handleLogout())}
//           style={{ cursor: "pointer" }}
//         >
//           Logout
//         </span>
//       ),
//     },
//   ].filter(Boolean);

//   return (
//     <Header style={{ backgroundColor: "#001529", padding: "0 20px" }}>
//       <Row justify="space-between" align="middle" style={{ width: "100%" }}>
//         {/* Logo on the left */}
//         <Col>
//           <Title
//             level={3}
//             style={{ color: "white", margin: 0, fontSize: "20px" }}
//           >
//             <Link to="/" style={{ color: "white" }}>
//               CarWashBooker
//             </Link>
//           </Title>
//         </Col>

//         {/* Desktop Menu */}
//         <Col xs={0} sm={0} md={16} lg={26}>
//           <Menu
//             theme="dark"
//             mode="horizontal"
//             items={items}
//             style={{ lineHeight: "64px", borderBottom: "none" }}
//           />
//         </Col>

//         {/* Mobile Menu Icon */}
//         <Col xs={24} sm={24} md={0} lg={0} style={{ textAlign: "right" }}>
//           <Button
//             type="primary"
//             icon={<MenuOutlined />}
//             onClick={() => setDrawerVisible(true)}
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Mobile Drawer Menu */}
//         <Drawer
//           title="Menu"
//           placement="right"
//           closable={true}
//           onClose={() => setDrawerVisible(false)}
//           visible={drawerVisible}
//         >
//           <Menu theme="light" mode="vertical" items={items} />
//         </Drawer>

//         {/* Countdown Timer */}
//         {currentUser && (
//           <Col
//             xs={0}
//             sm={0}
//             md={8}
//             lg={8}
//             style={{ textAlign: "right", marginTop: "8px" }}
//           >
//             <div
//               style={{
//                 color: "white",
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 alignItems: "center",
//                 fontSize: "14px",
//               }}
//             >
//               <span style={{ marginRight: "10px" }}>Next Slot:</span>
//               {isValidTime ? (
//                 <Countdown
//                   date={nextSlotTime}
//                   renderer={countdownRenderer}
//                   zeroPadTime={2}
//                 />
//               ) : (
//                 <span>No upcoming slots</span>
//               )}
//             </div>
//           </Col>
//         )}
//       </Row>
//     </Header>
//   );
// };

// export default Navbar;
