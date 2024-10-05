import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useGetBookingsByUserQuery } from "../redux/api/bookingApi";
import { useGetAllTransactionQuery } from "../redux/api/transactionApi";
import { Card, Col, Row, Typography, Divider, Avatar, Table } from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Chart } from "react-charts";
import "./MyDashboard.css";

const { Title, Text } = Typography;

// Define types for bookings and transactions
interface Booking {
  service: {
    name: string;
  };
  slot: {
    startTime: string;
    endTime: string;
  };
  slotId?: string;
}

interface Transaction {
  email: string;
  tran_id: string;
  amount: number;
  slotId?: {
    _id: string;
  };
}

// Utility to count and sum data
const aggregateData = <T,>(data: T[], valueAccessor: (item: T) => number) => {
  return data.map((item, index) => ({
    index, // Use index for X-axis
    value: valueAccessor(item),
  }));
};

// Combined Chart Component for visualizing multiple metrics
const CombinedChart: React.FC<{
  userBookings: Booking[];
  userTransactions: Transaction[];
}> = ({ userBookings, userTransactions }) => {
  const servicesData = useMemo(
    () => aggregateData(userBookings, () => 1),
    [userBookings]
  );

  const transactionsData = useMemo(
    () => aggregateData(userTransactions, (transaction) => transaction.amount),
    [userTransactions]
  );

  const chartData = useMemo(
    () => [
      {
        label: "Number of Services",
        data: servicesData,
      },
      {
        label: "Transaction Amount ($)",
        data: transactionsData,
      },
    ],
    [servicesData, transactionsData]
  );

  const primaryAxis = useMemo(
    () => ({
      getValue: (datum: { index: number; value: number }) => datum.index,
      scaleType: "band" as const, // Explicitly define as const for the scale type
      formatters: {
        scale: (index: number) => `#${index + 1}`,
      },
    }),
    []
  );

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (datum: { value: number }) => datum.value,
        elementType: "line" as const,
      },
    ],
    []
  );

  return (
    <div style={{ height: "400px", marginTop: "30px" }}>
      <Chart
        options={{
          data: chartData,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </div>
  );
};

const MyDashboard: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const { data: bookings } = useGetBookingsByUserQuery(undefined);
  const userBookings: Booking[] = bookings?.response?.data || [];

  const { data: transactions } = useGetAllTransactionQuery(undefined);
  const allTransaction: Transaction[] = transactions?.response || [];

  const userTransactions = allTransaction.filter(
    (transaction) => transaction.email === currentUser?.email
  );

  const totalServices = userBookings.length;
  const totalSlots = userBookings.length; // Change this if you have a different count for slots
  const totalTransactionAmount = userTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  // Table Columns Definition
  const columns = [
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
      align: "center" as const, // Use 'as const' to specify the type
    },
    {
      title: "Booking Slot",
      dataIndex: "slot",
      key: "slot",
      align: "center" as const, // Use 'as const' to specify the type
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      align: "center" as const, // Use 'as const' to specify the type
    },
    {
      title: "Transaction Amount ($)",
      dataIndex: "amount",
      key: "amount",
      align: "center" as const, // Use 'as const' to specify the type
      render: (text: number) => (
        <Text style={{ color: "#52c41a" }}>${text.toFixed(2)}</Text>
      ),
    },
  ];

  // Map Booking and Transaction Data to Table Rows
  const tableData = userBookings.map((booking, index) => {
    const transaction = userTransactions.find(
      (tran) => tran.slotId?._id === booking.slotId
    );
    return {
      key: index,
      serviceName: booking.service?.name || "N/A",
      slot: `${booking.slot.startTime} - ${booking.slot.endTime}`,
      transactionId: transaction?.tran_id || "N/A",
      amount: transaction?.amount || 0,
    };
  });

  return (
    <div className="dashboard-container">
      <Title className="dashboard-title">My Dashboard</Title>
      <Divider />

      <Row gutter={[16, 16]} justify="center">
        {/* Card 1: Total Services Booked */}
        <Col xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            hoverable
            className="dashboard-card card-services"
          >
            <Avatar
              size={64}
              style={{ backgroundColor: "#1890ff" }}
              icon={<BookOutlined />}
            />
            <Title level={2} className="dashboard-card-title">
              {totalServices}
            </Title>
            <Text className="dashboard-card-text">Total Services Booked</Text>
          </Card>
        </Col>

        {/* Card 2: Total Slots Booked */}
        <Col xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            hoverable
            className="dashboard-card card-slots"
          >
            <Avatar
              size={64}
              style={{ backgroundColor: "#52c41a" }}
              icon={<CalendarOutlined />}
            />
            <Title level={2} className="dashboard-card-title">
              {totalSlots}
            </Title>
            <Text className="dashboard-card-text">Total Slots Booked</Text>
          </Card>
        </Col>

        {/* Card 3: Total Transactions */}
        <Col xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            hoverable
            className="dashboard-card card-transactions"
          >
            <Avatar
              size={64}
              style={{ backgroundColor: "#faad14" }}
              icon={<DollarCircleOutlined />}
            />
            <Title level={2} className="dashboard-card-title">
              {userTransactions.length}
            </Title>
            <Text className="dashboard-card-text">
              Completed for{" "}
              <strong>${totalTransactionAmount.toFixed(2)}</strong>
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Combined Metrics Chart */}
      {userBookings.length > 0 || userTransactions.length > 0 ? (
        <CombinedChart
          userBookings={userBookings}
          userTransactions={userTransactions}
        />
      ) : (
        <div className="no-data-message">
          <Text>No Data Available</Text>
        </div>
      )}

      {/* Table for Booking & Transaction Details */}
      <div className="table-container">
        <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
          Booking & Transaction Details
        </Title>
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{ pageSize: 5 }}
          bordered
          style={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
          rowClassName={() => "custom-row-style"}
          tableLayout="fixed"
        />
      </div>
    </div>
  );
};

export default MyDashboard;
