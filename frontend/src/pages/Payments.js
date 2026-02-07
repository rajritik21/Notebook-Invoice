import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, InputNumber, Input, message } from 'antd';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axios';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchPayments();
    fetchInvoices();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
    } catch (error) {
      message.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      // Filter invoices that have outstanding dues
      const unpaidInvoices = response.data.filter(inv => inv.due_amount > 0);
      setInvoices(unpaidInvoices);
    } catch (error) {
      message.error('Failed to fetch invoices');
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setSelectedInvoice(null);
    setModalVisible(true);
  };

  const handleInvoiceSelect = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    setSelectedInvoice(invoice);
    form.setFieldsValue({ amount: invoice?.due_amount || 0 });
  };

  const handleSubmit = async (values) => {
    try {
      await api.post('/payments', values);
      message.success('Payment recorded successfully');
      setModalVisible(false);
      fetchPayments();
      fetchInvoices();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to record payment');
    }
  };

  const columns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
    },
    {
      title: 'Retailer',
      dataIndex: 'retailer_name',
      key: 'retailer_name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span className="font-medium" style={{ color: '#10B981' }}>
          ₹{amount.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Payment Date',
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.payment_date) - new Date(b.payment_date),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading text-4xl font-bold mb-2" style={{ color: '#312E81' }} data-testid="payments-title">Payments</h1>
            <p className="text-muted" style={{ color: '#9CA3AF' }}>Record and track payments</p>
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
            data-testid="add-payment-button"
          >
            Record Payment
          </Button>
        </div>

        <div className="bg-white rounded-default shadow-card p-6" style={{ borderRadius: '6px' }}>
          <Table
            dataSource={payments}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>

      <Modal
        title={<span className="font-heading text-xl font-bold" style={{ color: '#312E81' }}>Record Payment</span>}
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
            label="Invoice"
            name="invoice_id"
            rules={[{ required: true, message: 'Please select an invoice!' }]}
          >
            <Select 
              placeholder="Select invoice with outstanding dues" 
              onChange={handleInvoiceSelect}
              data-testid="invoice-select"
            >
              {invoices.map(inv => (
                <Select.Option key={inv.id} value={inv.id}>
                  {inv.invoice_number} - {inv.retailer_name} (Due: ₹{inv.due_amount.toFixed(2)})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {selectedInvoice && (
            <div className="bg-secondary p-4 rounded mb-4" style={{ background: '#F3F4F6' }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted" style={{ color: '#9CA3AF' }}>Total Amount</p>
                  <p className="font-medium">₹{selectedInvoice.total_amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted" style={{ color: '#9CA3AF' }}>Already Paid</p>
                  <p className="font-medium">₹{selectedInvoice.paid_amount.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted" style={{ color: '#9CA3AF' }}>Outstanding Due</p>
                  <p className="font-heading text-xl font-bold" style={{ color: '#EF4444' }}>
                    ₹{selectedInvoice.due_amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Form.Item
            label="Payment Amount (₹)"
            name="amount"
            rules={[
              { required: true, message: 'Please input payment amount!' },
              {
                validator: (_, value) => {
                  if (selectedInvoice && value > selectedInvoice.due_amount) {
                    return Promise.reject('Payment cannot exceed due amount');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber
              min={0}
              max={selectedInvoice?.due_amount}
              step={0.01}
              style={{ width: '100%' }}
              placeholder="Enter amount"
              data-testid="payment-amount-input"
            />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
          >
            <Input.TextArea rows={2} placeholder="Optional notes" data-testid="payment-notes-input" />
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
                data-testid="submit-payment-button"
              >
                Record Payment
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Payments;