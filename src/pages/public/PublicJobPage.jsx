import { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Tag, Pagination, Spin, Input } from 'antd';
import { EnvironmentOutlined, DollarOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getJobsApi } from '../../api/jobApi';

const { Title, Text } = Typography;
const { Search } = Input;

function PublicJobPage() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 9, total: 0 });
    const [searchText, setSearchText] = useState('');

    const fetchJobs = async (page = 1, pageSize = 9, query = '') => {
        setLoading(true);
        try {
            // Note: backend might need support for name~'query' in filter string for turkraft springfilter
            // Assuming filter parameter works if passed
            const res = await getJobsApi(page, pageSize, query ? `name~'${query}'` : '');
            if (res?.data?.data?.result) {
                const { result, meta } = res.data.data;
                setJobs(result);
                setPagination({
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total
                });
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(1, pagination.pageSize, searchText);
    }, []);

    const handleTableChange = (page, pageSize) => {
        fetchJobs(page, pageSize, searchText);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        fetchJobs(1, pagination.pageSize, value);
    };

    return (
        <div style={{ background: 'var(--bg-light)', minHeight: 'calc(100vh - 80px)', padding: '40px 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Title level={2} style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
                        Browse <span className="text-gradient">All Jobs</span>
                    </Title>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                        Discover your next career move. Search through thousands of job openings across various industries.
                    </p>
                </div>

                <div style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
                    <Search 
                        placeholder="Search jobs by title..." 
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
                            {jobs.length > 0 ? jobs.map(job => (
                                <Col xs={24} md={12} lg={8} key={job.id}>
                                    <Card 
                                        hoverable
                                        className="job-card glass-effect"
                                        style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px', border: '1px solid var(--glass-border)' }}
                                        bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '24px' }}
                                        onClick={() => navigate(`/job/${job.id}`)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                            <Title level={4} style={{ margin: 0, fontSize: '18px', color: 'var(--primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {job.name}
                                            </Title>
                                        </div>
                                        
                                        <div style={{ marginBottom: '16px' }}>
                                            <Text strong style={{ fontSize: '16px' }}>{job.company?.name || 'Unknown Company'}</Text>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                                                <DollarOutlined style={{ marginRight: '8px', color: '#10b981' }} />
                                                <Text type="secondary" style={{ fontWeight: 500 }}>${job.salary?.toLocaleString()}</Text>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                                                <EnvironmentOutlined style={{ marginRight: '8px', color: '#f43f5e' }} />
                                                <Text type="secondary">{job.location}</Text>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 'auto' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {job.skills?.slice(0, 3).map(skill => (
                                                    <Tag key={skill.id} color="blue" style={{ borderRadius: '4px' }}>{skill.name}</Tag>
                                                ))}
                                                {job.skills?.length > 3 && (
                                                    <Tag color="default" style={{ borderRadius: '4px' }}>+{job.skills.length - 3}</Tag>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            )) : (
                                <Col span={24} style={{ textAlign: 'center', padding: '50px 0' }}>
                                    <Text type="secondary" style={{ fontSize: '16px' }}>No jobs found matching your search.</Text>
                                </Col>
                            )}
                        </Row>

                        {jobs.length > 0 && (
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

export default PublicJobPage;
