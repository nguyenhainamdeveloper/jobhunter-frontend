import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Switch, message, Popconfirm, DatePicker, Row, Col, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getJobsApi, createJobApi, updateJobApi, deleteJobApi } from '../../api/jobApi';
import { getCompaniesApi } from '../../api/companyApi';
import { getSkillsApi } from '../../api/skillApi';

const { Option } = Select;

function JobPage() {
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    
    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [form] = Form.useForm();

    const fetchJobs = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const res = await getJobsApi(page, pageSize);
            if (res.data && res.data.data) {
                const { result, meta } = res.data.data;
                setJobs(result);
                setPagination({
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total
                });
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    const fetchDependencies = async () => {
        try {
            const [compRes, skillRes] = await Promise.all([
                getCompaniesApi(1, 100),
                getSkillsApi(1, 100)
            ]);
            
            if (compRes?.data?.data?.result) {
                setCompanies(compRes.data.data.result);
            }
            if (skillRes?.data?.data?.result) {
                setSkills(skillRes.data.data.result);
            }
        } catch (error) {
            console.error('Failed to load companies or skills', error);
        }
    };

    useEffect(() => {
        fetchJobs(pagination.current, pagination.pageSize);
        fetchDependencies();
    }, []);

    const handleTableChange = (newPagination) => {
        fetchJobs(newPagination.current, newPagination.pageSize);
    };

    const handleAdd = () => {
        setEditingJob(null);
        form.resetFields();
        form.setFieldsValue({ active: true, quantity: 1, salary: 0 });
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingJob(record);
        form.setFieldsValue({
            name: record.name,
            location: record.location,
            salary: record.salary,
            quantity: record.quantity,
            level: record.level,
            description: record.description,
            active: record.active,
            company: record.company?.id,
            skills: record.skills?.map(s => s.id) || [],
            startDate: record.startDate ? dayjs(record.startDate) : null,
            endDate: record.endDate ? dayjs(record.endDate) : null,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteJobApi(id);
            message.success('Deleted successfully');
            fetchJobs(pagination.current, pagination.pageSize);
        } catch (error) {
            message.error('Failed to delete job');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            
            // Format payload to match Backend Entity associations
            const payload = {
                ...values,
                startDate: values.startDate ? values.startDate.toISOString() : null,
                endDate: values.endDate ? values.endDate.toISOString() : null,
                company: values.company ? { id: values.company } : null,
                skills: values.skills ? values.skills.map(id => ({ id })) : []
            };

            if (editingJob) {
                await updateJobApi({ ...payload, id: editingJob.id });
                message.success('Updated successfully');
            } else {
                await createJobApi(payload);
                message.success('Created successfully');
            }
            setIsModalVisible(false);
            fetchJobs(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error(error);
            message.error(error?.response?.data?.message || 'Validation failed or API error');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Company', key: 'company', render: (_, record) => record.company?.name || 'N/A' },
        { 
            title: 'Skills', 
            key: 'skills', 
            render: (_, record) => (
                <>
                    {record.skills?.map(skill => (
                        <Tag color="blue" key={skill.id} style={{ margin: '2px' }}>
                            {skill.name}
                        </Tag>
                    ))}
                </>
            )
        },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        { title: 'Level', dataIndex: 'level', key: 'level' },
        { title: 'Salary', dataIndex: 'salary', key: 'salary', render: (val) => `$${val}` },
        { 
            title: 'Active', 
            dataIndex: 'active', 
            key: 'active', 
            render: (val) => <Switch checked={val} disabled /> 
        },
        { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', render: (text) => text ? new Date(text).toLocaleDateString() : 'N/A' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Are you sure to delete this job?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Manage Jobs</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add New Job
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={jobs}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{ x: 1200 }}
            />

            <Modal
                title={editingJob ? "Edit Job" : "Add New Job"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Job Name" rules={[{ required: true }]}>
                                <Input placeholder="Backend Developer" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="company" label="Company" rules={[{ required: true }]}>
                                <Select placeholder="Select a company" showSearch filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}>
                                    {companies.map(c => (
                                        <Option key={c.id} value={c.id}>{c.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                                <Input placeholder="Hanoi, Vietnam" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="level" label="Level" rules={[{ required: true }]}>
                                <Select placeholder="Select level">
                                    <Option value="INTERN">INTERN</Option>
                                    <Option value="FRESHER">FRESHER</Option>
                                    <Option value="JUNIOR">JUNIOR</Option>
                                    <Option value="MIDDLE">MIDDLE</Option>
                                    <Option value="SENIOR">SENIOR</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="salary" label="Salary" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="active" label="Status" valuePropName="checked">
                                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="startDate" label="Start Date">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="endDate" label="End Date">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="skills" label="Skills">
                        <Select mode="multiple" placeholder="Select required skills">
                            {skills.map(s => (
                                <Option key={s.id} value={s.id}>{s.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} placeholder="Job description..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default JobPage;
