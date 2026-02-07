import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm } from 'antd';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, values);
        message.success('Product updated successfully');
      } else {
        await api.post('/products', values);
        message.success('Product created successfully');
      }
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      sorter: (a, b) => a.product_name.localeCompare(b.product_name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [...new Set(products.map(p => p.category))].map(cat => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₹${price.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Stock',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
      render: (stock) => (
        <span 
          className="font-medium" 
          style={{ color: stock < 10 ? '#EF4444' : stock < 50 ? '#F59E0B' : '#10B981' }}
        >
          {stock}
        </span>
      ),
      sorter: (a, b) => a.stock_quantity - b.stock_quantity,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
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
            data-testid={`edit-product-${record.id}`}
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              data-testid={`delete-product-${record.id}`}
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
            <h1 className="font-heading text-4xl font-bold mb-2" style={{ color: '#312E81' }} data-testid="products-title">Products</h1>
            <p className="text-muted" style={{ color: '#9CA3AF' }}>Manage your product inventory</p>
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
            data-testid="add-product-button"
          >
            Add Product
          </Button>
        </div>

        <div className="bg-white rounded-default shadow-card p-6" style={{ borderRadius: '6px' }}>
          <Table
            dataSource={products}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>

      <Modal
        title={<span className="font-heading text-xl font-bold" style={{ color: '#312E81' }}>{editingProduct ? 'Edit Product' : 'Add Product'}</span>}
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
            label="Product Name"
            name="product_name"
            rules={[{ required: true, message: 'Please input product name!' }]}
          >
            <Input placeholder="Enter product name" data-testid="product-name-input" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please input category!' }]}
          >
            <Input placeholder="Enter category" data-testid="category-input" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Price (₹)"
              name="price"
              rules={[{ required: true, message: 'Please input price!' }]}
            >
              <InputNumber 
                min={0} 
                step={0.01} 
                style={{ width: '100%' }} 
                placeholder="0.00"
                data-testid="price-input"
              />
            </Form.Item>

            <Form.Item
              label="Stock Quantity"
              name="stock_quantity"
              rules={[{ required: true, message: 'Please input stock quantity!' }]}
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                placeholder="0"
                data-testid="stock-input"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Unit"
            name="unit"
            rules={[{ required: true, message: 'Please select unit!' }]}
          >
            <Select placeholder="Select unit" data-testid="unit-select">
              <Select.Option value="pieces">Pieces</Select.Option>
              <Select.Option value="sets">Sets</Select.Option>
              <Select.Option value="boxes">Boxes</Select.Option>
              <Select.Option value="packs">Packs</Select.Option>
              <Select.Option value="reams">Reams</Select.Option>
              <Select.Option value="bottles">Bottles</Select.Option>
            </Select>
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
                data-testid="submit-product-button"
              >
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Products;