
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Multiple background images for carousel
  const backgroundImages = [
    'https://images.unsplash.com/photo-1611758498818-bfdeec6dc3de?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dq=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1561851561-04ee3d324423?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1568871391149-449702439177?q=80&w=2116&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1761839257469-96c78a7c2dd3?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
      {/* Left side - Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Images with Transition */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${image})`,
              opacity: currentImageIndex === index ? 1 : 0,
              zIndex: currentImageIndex === index ? 1 : 0
            }}
          />
        ))}
        
        {/* Gradient Overlay */}
        <div className="" style={{ zIndex: 2 }} />
        
        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-lg text-center space-y-6">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                  <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>
                </svg>
              </div>
              <h1 className="text-5xl font-bold mb-4 tracking-tight">S. K Notebook InvoiceHub</h1>
              <p className="text-xl text-indigo-200">Streamline Your Notebook Manufacturing Business</p>
            </div>
            
            <div className="space-y-4 text-left bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Smart Inventory Management</h3>
                  <p className="text-indigo-200 text-sm">Track raw materials and finished products in real-time</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Automated Invoicing</h3>
                  <p className="text-indigo-200 text-sm">Generate professional invoices with just a few clicks</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Business Analytics</h3>
                  <p className="text-indigo-200 text-sm">Get insights into sales trends and performance metrics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentImageIndex === index 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">InvoiceHub</h1>
            <p className="text-gray-600">Notebook Manufacturing Management</p>
          </div>

          {/* Login Card */}
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-500">Please sign in to continue</p>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label={<span className="text-gray-700 font-medium">Email Address</span>}
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <div className="relative">
                  <Input 
                    prefix={
                      <div className="mr-2 flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50">
                        <Mail size={18} className="text-indigo-600" />
                      </div>
                    }
                    placeholder="admin@stationery.com" 
                    size="large"
                    data-testid="email-input"
                    className="rounded-xl border-gray-300 hover:border-indigo-400 focus:border-indigo-500"
                    style={{ 
                      height: '56px',
                      paddingLeft: '12px'
                    }}
                  />
                </div>
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 font-medium">Password</span>}
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <div className="relative">
                  <Input.Password 
                    prefix={
                      <div className="mr-2 flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50">
                        <Lock size={18} className="text-indigo-600" />
                      </div>
                    }
                    placeholder="Enter your password" 
                    size="large"
                    data-testid="password-input"
                    className="rounded-xl border-gray-300 hover:border-indigo-400 focus:border-indigo-500"
                    style={{ 
                      height: '56px',
                      paddingLeft: '12px'
                    }}
                  />
                </div>
              </Form.Item>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-sm text-gray-600">
                  <input type="checkbox" className="mr-2 rounded" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Forgot password?
                </a>
              </div>

              <Form.Item className="mb-0">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                  block
                  className="rounded-xl font-semibold text-base group"
                  style={{ 
                    background: 'linear-gradient(135deg, #312E81 0%, #4C1D95 100%)', 
                    borderColor: 'transparent',
                    height: '56px',
                    boxShadow: '0 4px 14px 0 rgba(49, 46, 129, 0.4)'
                  }}
                  data-testid="login-button"
                  icon={!loading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
                  iconPosition="end"
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            
          </div>

          {/* Footer */}
          <p className="text-center mt-6 text-sm text-gray-500">
            Don't have an account? 
            <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium ml-1">
              Contact Administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;