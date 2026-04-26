import { Link, useNavigate } from 'react-router-dom';
import { Button, Layout, Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../components/context/AuthContext';

const { Header, Content, Footer } = Layout;

function PublicLayout({ children }) {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const dropdownItems = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            onClick: () => navigate('/dashboard'),
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
            <Header
                className="glass-effect"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 50px',
                    height: '80px',
                    background: 'var(--glass-bg)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <h2 className="text-gradient" style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>JobHunter</h2>
                    </Link>
                    <Menu
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{ borderBottom: 'none', background: 'transparent', width: '300px', fontSize: '16px', fontWeight: 500 }}
                        items={[
                            { key: '1', label: <Link to="/">Home</Link> },
                            { key: '2', label: <Link to="/jobs">Jobs</Link> },
                            { key: '3', label: <Link to="/companies">Companies</Link> }
                        ]}
                    />
                </div>
                <div>
                    {isAuthenticated && user ? (
                        <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <Avatar icon={<UserOutlined />} style={{ backgroundColor: 'var(--primary)' }} />
                                <span style={{ fontWeight: 500 }}>{user.name || 'User'}</span>
                            </div>
                        </Dropdown>
                    ) : (
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Button type="text" style={{ fontWeight: 600 }} onClick={() => navigate('/login')}>Login</Button>
                            <Button type="primary" onClick={() => navigate('/register')}>Sign Up</Button>
                        </div>
                    )}
                </div>
            </Header>
            <Content style={{ padding: '0', flex: 1 }}>
                {children}
            </Content>
            <Footer style={{ textAlign: 'center', background: '#ffffff', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)', padding: '40px 50px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h3 className="text-gradient" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>JobHunter</h3>
                        <p>Find your dream job with ease.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <div style={{ textAlign: 'left' }}>
                            <h4 style={{ fontWeight: 600, marginBottom: '16px', color: 'var(--text-dark)' }}>Platform</h4>
                            <p style={{ margin: '8px 0', cursor: 'pointer' }}>Browse Jobs</p>
                            <p style={{ margin: '8px 0', cursor: 'pointer' }}>Browse Companies</p>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h4 style={{ fontWeight: 600, marginBottom: '16px', color: 'var(--text-dark)' }}>Support</h4>
                            <p style={{ margin: '8px 0', cursor: 'pointer' }}>Contact Us</p>
                            <p style={{ margin: '8px 0', cursor: 'pointer' }}>FAQ</p>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                    JobHunter ©{new Date().getFullYear()} Created by Hainam
                </div>
            </Footer>
        </Layout>
    );
}

export default PublicLayout;