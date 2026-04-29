import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    BankOutlined,
    AppstoreOutlined,
    UserOutlined,
    FileTextOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const { Header, Sider, Content } = Layout;

function DashboardLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const dropdownItems = [
        {
            key: 'home',
            label: 'Home Page',
            onClick: () => navigate('/'),
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
                <div style={{ height: 64, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 style={{ margin: 0, color: 'var(--primary)', fontWeight: 800, fontSize: collapsed ? '16px' : '24px', transition: 'all 0.2s' }}>
                        {collapsed ? 'JH' : 'JobHunter'}
                    </h2>
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={[
                        {
                            key: '/dashboard',
                            icon: <DashboardOutlined />,
                            label: 'Dashboard',
                            onClick: () => navigate('/dashboard')
                        },
                        {
                            key: '/dashboard/company',
                            icon: <BankOutlined />,
                            label: 'Manage Companies',
                            onClick: () => navigate('/dashboard/company')
                        },
                        {
                            key: '/dashboard/job',
                            icon: <AppstoreOutlined />,
                            label: 'Manage Jobs',
                            onClick: () => navigate('/dashboard/job')
                        },
                        {
                            key: '/dashboard/user',
                            icon: <UserOutlined />,
                            label: 'Manage Users',
                            onClick: () => navigate('/dashboard/user')
                        },
                        {
                            key: '/dashboard/resume',
                            icon: <FileTextOutlined />,
                            label: 'Manage Resumes',
                            onClick: () => navigate('/dashboard/resume')
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64, marginLeft: -24 }}
                    />
                    <div>
                        <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <span style={{ fontWeight: 500 }}>{user?.name || 'Admin'}</span>
                                <Avatar icon={<UserOutlined />} style={{ backgroundColor: 'var(--primary)' }} />
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff', borderRadius: '8px' }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default DashboardLayout;