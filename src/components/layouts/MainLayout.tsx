import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar"; // Adjust the import path if necessary
import Footer from "../ui/Footer"; // Adjust the import path if necessary

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh", // Full height for the layout
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar stays at the top */}
      <Navbar />

      {/* Content with flex-grow to take up remaining space */}
      <Content style={{ flex: 1 }}>
        <Outlet />
      </Content>

      {/* Footer always at the bottom */}
      <Footer />
    </Layout>
  );
};

export default MainLayout;
