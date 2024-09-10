import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  message,
} from "antd";
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetAllServiceQuery,
  useUpdateServiceMutation,
} from "../redux/api/serviceApi";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

const ManageService = () => {
  const { data } = useGetAllServiceQuery("");
  const [createService] = useCreateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();
  const [updateService] = useUpdateServiceMutation();

  const allServiceData: Service[] = data?.data.data || [];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [form] = Form.useForm();

  const handleAddService = () => {
    setIsModalVisible(true);
  };

  const handleUpdateService = (service: Service) => {
    setEditingService(service);
    setIsUpdateModalVisible(true);
    form.setFieldsValue(service);
  };

  const handleCreateService = async (values: Service) => {
    try {
      await createService(values).unwrap();
      message.success("Service added successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add service.");
    }
  };

  const handleEditService = async (values: Service) => {
    try {
      await updateService({ id: editingService?._id, ...values }).unwrap();
      message.success("Service updated successfully!");
      setIsUpdateModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to update service.");
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteService(id).unwrap();
      message.success("Service deleted successfully!");
    } catch (error) {
      message.error("Failed to delete service.");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Duration (min)", dataIndex: "duration", key: "duration" },
    {
      title: "Actions",
      key: "actions",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (text: any, record: Service) => (
        <span>
          <Button type="link" onClick={() => handleUpdateService(record)}>
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this service?"
            onConfirm={() => handleDeleteService(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1>Manage Services</h1>
      <Button type="primary" onClick={handleAddService}>
        Add Service
      </Button>
      <Table columns={columns} dataSource={allServiceData} rowKey="_id" />

      <Modal
        title="Add Service"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateService}>
          <Form.Item
            name="name"
            label="Service Name"
            rules={[{ required: true, message: "Please input service name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input price" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration (minutes)"
            rules={[{ required: true, message: "Please input duration" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Update Service"
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleEditService}>
          <Form.Item
            name="name"
            label="Service Name"
            rules={[{ required: true, message: "Please input service name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input price" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration (minutes)"
            rules={[{ required: true, message: "Please input duration" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageService;
