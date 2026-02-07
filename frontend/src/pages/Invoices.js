import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, InputNumber, Input, message, Tag, Card } from 'antd';
import { Plus, Eye, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axios';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [form] = Form.useForm();
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchInvoices();
    fetchRetailers();
    fetchProducts();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data);
    } catch (error) {
      message.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const fetchRetailers = async () => {
    try {
      const response = await api.get('/retailers');
      setRetailers(response.data);
    } catch (error) {
      message.error('Failed to fetch retailers');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      message.error('Failed to fetch products');
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setSelectedProducts([]);
    setModalVisible(true);
  };

  const handleView = async (invoice) => {
    setSelectedInvoice(invoice);
    setViewModalVisible(true);
  };

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { product_id: null, quantity: 1 }]);
  };

  const handleRemoveProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index][field] = value;
    setSelectedProducts(updated);
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      const product = products.find(p => p.id === item.product_id);
      if (product && item.quantity) {
        return total + (product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const handleSubmit = async (values) => {
    if (selectedProducts.length === 0) {
      message.error('Please add at least one product');
      return;
    }

    const invoiceProducts = selectedProducts.map(item => {
      const product = products.find(p => p.id === item.product_id);
      return {
        product_id: product.id,
        product_name: product.product_name,
        quantity: item.quantity,
        price: product.price,
        total: product.price * item.quantity
      };
    });

    const invoiceData = {
      retailer_id: values.retailer_id,
      products: invoiceProducts,
      paid_amount: values.paid_amount || 0,
      notes: values.notes
    };

    try {
      await api.post('/invoices', invoiceData);
      message.success('Invoice created successfully');
      setModalVisible(false);
      fetchInvoices();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to create invoice');
    }
  };

  const columns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      sorter: (a, b) => a.invoice_number.localeCompare(b.invoice_number),
    },
    {
      title: 'Retailer',
      dataIndex: 'retailer_name',
      key: 'retailer_name',
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => `₹${amount.toFixed(2)}`,
      sorter: (a, b) => a.total_amount - b.total_amount,
    },
    {
      title: 'Paid',
      dataIndex: 'paid_amount',
      key: 'paid_amount',
      render: (amount) => `₹${amount.toFixed(2)}`,
    },
    {
      title: 'Due',
      dataIndex: 'due_amount',
      key: 'due_amount',
      render: (amount) => (
        <span className="font-medium" style={{ color: amount > 0 ? '#EF4444' : '#10B981' }}>
          ₹{amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          paid: 'green',
          partial: 'orange',
          unpaid: 'red',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Paid', value: 'paid' },
        { text: 'Partial', value: 'partial' },
        { text: 'Unpaid', value: 'unpaid' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Date',
      dataIndex: 'invoice_date',
      key: 'invoice_date',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.invoice_date) - new Date(b.invoice_date),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="text"
          icon={<Eye size={16} />}
          onClick={() => handleView(record)}
          data-testid={`view-invoice-${record.id}`}
        />
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading text-4xl font-bold mb-2" style={{ color: '#312E81' }} data-testid="invoices-title">Invoices</h1>
            <p className="text-muted" style={{ color: '#9CA3AF' }}>Manage your invoices</p>
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
            data-testid="add-invoice-button"
          >
            Create Invoice
          </Button>
        </div>

        <div className="bg-white rounded-default shadow-card p-6" style={{ borderRadius: '6px' }}>
          <Table
            dataSource={invoices}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>

      {/* Create Invoice Modal */}
      <Modal
        title={<span className="font-heading text-xl font-bold" style={{ color: '#312E81' }}>Create Invoice</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            label="Retailer"
            name="retailer_id"
            rules={[{ required: true, message: 'Please select a retailer!' }]}
          >
            <Select placeholder="Select retailer" data-testid="retailer-select">
              {retailers.map(r => (
                <Select.Option key={r.id} value={r.id}>{r.shop_name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Products</label>
              <Button
                type="dashed"
                onClick={handleAddProduct}
                size="small"
                data-testid="add-product-line-button"
              >
                Add Product
              </Button>
            </div>

            {selectedProducts.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Select
                  placeholder="Select product"
                  style={{ flex: 2 }}
                  value={item.product_id}
                  onChange={(value) => handleProductChange(index, 'product_id', value)}
                  data-testid={`product-select-${index}`}
                >
                  {products.map(p => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.product_name} (₹{p.price})
                    </Select.Option>
                  ))}
                </Select>
                <InputNumber
                  min={1}
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(value) => handleProductChange(index, 'quantity', value)}
                  style={{ width: '100px' }}
                  data-testid={`quantity-input-${index}`}
                />
                <Button
                  danger
                  icon={<Trash2 size={16} />}
                  onClick={() => handleRemoveProduct(index)}
                  data-testid={`remove-product-${index}`}
                />
              </div>
            ))}
          </div>

          <div className="bg-secondary p-4 rounded mb-4" style={{ background: '#F3F4F6' }}>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="font-heading text-2xl font-bold" style={{ color: '#312E81' }}>
                ₹{calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          <Form.Item
            label="Paid Amount (₹)"
            name="paid_amount"
            initialValue={0}
          >
            <InputNumber
              min={0}
              max={calculateTotal()}
              step={0.01}
              style={{ width: '100%' }}
              data-testid="paid-amount-input"
            />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
          >
            <Input.TextArea rows={2} placeholder="Optional notes" data-testid="notes-input" />
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
                data-testid="submit-invoice-button"
              >
                Create Invoice
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Invoice Modal */}
      <Modal
        title={<span className="font-heading text-xl font-bold" style={{ color: '#312E81' }}>Invoice Details</span>}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)} data-testid="close-invoice-button">
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted" style={{ color: '#9CA3AF' }}>Invoice Number</p>
                <p className="font-medium">{selectedInvoice.invoice_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted" style={{ color: '#9CA3AF' }}>Date</p>
                <p className="font-medium">{new Date(selectedInvoice.invoice_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted" style={{ color: '#9CA3AF' }}>Retailer</p>
                <p className="font-medium">{selectedInvoice.retailer_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted" style={{ color: '#9CA3AF' }}>Status</p>
                <Tag color={selectedInvoice.status === 'paid' ? 'green' : selectedInvoice.status === 'partial' ? 'orange' : 'red'}>
                  {selectedInvoice.status.toUpperCase()}
                </Tag>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Products</p>
              <Table
                dataSource={selectedInvoice.products}
                pagination={false}
                size="small"
                columns={[
                  { title: 'Product', dataIndex: 'product_name', key: 'product_name' },
                  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                  { title: 'Price', dataIndex: 'price', key: 'price', render: (p) => `₹${p.toFixed(2)}` },
                  { title: 'Total', dataIndex: 'total', key: 'total', render: (t) => `₹${t.toFixed(2)}` },
                ]}
              />
            </div>

            <div className="border-t pt-4" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex justify-between mb-2">
                <span>Total Amount:</span>
                <span className="font-medium">₹{selectedInvoice.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Paid Amount:</span>
                <span className="font-medium text-green-600">₹{selectedInvoice.paid_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Due Amount:</span>
                <span className="font-heading text-xl font-bold" style={{ color: selectedInvoice.due_amount > 0 ? '#EF4444' : '#10B981' }}>
                  ₹{selectedInvoice.due_amount.toFixed(2)}
                </span>
              </div>
            </div>

            {selectedInvoice.notes && (
              <div>
                <p className="text-sm text-muted mb-1" style={{ color: '#9CA3AF' }}>Notes</p>
                <p className="text-sm">{selectedInvoice.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Invoices;