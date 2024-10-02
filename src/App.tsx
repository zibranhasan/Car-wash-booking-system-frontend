import { Layout } from "antd";
import "./App.css";
import { useAppSelector } from "./redux/hook";
import Navbar from "./components/ui/Navbar";
import Sidebar from "./components/layouts/Sidebar";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import Footer from "./components/ui/Footer";

function App() {
  const { token } = useAppSelector((state) => state.auth); // Fetch authentication token
  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar /> {/* Include the Navbar component at the top */}
      <Layout style={{ flex: 1, display: "flex" }}>
        {token && <Sidebar />}{" "}
        {/* Render Sidebar only if a token is available */}
        <Content style={{ flex: 1, margin: 0, background: "#f0f2f5" }}>
          <Outlet /> {/* Render the main content area */}
        </Content>
      </Layout>
      <Footer /> {/* Include Footer at the bottom */}
    </Layout>
  );
}

export default App;
