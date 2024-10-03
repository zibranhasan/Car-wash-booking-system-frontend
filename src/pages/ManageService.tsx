import React, { useState, ChangeEvent } from "react";
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
import axios from "axios";
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
  photo?: string;
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
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Handle image selection and preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setPreview(URL.createObjectURL(selectedImage));
    }
  };

  // Reset image and preview when modals are closed
  const resetImage = () => {
    setImage(null);
    setPreview(null);
  };

  // Handle form submission to create a service
  const handleCreateService = async (values: Service) => {
    try {
      let imageUrl = "";
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const response = await axios.post(
          "https://api.imgbb.com/1/upload?key=963ca9297bc7cea248773301a33b8428",
          formData
        );
        imageUrl = response.data.data.display_url;
      }

      const serviceData = { ...values, photo: imageUrl };
      await createService(serviceData).unwrap();
      message.success("Service added successfully!");
      setIsModalVisible(false);
      form.resetFields();
      resetImage();
    } catch (error) {
      message.error("Failed to add service.");
    }
  };

  // Handle form submission to update a service
  const handleEditService = async (values: Service) => {
    try {
      let imageUrl = editingService?.photo || "";
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const response = await axios.post(
          "https://api.imgbb.com/1/upload?key=963ca9297bc7cea248773301a33b8428",
          formData
        );
        imageUrl = response.data.data.display_url;
      }

      const updatedData = {
        id: editingService?._id,
        ...values,
        photo: imageUrl,
      };
      await updateService(updatedData).unwrap();
      message.success("Service updated successfully!");
      setIsUpdateModalVisible(false);
      form.resetFields();
      resetImage();
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

  const handleAddService = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleUpdateService = (service: Service) => {
    setEditingService(service);
    setPreview(service.photo || null);
    setIsUpdateModalVisible(true);
    form.setFieldsValue(service);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Duration (min)", dataIndex: "duration", key: "duration" },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (text: string) =>
        text ? (
          <img
            src={text}
            alt="service"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_text: any, record: Service) => (
        <span>
          <Button
            type="link"
            onClick={() => handleUpdateService(record)}
            style={{ color: "#1890ff", marginRight: 12 }}
          >
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
    <div style={{ padding: "20px", background: "#f9f9f9", minHeight: "100vh" }}>
      <h1
        style={{ textAlign: "center", marginBottom: "20px", color: "#1890ff" }}
      >
        Manage Services
      </h1>
      <Button
        type="primary"
        onClick={handleAddService}
        style={{
          marginBottom: "20px",
          backgroundColor: "#4CAF50",
          borderColor: "#4CAF50",
        }}
      >
        Add Service
      </Button>
      <Table
        columns={columns}
        dataSource={allServiceData}
        rowKey="_id"
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      />

      {/* Add Service Modal */}
      <Modal
        title="Add Service"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          resetImage();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateService}>
          <Form.Item
            name="name"
            label="Service Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration (minutes)"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Upload Image">
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Item>
          {preview && (
            <div style={{ marginBottom: "16px", textAlign: "center" }}>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Submit
          </Button>
        </Form>
      </Modal>

      {/* Update Service Modal */}
      <Modal
        title="Update Service"
        visible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          resetImage();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleEditService}>
          <Form.Item
            name="name"
            label="Service Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration (minutes)"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Upload Image">
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Item>
          {preview && (
            <div style={{ marginBottom: "16px", textAlign: "center" }}>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageService;
