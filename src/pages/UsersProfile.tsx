import { Table, Switch, message } from "antd";
import {
  useGetAllUserQuery,
  useUpdateRoleMutation,
} from "../redux/api/authApi";

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
      render: (role: User["role"]) => <span>{role}</span>,
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
        <div>
          <Switch
            checked={record.role === "admin"}
            checkedChildren="Admin"
            unCheckedChildren="User"
            onChange={() => handleRoleToggle(record)}
            loading={isUpdating}
          />
        </div>
      ),
    },
  ];

  // Return loading state if data is being fetched
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>User Profiles</h1>
      <Table
        columns={columns}
        dataSource={UserProfile}
        rowKey={(record) => record._id}
      />
    </div>
  );
};

export default UsersProfile;
