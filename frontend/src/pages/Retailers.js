import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Tag } from 'antd';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axios';

const Retailers = () => {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRetailer, setEditingRetailer] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRetailers();
  }, []);

  const fetchRetailers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/retailers');
      setRetailers(response.data);
    } catch (error) {
      message.error('Failed to fetch retailers');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRetailer(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (retailer) => {
    setEditingRetailer(retailer);
    form.setFieldsValue(retailer);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/retailers/${id}`);
      message.success('Retailer deleted successfully');
      fetchRetailers();
    } catch (error) {
      message.error('Failed to delete retailer');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRetailer) {
        await api.put(`/retailers/${editingRetailer.id}`, values);
        message.success('Retailer updated successfully');
      } else {
        await api.post('/retailers', values);
        message.success('Retailer created successfully');
      }
      setModalVisible(false);
      fetchRetailers();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const columns = [
    {
      title: 'Shop Name',
      dataIndex: 'shop_name',
      key: 'shop_name',
      sorter: (a, b) => a.shop_name.localeCompare(b.shop_name),
    },
    {
      title: 'Owner Name',
      dataIndex: 'owner_name',
      key: 'owner_name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Total Due',
      dataIndex: 'total_due',
      key: 'total_due',
      render: (due) => (
        <span className="font-medium" style={{ color: due > 0 ? '#EF4444' : '#10B981' }}>
          ₹{due.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.total_due - b.total_due,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<Edit size={16} />}
            onClick={() => handleEdit(record)}
            data-testid={`edit-retailer-${record.id}`}
          />
          <Popconfirm
            title="Are you sure you want to delete this retailer?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              data-testid={`delete-retailer-${record.id}`}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading text-4xl font-bold mb-2" style={{ color: '#312E81' }} data-testid="retailers-title">Retailers</h1>
            <p className="text-muted" style={{ color: '#9CA3AF' }}>Manage your retail partners</p>
          </div>
          <Button
            type="primary"
            icon={<Plus size={18} />}
            onClick={handleAdd}
            size="large"
            style={{ 
              background: '#312E81', 
              borderColor: '#312E81',
              borderRadius: '4px',
              height: '44px'
            }}
            data-testid="add-retailer-button"
          >
            Add Retailer
          </Button>
        </div>

        <div className="bg-white rounded-default shadow-card p-6" style={{ borderRadius: '6px' }}>
          <Table
            dataSource={retailers}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>

      <Modal
        title={<span className="font-heading text-xl font-bold" style={{ color: '#312E81' }}>{editingRetailer ? 'Edit Retailer' : 'Add Retailer'}</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            label="Shop Name"
            name="shop_name"
            rules={[{ required: true, message: 'Please input shop name!' }]}
          >
            <Input placeholder="Enter shop name" data-testid="shop-name-input" />
          </Form.Item>

          <Form.Item
            label="Owner Name"
            name="owner_name"
            rules={[{ required: true, message: 'Please input owner name!' }]}
          >
            <Input placeholder="Enter owner name" data-testid="owner-name-input" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              { required: true, message: 'Please input phone number!' },
              { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number!' }
            ]}
          >
            <Input placeholder="Enter phone number" data-testid="phone-input" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input address!' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter address" data-testid="address-input" />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button onClick={() => setModalVisible(false)} data-testid="cancel-button">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ background: '#312E81', borderColor: '#312E81' }}
                data-testid="submit-retailer-button"
              >
                {editingRetailer ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Retailers;