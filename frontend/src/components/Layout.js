import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  CreditCard, 
  LogOut,
  BookOpen
} from 'lucide-react';

const { Header, Content } = AntLayout;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, admin } = useAuth();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
    },
    {
      key: '/retailers',
      icon: <Users size={18} />,
      label: 'Retailers',
    },
    {
      key: '/products',
      icon: <Package size={18} />,
      label: 'Products',
    },
    {
      key: '/invoices',
      icon: <FileText size={18} />,
      label: 'Invoices',
    },
    {
      key: '/payments',
      icon: <CreditCard size={18} />,
      label: 'Payments',
    },
  ];

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AntLayout className="min-h-screen">
      <Header className="flex items-center justify-between px-8" style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="flex items-center gap-3">
          <BookOpen size={32} className="text-primary" style={{ color: '#312E81' }} />
          <span className="font-heading text-2xl font-bold" style={{ color: '#312E81' }}>S K NoteBook</span>
        </div>
        
        <div className="flex items-center gap-8">
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className="border-0 flex-1"
            style={{ background: 'transparent', minWidth: '500px' }}
          />
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted" style={{ color: '#9CA3AF' }}>Welcome, {admin?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-button hover:opacity-90 transition-opacity"
              style={{ background: '#312E81', borderRadius: '4px' }}
              data-testid="logout-button"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </Header>
      
      <Content className="p-8" style={{ background: '#F9FAFB' }}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout;