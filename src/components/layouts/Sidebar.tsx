import { Layout, Menu } from "antd";

import { verifyToken } from "../../utils/verifyToken";
import { useAppSelector } from "../../redux/hook";
import { TUser, userCurrentToken } from "../../redux/features/authSlice";
import { sidebarItemsGenerator } from "../../utils/sideBarItemsGenerator";
import { adminPaths } from "../../routes/admin.routes";
import { userPaths } from "../../routes/user.routes";
import { MenuProps } from "antd"; // For defining menu items

const { Sider } = Layout;

const userRole = {
  USER: "user",
  ADMIN: "admin",
};

const Sidebar = () => {
  const token = useAppSelector(userCurrentToken);

  let user;

  if (token) {
    user = verifyToken(token);
  }

  // Determine sidebar items based on user role
  let sidebarItems: MenuProps["items"];

  switch ((user as TUser)?.role) {
    case userRole.ADMIN:
      sidebarItems = sidebarItemsGenerator(
        adminPaths,
        userRole.ADMIN
      ) as MenuProps["items"];
      break;
    case userRole.USER:
      sidebarItems = sidebarItemsGenerator(
        userPaths,
        userRole.USER
      ) as MenuProps["items"];
      break;
    default:
      sidebarItems = []; // Default to an empty array if no role is matched
  }

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{ height: "100vh", position: "sticky", top: "0", left: "0" }}
    >
      <div
        style={{
          color: "white",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* You can add a logo or title here */}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["4"]}
        items={sidebarItems}
      />
    </Sider>
  );
};

export default Sidebar;
