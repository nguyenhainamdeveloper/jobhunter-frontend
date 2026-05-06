import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Tag, Spin, Row, Col, Divider, Modal, Form, Upload, message, Input } from 'antd';
import { EnvironmentOutlined, DollarOutlined, CalendarOutlined, UploadOutlined, LeftOutlined } from '@ant-design/icons';
import { getJobByIdApi } from '../../api/jobApi';
import { uploadFileApi } from '../../api/fileApi';
import { createResumeApi } from '../../api/resumeApi';
import { useAuth } from '../../components/context/AuthContext';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

function PublicJobDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await getJobByIdApi(id);
                if (res?.data?.data) {
                    setJob(res.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch job:', error);
                message.error('Could not load job details.');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApplyClick = () => {
        if (!isAuthenticated) {
            message.warning('Please login to apply for this job.');
            navigate('/login');
            return;
        }
        form.setFieldsValue({ email: user?.email });
        setIsModalVisible(true);
    };

    const handleApplySubmit = async () => {
        try {
            const values = await form.validateFields();
            
            // Validate File
            if (!values.cv || values.cv.fileList.length === 0) {
                message.error('Please upload your CV');
                return;
            }

            setUploading(true);
            const fileToUpload = values.cv.fileList[0].originFileObj;

            // 1. Upload File
            const uploadRes = await uploadFileApi(fileToUpload, 'resume');
            
            if (uploadRes?.data?.data?.fileName) {
                const fileName = uploadRes.data.data.fileName;
                
                // 2. Submit Resume
                const resumePayload = {
                    email: values.email,
                    url: fileName,
                    status: 'PENDING',
                    job: { id: job.id },
                    // Assuming we might need to send user id depending on backend mapping, 
                    // though ResumeEntity usually infers createdBy from token, 
                    // passing user is safer if required by entity structure.
                };

                await createResumeApi(resumePayload);
                message.success('Application submitted successfully!');
                setIsModalVisible(false);
                form.resetFields();
            }
        } catch (error) {
            console.error('Apply Error:', error);
            message.error(error?.response?.data?.message || 'Failed to submit application.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0', minHeight: 'calc(100vh - 80px)' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!job) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0', minHeight: 'calc(100vh - 80px)' }}>
                <Title level={3}>Job not found</Title>
                <Button type="primary" onClick={() => navigate('/jobs')}>Back to Jobs</Button>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-light)', minHeight: 'calc(100vh - 80px)', padding: '40px 0' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <Button 
                    type="link" 
                    icon={<LeftOutlined />} 
                    onClick={() => navigate('/jobs')}
                    style={{ marginBottom: '20px', padding: 0 }}
                >
                    Back to all jobs
                </Button>

                <div className="glass-effect" style={{ padding: '40px', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <Title level={1} style={{ margin: '0 0 16px 0', color: 'var(--text-dark)', fontWeight: 800 }}>{job.name}</Title>
                            <Title level={3} style={{ margin: '0 0 24px 0', color: 'var(--primary)', fontWeight: 600 }}>{job.company?.name || 'Unknown Company'}</Title>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>
                                    <DollarOutlined style={{ marginRight: '8px', color: '#10b981', fontSize: '20px' }} />
                                    <Text strong>${job.salary?.toLocaleString()}</Text>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>
                                    <EnvironmentOutlined style={{ marginRight: '8px', color: '#f43f5e', fontSize: '20px' }} />
                                    <Text>{job.location}</Text>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>
                                    <CalendarOutlined style={{ marginRight: '8px', color: '#6366f1', fontSize: '20px' }} />
                                    <Text>{job.startDate ? dayjs(job.startDate).format('MMM DD, YYYY') : 'N/A'}</Text>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {job.skills?.map(skill => (
                                    <Tag key={skill.id} color="blue" style={{ padding: '4px 12px', fontSize: '14px', borderRadius: '20px' }}>
                                        {skill.name}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <Button 
                                type="primary" 
                                size="large" 
                                style={{ height: '54px', padding: '0 40px', fontSize: '18px', fontWeight: 600, borderRadius: '27px', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)' }}
                                onClick={handleApplyClick}
                            >
                                Apply Now
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="glass-effect" style={{ padding: '40px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <Title level={3} style={{ marginBottom: '24px' }}>Job Description</Title>
                    <div 
                        className="rich-text-content"
                        style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--text-dark)' }}
                        dangerouslySetInnerHTML={{ __html: job.description || 'No description provided.' }}
                    />
                </div>
            </div>

            {/* Apply Modal */}
            <Modal
                title={<Title level={3} style={{ margin: 0 }}>Apply for {job.name}</Title>}
                open={isModalVisible}
                onOk={handleApplySubmit}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={uploading}
                okText="Submit Application"
                cancelText="Cancel"
                width={600}
                centered
            >
                <div style={{ padding: '20px 0' }}>
                    <Paragraph style={{ fontSize: '16px', marginBottom: '24px', color: 'var(--text-muted)' }}>
                        You are applying for <Text strong>{job.name}</Text> at <Text strong>{job.company?.name}</Text>.
                    </Paragraph>
                    <Form form={form} layout="vertical">
                        <Form.Item 
                            name="email" 
                            label="Your Email" 
                            rules={[{ required: true, message: 'Please enter your email', type: 'email' }]}
                        >
                            <Input size="large" disabled />
                        </Form.Item>
                        <Form.Item 
                            name="cv" 
                            label="Upload CV (PDF, DOCX)" 
                            valuePropName="file"
                            rules={[{ required: true, message: 'Please upload your CV' }]}
                        >
                            <Upload 
                                maxCount={1}
                                beforeUpload={() => false} // Prevent auto upload
                                accept=".pdf,.doc,.docx"
                            >
                                <Button size="large" icon={<UploadOutlined />} style={{ width: '100%' }}>
                                    Click to Upload
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
}

export default PublicJobDetailPage;
