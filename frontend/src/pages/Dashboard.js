import React, { useState, useEffect } from 'react';
import { Card, Statistic, Table, Tag, message } from 'antd';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axios';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard');
      setStats(response.data);
    } catch (error) {
      message.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const invoiceColumns = [
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
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => `₹${amount.toFixed(2)}`,
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
    },
  ];

  const productColumns = [
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Stock',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
      render: (stock) => (
        <span className="font-medium" style={{ color: stock < 5 ? '#EF4444' : '#312E81' }}>
          {stock} units
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg" style={{ color: '#312E81' }}>Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-4xl font-bold mb-2" style={{ color: '#312E81' }} data-testid="dashboard-title">Dashboard</h1>
          <p className="text-muted" style={{ color: '#9CA3AF' }}>Overview of your business</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card" style={{ borderRadius: '6px', borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-2" style={{ color: '#9CA3AF' }}>Today's Sales</p>
                <p className="font-heading text-2xl font-bold" style={{ color: '#312E81' }} data-testid="today-sales">
                  ₹{stats?.total_sales_today?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: '#F0F9FF' }}>
                <TrendingUp size={24} style={{ color: '#0EA5E9' }} />
              </div>
            </div>
          </Card>

          <Card className="shadow-card" style={{ borderRadius: '6px', borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-2" style={{ color: '#9CA3AF' }}>Monthly Sales</p>
                <p className="font-heading text-2xl font-bold" style={{ color: '#312E81' }} data-testid="monthly-sales">
                  ₹{stats?.total_sales_month?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: '#F0FDF4' }}>
                <DollarSign size={24} style={{ color: '#10B981' }} />
              </div>
            </div>
          </Card>

          <Card className="shadow-card" style={{ borderRadius: '6px', borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-2" style={{ color: '#9CA3AF' }}>Outstanding Dues</p>
                <p className="font-heading text-2xl font-bold" style={{ color: '#EF4444' }} data-testid="outstanding-dues">
                  ₹{stats?.total_outstanding_dues?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: '#FEF2F2' }}>
                <AlertTriangle size={24} style={{ color: '#EF4444' }} />
              </div>
            </div>
          </Card>

          <Card className="shadow-card" style={{ borderRadius: '6px', borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-2" style={{ color: '#9CA3AF' }}>Total Retailers</p>
                <p className="font-heading text-2xl font-bold" style={{ color: '#312E81' }} data-testid="total-retailers">
                  {stats?.total_retailers || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: '#FAF5FF' }}>
                <Users size={24} style={{ color: '#312E81' }} />
              </div>
            </div>
          </Card>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Invoices */}
          <Card 
            title={
              <div className="flex items-center gap-2">
                <FileText size={20} style={{ color: '#312E81' }} />
                <span className="font-heading font-semibold" style={{ color: '#312E81' }}>Recent Invoices</span>
              </div>
            }
            className="shadow-card" 
            style={{ borderRadius: '6px', borderColor: '#E5E7EB' }}
          >
            <Table 
              dataSource={stats?.recent_invoices || []} 
              columns={invoiceColumns} 
              pagination={false}
              rowKey="id"
              size="small"
            />
          </Card>

          {/* Low Stock Products */}
          <Card 
            title={
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} style={{ color: '#EF4444' }} />
                <span className="font-heading font-semibold" style={{ color: '#312E81' }}>Low Stock Alert</span>
              </div>
            }
            className="shadow-card" 
            style={{ borderRadius: '6px', borderColor: '#E5E7EB' }}
          >
            {stats?.low_stock_products?.length > 0 ? (
              <Table 
                dataSource={stats?.low_stock_products || []} 
                columns={productColumns} 
                pagination={false}
                rowKey="id"
                size="small"
              />
            ) : (
              <div className="text-center py-8" style={{ color: '#9CA3AF' }}>
                All products are well stocked!
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;