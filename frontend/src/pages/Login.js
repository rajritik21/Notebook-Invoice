import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div 
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1578311639859-c8679fccd561?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
        }}
      >
        <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(49, 46, 129, 0.6)' }}>
          <div className="text-white text-center p-8">
            <h1 className="font-heading text-5xl font-bold mb-4">InvoiceHub</h1>
            <p className="text-xl">Manage your stationery business with ease</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ background: '#F9FAFB' }}>
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-default shadow-card" style={{ borderRadius: '6px' }}>
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl font-bold mb-2" style={{ color: '#312E81' }}>Welcome Back</h2>
              <p className="text-muted" style={{ color: '#9CA3AF' }}>Sign in to your account</p>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  prefix={<Mail size={16} style={{ color: '#9CA3AF' }} />}
                  placeholder="admin@stationery.com" 
                  size="large"
                  data-testid="email-input"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password 
                  prefix={<Lock size={16} style={{ color: '#9CA3AF' }} />}
                  placeholder="Enter your password" 
                  size="large"
                  data-testid="password-input"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                  block
                  style={{ 
                    background: '#312E81', 
                    borderColor: '#312E81',
                    borderRadius: '4px',
                    height: '48px',
                    fontWeight: '500'
                  }}
                  data-testid="login-button"
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <div className="mt-6 p-4 rounded" style={{ background: '#F3F4F6' }}>
              <p className="text-sm" style={{ color: '#1F2937' }}>
                <strong>Demo Credentials:</strong><br />
                Email: admin@stationery.com<br />
                Password: Admin@123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;