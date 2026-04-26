import { useEffect } from 'react';
import { Button, Row, Col, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import heroImg from '../../assets/hero.png';
import axiosClient from '../../api/axiosClient';

function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const testApi = async () => {
            try {
                const res = await axiosClient.get('/api/v1/jobs');
                console.log('API OK:', res);
            } catch (error) {
                console.error('API ERROR:', error);
            }
        };
        testApi();
    }, []);

    return (
        <div style={{ background: 'var(--bg-light)', minHeight: 'calc(100vh - 80px)' }}>
            {/* Hero Section */}
            <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
                <Row align="middle" gutter={[40, 40]}>
                    <Col xs={24} md={12}>
                        <h1 style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
                            Find Your <span className="text-gradient">Dream Job</span> Today
                        </h1>
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '500px', lineHeight: 1.6 }}>
                            Connect with top companies, discover new opportunities, and accelerate your career growth with JobHunter.
                        </p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Button 
                                type="primary" 
                                size="large" 
                                icon={<SearchOutlined />}
                                style={{ height: '50px', fontSize: '16px', borderRadius: '25px', padding: '0 32px' }}
                                onClick={() => navigate('/jobs')}
                            >
                                Browse Jobs
                            </Button>
                            <Button 
                                size="large" 
                                style={{ height: '50px', fontSize: '16px', borderRadius: '25px', padding: '0 32px' }}
                                onClick={() => navigate('/companies')}
                            >
                                View Companies
                            </Button>
                        </div>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                        <img 
                            src={heroImg} 
                            alt="Hero" 
                            className="animate-float"
                            style={{ maxWidth: '100%', height: 'auto', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}
                        />
                    </Col>
                </Row>
            </div>

            {/* Featured Section */}
            <div style={{ background: 'var(--bg-white)', padding: '80px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>How It Works</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Three simple steps to land your next great opportunity.</p>
                    </div>
                    
                    <Row gutter={[24, 24]}>
                        {[
                            { title: 'Create an Account', desc: 'Sign up and complete your profile to get started.' },
                            { title: 'Search for Jobs', desc: 'Browse through thousands of job listings across various industries.' },
                            { title: 'Apply & Get Hired', desc: 'Submit your application and connect with top employers.' }
                        ].map((step, index) => (
                            <Col xs={24} md={8} key={index}>
                                <Card 
                                    className="glass-effect"
                                    style={{ textAlign: 'center', borderRadius: '16px', border: '1px solid var(--glass-border)', height: '100%' }}
                                    bodyStyle={{ padding: '40px 24px' }}
                                >
                                    <div style={{ 
                                        width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', 
                                        color: 'var(--primary)', fontSize: '24px', display: 'flex', alignItems: 'center', 
                                        justifyContent: 'center', margin: '0 auto 24px', fontWeight: 'bold'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>{step.title}</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default HomePage;