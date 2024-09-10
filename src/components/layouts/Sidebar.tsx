import { Layout, Menu } from "antd";
import { Key } from "antd/es/table/interface";
import { verifyToken } from "../../utils/verifyToken";
import { useAppSelector } from "../../redux/hook";
import { TUser, userCurrentToken } from "../../redux/features/authSlice";
import { sidebarItemsGenerator } from "../../utils/sideBarItemsGenerator";
import { adminPaths } from "../../routes/admin.routes";
import { userPaths } from "../../routes/user.routes";
import { MenuProps } from "antd"; // Use this for defining menu items

const { Sider } = Layout;

const userRole = {
  USER: "user",
  ADMIN: "admin",
};

interface MenuItemType {
  key: Key;
  // Other properties specific to your MenuItemType
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ItemType<T = MenuItemType> = {
  key: Key;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  disabled?: boolean;
  // Other properties specific to your ItemType
  children?: ItemType<T>[];
} & T;

const Sidebar = () => {
  const token = useAppSelector(userCurrentToken);

  let user;

  if (token) {
    user = verifyToken(token);
  }

  // console.log("user from sidebar", user);

  let sidebarItems: MenuProps["items"]; // Use the correct Ant Design type for menu items

  switch ((user as TUser)!.role) {
    case userRole.ADMIN:
      sidebarItems = sidebarItemsGenerator(
        adminPaths,
        userRole.ADMIN
      ) as MenuProps["items"]; // Update this casting
      break;
    case userRole.USER:
      sidebarItems = sidebarItemsGenerator(
        userPaths,
        userRole.USER
      ) as MenuProps["items"];
      break;
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
      ></div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["4"]}
        items={sidebarItems} // Use the correct items type
      />
    </Sider>
  );
};

export default Sidebar;
