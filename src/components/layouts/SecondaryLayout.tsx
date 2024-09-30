import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import Sidebar from "./Sidebar";
import { useAppSelector } from "../../redux/hook";

const { Content } = Layout;

const SecondaryLayout = () => {
  const { token } = useAppSelector((state) => state.auth);

  return (
    <Layout style={{ margin: "0" }}>
      {" "}
      {/* Ensure no margin or padding */}
      <Navbar /> {/* Navbar component */}
      {/* Main Layout */}
      <Layout style={{ flex: 1, display: "flex" }}>
        {/* Sidebar - Render only if token exists */}
        {token && <Sidebar />}

        {/* Content Section */}
        <Content style={{ flex: 1, margin: 0 }}>
          <Outlet /> {/* Main Content Area */}
        </Content>
      </Layout>
      {/* Footer */}
      <Footer /> {/* Footer component */}
    </Layout>
  );
};

export default SecondaryLayout;
