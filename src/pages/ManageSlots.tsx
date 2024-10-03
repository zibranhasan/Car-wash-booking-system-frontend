import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Table,
  Popconfirm,
  Select,
  Card,
} from "antd";
import moment from "moment";
import { useGetAllServiceQuery } from "../redux/api/serviceApi";
import {
  useCreateSlotsMutation,
  useDeleteSlotsMutation,
  useGetAllSlotsQuery,
  useUpdateSlotsMutation,
} from "../redux/api/slotApi";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface Slot {
  _id?: string;
  service?: {
    _id: string;
    name: string;
  };
  date?: string; // ISO date string
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  isBooked?: string; // e.g., "booked", "available", "canceled"
}

interface Service {
  _id: string;
  name: string;
  description: string;
}

const ManageSlots: React.FC = () => {
  const { data: slots } = useGetAllSlotsQuery("");
  const [updateSlots] = useUpdateSlotsMutation();
  const [createSlots] = useCreateSlotsMutation();
  const [deleteSlot] = useDeleteSlotsMutation();
  const { data: services } = useGetAllServiceQuery("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    service: null,
    dateRange: null,
  });

  const allSlots: Slot[] = slots?.response.data || [];
  const allServiceData: Service[] = services?.data.data || [];

  const filteredSlots = allSlots.filter((slot) => {
    const serviceMatch =
      !filters.service || slot?.service?._id === filters.service;
    const dateMatch =
      !filters.dateRange ||
      moment(slot.date).isBetween(
        filters.dateRange[0],
        filters.dateRange[1],
        null,
        "[]"
      );
    return serviceMatch && dateMatch;
  });

  const showModal = (service: Service) => {
    setSelectedService(service);
    setIsModalVisible(true);
  };

  const handleCreateSlot = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        service: selectedService!._id,
        date: values.date.format("YYYY-MM-DD"),
        startTime: values.startTime.format("HH:mm"),
        endTime: values.endTime.format("HH:mm"),
      };
      await createSlots(payload);
      alert("Slot created successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating slot:", error);
    }
  };

  const handleUpdateSlot = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        date: values.date.format("YYYY-MM-DD"),
        startTime: values.startTime.format("HH:mm"),
        endTime: values.endTime.format("HH:mm"),
      };
      await updateSlots({ id: selectedSlot!._id, ...payload });
      alert("Slot updated successfully!");
      setIsUpdateModalVisible(false);
    } catch (error) {
      console.error("Error updating slot:", error);
    }
  };

  const handleUpdateSlotStatus = async (slotId: string, newStatus: string) => {
    const slot = allSlots.find((slot) => slot._id === slotId);
    if (slot?.isBooked === "booked") {
      alert("Cannot update a booked slot");
      return;
    }
    await updateSlots({ id: slotId, isBooked: newStatus });
    alert("Slot status updated successfully");
  };

  const handleDeleteSlot = async (slotId: string) => {
    await deleteSlot({ id: slotId });
    alert("Slot deleted successfully");
  };

  const showUpdateModal = (slot: Slot) => {
    setSelectedSlot(slot);
    form.setFieldsValue({
      date: moment(slot.date),
      startTime: moment(slot.startTime, "HH:mm"),
      endTime: moment(slot.endTime, "HH:mm"),
    });
    setIsUpdateModalVisible(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilter = (value: any, key: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      style={{
        padding: "6px",
        display: "flex",
        flexDirection: "column",

        justifyContent: "center",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#1890ff" }}>All Services</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          padding: "6px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {allServiceData.map((service) => (
          <Card
            key={service._id}
            title={service.name}
            bordered={true}
            style={{
              width: 300,
              border: "1px solid #5899f5",
              boxShadow: "0 2px 4px rgba(88, 153, 245, 0.3)",
            }}
            actions={[
              <Button
                key="create"
                type="primary"
                onClick={() => showModal(service)}
                style={{
                  borderRadius: "4px",
                  backgroundColor: "#5899f5",
                  color: "#fff",
                }}
              >
                Create Slot
              </Button>,
            ]}
          >
            <p>{service.description}</p>
          </Card>
        ))}
      </div>

      <h2
        style={{
          marginTop: "32px",
          textAlign: "center",
          fontSize: "16px",
          color: "#1890ff",
        }}
      >
        All Slots
      </h2>
      <div style={{ marginBottom: "16px", textAlign: "center" }}>
        <Select
          placeholder="Select Service"
          style={{ width: 200, marginRight: "16px" }}
          onChange={(value) => handleFilter(value, "service")}
          allowClear
        >
          {allServiceData.map((service) => (
            <Option key={service._id} value={service._id}>
              {service.name}
            </Option>
          ))}
        </Select>
        <RangePicker
          style={{ marginRight: "16px" }}
          onChange={(dates) => handleFilter(dates, "dateRange")}
          format="YYYY-MM-DD"
        />
      </div>

      <Table<Slot>
        dataSource={filteredSlots}
        rowKey="_id"
        style={{ textAlign: "center" }}
        bordered
        pagination={{ pageSize: 10 }} // Configure pagination here
      >
        <Table.Column
          title={
            <span style={{ color: "#1890ff", fontWeight: "bold" }}>
              Service
            </span>
          }
          dataIndex={["service", "name"]}
        />
        <Table.Column
          title={
            <span style={{ color: "#1890ff", fontWeight: "bold" }}>Date</span>
          }
          dataIndex="date"
        />
        <Table.Column
          title={
            <span style={{ color: "#1890ff", fontWeight: "bold" }}>
              Start Time
            </span>
          }
          dataIndex="startTime"
        />
        <Table.Column
          title={
            <span style={{ color: "#1890ff", fontWeight: "bold" }}>
              End Time
            </span>
          }
          dataIndex="endTime"
        />
        <Table.Column
          title={
            <span style={{ color: "#1890ff", fontWeight: "bold" }}>Status</span>
          }
          dataIndex="isBooked"
        />
        <Table.Column
          title={
            <span style={{ color: "#1890ff", fontWeight: "bold" }}>Action</span>
          }
          render={(_text, slot) => (
            <>
              <Select
                defaultValue={slot.isBooked}
                onChange={(value) => handleUpdateSlotStatus(slot._id, value)}
                disabled={slot.isBooked === "booked"}
              >
                <Option value="available">Available</Option>
                <Option value="canceled">Canceled</Option>
              </Select>
              <Button
                onClick={() => showUpdateModal(slot)}
                style={{
                  marginLeft: 8,
                  borderRadius: "4px",
                  backgroundColor: "#5899f5",
                  color: "#fff",
                }}
              >
                Update
              </Button>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDeleteSlot(slot._id)}
              >
                <Button danger style={{ marginLeft: 8, borderRadius: "4px" }}>
                  Delete
                </Button>
              </Popconfirm>
            </>
          )}
        />
      </Table>

      {/* Modal for slot creation */}
      <Modal
        title={`Create Slot for ${selectedService?.name}`}
        visible={isModalVisible}
        onOk={handleCreateSlot}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: "Please select start time" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true, message: "Please select end time" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for slot updating */}
      <Modal
        title="Update Slot"
        visible={isUpdateModalVisible}
        onOk={handleUpdateSlot}
        onCancel={() => setIsUpdateModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: "Please select start time" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true, message: "Please select end time" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageSlots;
