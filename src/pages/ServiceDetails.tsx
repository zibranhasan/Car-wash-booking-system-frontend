import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetAvailableTimeSlotsQuery,
  useGetServiceByIdQuery,
} from "../redux/api/serviceApi";
import {
  Card,
  Typography,
  Row,
  Col,
  DatePicker,
  List,
  Button,
  Modal,
  Form,
  Input,
} from "antd";
import { DollarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  ServiceResponse,
  TimeSlot,
  TimeSlotsResponse,
} from "../types/serviceDetails";
import { useCreateBookingMutation } from "../redux/api/bookingApi";
import { useCreateTransactionMutation } from "../redux/api/transactionApi";
import { useAppSelector } from "../redux/hook";

const { Title, Text } = Typography;

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: serviceDetails,
    isLoading: isLoadingService,
    isError: isErrorService,
  } = useGetServiceByIdQuery<ServiceResponse>(id);

  const {
    data: timeSlotsData,
    isLoading: isLoadingSlots,
    isError: isErrorSlots,
  } = useGetAvailableTimeSlotsQuery<TimeSlotsResponse>("");

  const [createBooking] = useCreateBookingMutation();
  const [createTransaction] = useCreateTransactionMutation();
  const { user } = useAppSelector((state) => state.auth);
  const userEmail = user?.email;

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [filteredSlots, setFilteredSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const service = serviceDetails?.data || null;
  const availableTimeSlots = timeSlotsData?.data?.data || [];

  const filterSlotsByDate = (date: Dayjs | null) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;
    const filtered = availableTimeSlots.filter(
      (slot) => slot.date === formattedDate && slot.service._id === id
    );
    setFilteredSlots(filtered);
  };

  const onDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    filterSlotsByDate(date);
  };

  const handleSlotSelect = (slotId: string) => {
    console.log("slotId", slotId);
    setSelectedSlotId(slotId); // Set selected slot ID
  };

  // Open the modal once the selectedSlotId is set
  useEffect(() => {
    if (selectedSlotId) {
      showModal(); // Open modal only after selectedSlotId is set
    }
  }, [selectedSlotId]);

  const showModal = () => {
    form.setFieldsValue({
      email: userEmail,
      slotId: selectedSlotId, // Now slotId will be available
      serviceId: id,
    });
    setIsModalVisible(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOk = async (values: any) => {
    console.log("values of bookings", values);
    try {
      // Create booking first
      const bookingResponse = await createBooking(values).unwrap();
      console.log("createBooking(values)", bookingResponse);

      // Then create transaction
      const transactionValues = {
        email: bookingResponse.data.customer.email,
        slotId: bookingResponse.data.slot._id, // Get slotId from booking response
        amount: service.price, // Use the service price from service details
      };

      const transactionResponse = await createTransaction(
        transactionValues
      ).unwrap();
      console.log("Transaction Response:", transactionResponse);

      // Check if transaction was successful and if a URL is provided
      if (transactionResponse?.url) {
        window.location.replace(transactionResponse.url); // Redirect to payment page
      } else {
        console.error("No payment URL found in the transaction response.");
      }
    } catch (error) {
      console.error("Error during booking and transaction:", error);
    } finally {
      setIsModalVisible(false); // Close the modal
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    if (selectedDate) {
      filterSlotsByDate(selectedDate);
    }
  }, [availableTimeSlots, selectedDate]);

  if (isLoadingService || isLoadingSlots) {
    return <p>Loading...</p>;
  }

  if (isErrorService || isErrorSlots || !service) {
    return <p>Error loading service details</p>;
  }

  return (
    <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
      <Card
        hoverable
        style={{
          width: "100%",
          maxWidth: 600,
          borderRadius: 12,
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <Title level={2} style={{ marginBottom: 16 }}>
          {service?.name}
        </Title>
        <Text style={{ display: "block", marginBottom: 16, fontSize: "16px" }}>
          {service?.description}
        </Text>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col>
            <div style={{ display: "flex", alignItems: "center" }}>
              <DollarOutlined
                style={{ fontSize: 24, color: "#1890ff", marginRight: 8 }}
              />
              <Text style={{ fontSize: "18px" }} strong>
                ${service?.price}
              </Text>
            </div>
          </Col>
          <Col>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ClockCircleOutlined
                style={{ fontSize: 24, color: "#1890ff", marginRight: 8 }}
              />
              <Text style={{ fontSize: "18px" }}>{service?.duration} mins</Text>
            </div>
          </Col>
        </Row>

        <DatePicker
          onChange={onDateChange}
          value={selectedDate}
          format="YYYY-MM-DD"
          style={{ width: "100%", marginBottom: 16 }}
        />

        {filteredSlots.length > 0 ? (
          <List
            dataSource={filteredSlots}
            renderItem={(slot) => (
              <List.Item>
                <List.Item.Meta
                  title={`${slot.startTime} - ${slot.endTime}`}
                  description={
                    slot.isBooked === "available" ? "Available" : "Booked"
                  }
                />
                {slot.isBooked === "available" ? (
                  <Button
                    type="primary"
                    onClick={() => handleSlotSelect(slot._id)}
                  >
                    Book This Slot
                  </Button>
                ) : (
                  <Button disabled>Booked</Button>
                )}
              </List.Item>
            )}
          />
        ) : (
          <Text>No available slots for the selected date.</Text>
        )}
      </Card>

      {/* Booking Modal */}
      <Modal
        title="Book Service"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleOk}>
          <Form.Item label="Service" name="serviceId">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Slot" name="slotId">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Vehicle Type"
            name="vehicleType"
            rules={[
              { required: true, message: "Please input the vehicle type!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Vehicle Brand"
            name="vehicleBrand"
            rules={[
              { required: true, message: "Please input the vehicle brand!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Vehicle Model"
            name="vehicleModel"
            rules={[
              { required: true, message: "Please input the vehicle model!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Manufacturing Year"
            name="manufacturingYear"
            rules={[
              {
                required: true,
                message: "Please input the manufacturing year!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Registration Plate"
            name="registrationPlate"
            rules={[
              {
                required: true,
                message: "Please input the registration plate!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Payment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceDetails;
