import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar"; // Adjust the import path if necessary
import Footer from "../ui/Footer"; // Adjust the import path if necessary

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: "0",
      }}
    >
      <Navbar /> {/* Insert Navbar component here */}
      {/* Content with flex to take remaining space */}
      <Content style={{ flex: 1 }}>
        <Outlet />
      </Content>
      {/* Footer */}
      <Footer /> {/* Insert Footer component here */}
    </Layout>
  );
};

export default MainLayout;
