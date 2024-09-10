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

const ManageSlots = () => {
  const { data: slots } = useGetAllSlotsQuery("");
  const [updateSlots] = useUpdateSlotsMutation();
  const [createSlots] = useCreateSlotsMutation();
  const [deleteSlot] = useDeleteSlotsMutation();
  const { data: services } = useGetAllServiceQuery("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedService, setSelectedService] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    service: null,
    dateRange: null,
  });

  const allSlots = slots?.response.data || [];
  const allServiceData = services?.data.data || [];

  const filteredSlots = allSlots.filter((slot) => {
    const serviceMatch =
      !filters.service || slot.service._id === filters.service;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showModal = (service: any) => {
    setSelectedService(service);
    setIsModalVisible(true);
  };

  const handleCreateSlot = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        service: selectedService._id,
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
      await updateSlots({ id: selectedSlot._id, ...payload });
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showUpdateModal = (slot: any) => {
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
    <div>
      <h1>All Services</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {allServiceData.map((service) => (
          <Card
            key={service._id}
            title={service.name}
            bordered={true}
            style={{
              width: 300,
              border: "1px solid #5899f5",
              boxShadow: "0 2px 4px #5899f5",
            }}
            actions={[
              <Button
                key="create"
                type="primary"
                onClick={() => showModal(service)}
                style={{ borderRadius: "4px" }}
              >
                Create Slot
              </Button>,
            ]}
          >
            <p>{service.description}</p>
          </Card>
        ))}
      </div>

      <h2>All Slots</h2>
      <div style={{ marginBottom: "16px" }}>
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

      <Table dataSource={filteredSlots} rowKey="_id">
        <Table.Column title="Service" dataIndex={["service", "name"]} />
        <Table.Column title="Date" dataIndex="date" />
        <Table.Column title="Start Time" dataIndex="startTime" />
        <Table.Column title="End Time" dataIndex="endTime" />
        <Table.Column title="Status" dataIndex="isBooked" />
        <Table.Column
          title="Action"
          render={(text, slot) => (
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
                style={{ marginLeft: 8 }}
              >
                Update
              </Button>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDeleteSlot(slot._id)}
              >
                <Button danger style={{ marginLeft: 8 }}>
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
