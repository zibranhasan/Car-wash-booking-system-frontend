import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Dayjs } from "dayjs"; // Import Dayjs for date handling
import dayjs from "dayjs";
import {
  ServiceResponse,
  TimeSlot,
  TimeSlotsResponse,
} from "../types/serviceDetails";

import { useCreateBookingMutation } from "../redux/api/bookingApi";

const { Title, Text } = Typography;

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>(); // Expect 'id' as a URL param
  const navigate = useNavigate(); // Initialize useNavigate

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
  const [booking] = useCreateBookingMutation();

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs()); // Default to current date
  const [filteredSlots, setFilteredSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal state
  const [form] = Form.useForm(); // Ant Design form instance

  const service = serviceDetails?.data || null;
  const availableTimeSlots = timeSlotsData?.data?.data || [];

  // Filter time slots by date
  const filterSlotsByDate = (date: Dayjs | null) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;
    const filtered = availableTimeSlots.filter(
      (slot) => slot.date === formattedDate && slot.service._id === id
    );
    setFilteredSlots(filtered);
  };

  // Handle date change and filter available slots
  const onDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    filterSlotsByDate(date);
  };

  // Handle slot selection
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
  };

  // Show Modal when "Book This Service" is clicked
  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      serviceId: id || "N/A", // Set field name to 'serviceId'
      slotId: selectedSlotId || "N/A", // Set field name to 'slotId'
    });
  };

  // Handle form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOk = async (values: any) => {
    try {
      console.log("Form Submitted", values);
      await booking(values).unwrap(); // Ensure mutation is awaited and unwrapped for proper error handling
      setIsModalVisible(false);
      navigate("/booking"); // Navigate to the /bookings route
    } catch (error) {
      console.error("Booking failed:", error);
      // Handle form submission errors here
    }
  };

  // Close modal without saving
  const handleCancel = () => {
    setIsModalVisible(false);
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

        {/* Calendar to select a date */}
        <DatePicker
          onChange={onDateChange}
          value={selectedDate}
          format="YYYY-MM-DD"
          style={{ width: "100%", marginBottom: 16 }}
        />

        {/* Display available or booked slots */}
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
                    type={slot._id === selectedSlotId ? "primary" : "default"}
                    onClick={() => handleSlotSelect(slot._id)}
                  >
                    {slot._id === selectedSlotId
                      ? "Selected"
                      : "Select this slot"}
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

        {/* Show "Book This Service" button after selecting a slot */}
        {selectedSlotId && (
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <Button type="primary" size="large" onClick={showModal}>
              Book This Service
            </Button>
          </div>
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
              Submit Booking
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceDetails;
