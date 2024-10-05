import { Table, Switch, message, Typography, Space } from "antd";
import {
  useGetAllUserQuery,
  useUpdateRoleMutation,
} from "../redux/api/authApi";

const { Title } = Typography;

// Define the type for user data
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user"; // Role can only be 'admin' or 'user'
  address: string;
}

const UsersProfile = () => {
  // Fetch all users
  const { data: users, isLoading } = useGetAllUserQuery(undefined);
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  // Extract user data from the response
  const UserProfile: User[] = users?.response?.data || [];

  // Handle role update
  const handleRoleToggle = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await updateRole({ id: user._id, role: newRole }).unwrap();
      message.success(`Role updated to ${newRole} for ${user.name}`);
    } catch (error) {
      message.error("Failed to update role");
    }
  };

  // Table columns definition
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: User["role"]) => (
        <span
          style={{
            padding: "2px 8px",
            borderRadius: "4px",
            backgroundColor: role === "admin" ? "#f0f5ff" : "#fff7e6",
            color: role === "admin" ? "#096dd9" : "#d46b08",
          }}
        >
          {role}
        </span>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      key: "actions",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_text: any, record: User) => (
        <Space size="middle">
          <Switch
            checked={record.role === "admin"}
            checkedChildren="Admin"
            unCheckedChildren="User"
            onChange={() => handleRoleToggle(record)}
            loading={isUpdating}
            style={{
              backgroundColor: record.role === "admin" ? "#52c41a" : "#d9d9d9",
            }}
          />
        </Space>
      ),
    },
  ];

  // Return loading state if data is being fetched
  if (isLoading) {
    return <p style={{ textAlign: "center", fontSize: "18px" }}>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <Title level={2} style={{ color: "#1890ff" }}>
          User Profiles
        </Title>
        <p style={{ fontSize: "16px", color: "#595959" }}>
          Manage and view details of all registered users.
        </p>
      </div>

      {/* Table Section */}
      <Table
        columns={columns}
        dataSource={UserProfile}
        rowKey={(record) => record._id}
        bordered
        pagination={{ pageSize: 5 }}
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          borderRadius: "10px",
        }}
        rowClassName={(_record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
      />
    </div>
  );
};

export default UsersProfile;
