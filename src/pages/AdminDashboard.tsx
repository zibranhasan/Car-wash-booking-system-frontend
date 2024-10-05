import React, { useMemo } from "react";
import { useGetAllBookingsQuery } from "../redux/api/bookingApi";
import { useGetAllTransactionQuery } from "../redux/api/transactionApi";
import { Row, Col, Card, Typography, Avatar, Divider, Table } from "antd";
import {
  DollarOutlined,
  BookOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { Chart, AxisOptions } from "react-charts"; // Ensure you import AxisOptions
import "./AdminDashboard.css";

const { Title, Text } = Typography;

// Define a type for the service details
interface ServiceDetails {
  count: number;
  revenue: number;
}

// Define the type for the chart data
interface ChartData {
  service: string;
  value: number;
}

const aggregateBookingData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allBookings: any[]
): Record<string, ServiceDetails> => {
  return allBookings.reduce((acc, booking) => {
    const serviceName = booking?.service?.name || "Unknown Service";
    if (!acc[serviceName]) {
      acc[serviceName] = {
        count: 0,
        revenue: 0,
      };
    }
    acc[serviceName].count += 1;
    acc[serviceName].revenue += booking?.service?.price || 0;
    return acc;
  }, {} as Record<string, ServiceDetails>);
};

const AdminDashboard: React.FC = () => {
  const { data: transactions } = useGetAllTransactionQuery(undefined);
  const allTransaction = transactions?.response || [];

  const { data: allBooking } = useGetAllBookingsQuery(undefined);
  const allBookings = allBooking?.response.data || [];

  const totalRevenue = allTransaction.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sum: any, transaction: any) => sum + transaction.amount,
    0
  );
  const totalBookings = allBookings.length;
  const totalTransactions = allTransaction.length;

  const serviceData = useMemo(
    () => aggregateBookingData(allBookings),
    [allBookings]
  );

  const chartData: { label: string; data: ChartData[] }[] = useMemo(
    () => [
      {
        label: "Number of Bookings",
        data: Object.entries(serviceData).map(([service, details]) => ({
          service,
          value: details.count, // Use details.count directly
        })),
      },
      {
        label: "Total Revenue ($)",
        data: Object.entries(serviceData).map(([service, details]) => ({
          service,
          value: details.revenue, // Use details.revenue directly
        })),
      },
    ],
    [serviceData]
  );

  const primaryAxis: AxisOptions<ChartData> = useMemo(
    () => ({
      getValue: (datum) => datum.service,
      scaleType: "band",
    }),
    []
  );

  const secondaryAxes: AxisOptions<ChartData>[] = useMemo(
    () => [
      {
        getValue: (datum) => datum.value,
        elementType: "bar", // Make sure this is a valid type according to your library
      },
    ],
    []
  );

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      style: { textAlign: "center", padding: "10px", fontWeight: "bold" },
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      style: { textAlign: "center", padding: "10px" },
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      style: { textAlign: "center", padding: "10px" },
    },
    {
      title: "Transaction Amount ($)",
      dataIndex: "amount",
      key: "amount",
      style: { textAlign: "center", padding: "10px", color: "#52c41a" },
    },
    {
      title: "Booking Time",
      dataIndex: "bookingTime",
      key: "bookingTime",
      style: { textAlign: "center", padding: "10px" },
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableData = allTransaction.map((transaction: any, index: any) => {
    const booking = allBookings.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (booking: any) => booking.customer.email === transaction.email
    );

    return {
      key: index,
      customerName: booking?.customer?.name || "Unknown",
      service: booking?.service?.name || "Unknown Service",
      transactionId: transaction.tran_id,
      amount: transaction.amount.toFixed(2),
      bookingTime: `${booking?.slot?.startTime} - ${booking?.slot?.endTime}`,
    };
  });

  return (
    <div className="admin-dashboard-container">
      <Title level={2} className="dashboard-title">
        Admin Dashboard
      </Title>
      <Divider />

      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card hoverable className="dashboard-card card-transactions">
            <Avatar
              size={64}
              style={{ backgroundColor: "#faad14" }}
              icon={<LineChartOutlined />}
            />
            <Title level={3} className="dashboard-card-title">
              {totalTransactions}
            </Title>
            <Text className="dashboard-card-text">Total Transactions</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card hoverable className="dashboard-card card-bookings">
            <Avatar
              size={64}
              style={{ backgroundColor: "#1890ff" }}
              icon={<BookOutlined />}
            />
            <Title level={3} className="dashboard-card-title">
              {totalBookings}
            </Title>
            <Text className="dashboard-card-text">Total Bookings</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card hoverable className="dashboard-card card-revenue">
            <Avatar
              size={64}
              style={{ backgroundColor: "#52c41a" }}
              icon={<DollarOutlined />}
            />
            <Title level={3} className="dashboard-card-title">
              ${totalRevenue.toFixed(2)}
            </Title>
            <Text className="dashboard-card-text">Total Revenue</Text>
          </Card>
        </Col>
      </Row>

      {Object.keys(serviceData).length > 0 ? (
        <div style={{ height: "400px", marginTop: "30px" }}>
          <Chart
            options={{
              data: chartData,
              primaryAxis,
              secondaryAxes,
            }}
          />
        </div>
      ) : (
        <div className="no-data-message">
          <Text>No Data Available for Chart</Text>
        </div>
      )}

      <div className="table-container" style={{ marginTop: "30px" }}>
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

export default AdminDashboard;
