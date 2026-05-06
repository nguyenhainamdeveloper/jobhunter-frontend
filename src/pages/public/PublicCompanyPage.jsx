import { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Pagination, Spin, Input } from 'antd';
import { EnvironmentOutlined, BankOutlined } from '@ant-design/icons';
import { getCompaniesApi } from '../../api/companyApi';

const { Title, Text } = Typography;
const { Search } = Input;

function PublicCompanyPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 9, total: 0 });
    const [searchText, setSearchText] = useState('');

    const fetchCompanies = async (page = 1, pageSize = 9, query = '') => {
        setLoading(true);
        try {
            const res = await getCompaniesApi(page, pageSize, query ? `name~'${query}'` : '');
            if (res?.data?.data?.result) {
                const { result, meta } = res.data.data;
                setCompanies(result);
                setPagination({
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total
                });
            }
        } catch (error) {
            console.error('Failed to fetch companies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies(1, pagination.pageSize, searchText);
    }, []);

    const handleTableChange = (page, pageSize) => {
        fetchCompanies(page, pageSize, searchText);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        fetchCompanies(1, pagination.pageSize, value);
    };

    return (
        <div style={{ background: 'var(--bg-light)', minHeight: 'calc(100vh - 80px)', padding: '40px 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Title level={2} style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
                        Top <span className="text-gradient">Companies</span>
                    </Title>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                        Explore leading companies hiring right now. Find the perfect workplace culture for your next career move.
                    </p>
                </div>

                <div style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
                    <Search 
                        placeholder="Search companies by name..." 
                        enterButton="Search" 
                        size="large" 
                        onSearch={handleSearch}
                        className="custom-search"
                        style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                    />
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        <Row gutter={[24, 24]}>
                            {companies.length > 0 ? companies.map(company => (
                                <Col xs={24} md={12} lg={8} key={company.id}>
                                    <Card 
                                        hoverable
                                        className="job-card glass-effect"
                                        style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px', border: '1px solid var(--glass-border)' }}
                                        bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '24px' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                            <div style={{ 
                                                width: '60px', height: '60px', borderRadius: '8px', 
                                                background: 'var(--bg-light)', border: '1px solid #eee', 
                                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                marginRight: '16px'
                                            }}>
                                                <BankOutlined style={{ fontSize: '28px', color: 'var(--primary)' }} />
                                            </div>
                                            <Title level={4} style={{ margin: 0, fontSize: '20px', color: 'var(--text-dark)' }}>
                                                {company.name}
                                            </Title>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                            <EnvironmentOutlined style={{ marginRight: '8px', color: '#f43f5e' }} />
                                            <Text type="secondary">{company.address || 'Address not provided'}</Text>
                                        </div>

                                        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                                            <div 
                                                style={{ 
                                                    display: '-webkit-box', 
                                                    WebkitLineClamp: 3, 
                                                    WebkitBoxOrient: 'vertical', 
                                                    overflow: 'hidden',
                                                    color: 'var(--text-muted)'
                                                }}
                                                dangerouslySetInnerHTML={{ __html: company.description || 'No description available for this company.' }}
                                            />
                                        </div>
                                    </Card>
                                </Col>
                            )) : (
                                <Col span={24} style={{ textAlign: 'center', padding: '50px 0' }}>
                                    <Text type="secondary" style={{ fontSize: '16px' }}>No companies found matching your search.</Text>
                                </Col>
                            )}
                        </Row>

                        {companies.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                                <Pagination 
                                    current={pagination.current} 
                                    pageSize={pagination.pageSize} 
                                    total={pagination.total} 
                                    onChange={handleTableChange} 
                                    showSizeChanger={false}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default PublicCompanyPage;
