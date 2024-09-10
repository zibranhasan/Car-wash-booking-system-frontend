import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar"; // Adjust the import path if necessary
import Footer from "../ui/Footer"; // Adjust the import path if necessary

const { Header, Content } = Layout;

const MainLayout = () => {
  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <Header style={{ padding: 0 }}>
        <Navbar /> {/* Insert Navbar component here */}
      </Header>
      {/* Content with flex to take remaining space */}
      <Content style={{ flex: 1, margin: 8 }}>
        <div>
          <Outlet />
        </div>
      </Content>
      {/* Footer */}
      <Footer /> {/* Insert Footer component here */}
    </Layout>
  );
};

export default MainLayout;
