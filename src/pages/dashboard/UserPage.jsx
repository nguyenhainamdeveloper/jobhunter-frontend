import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Row, Col, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUsersApi, createUserApi, updateUserApi, deleteUserApi } from '../../api/userApi';
import { getCompaniesApi } from '../../api/companyApi';
import { getRolesApi } from '../../api/roleApi';

const { Option } = Select;

function UserPage() {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    
    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    const fetchUsers = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const res = await getUsersApi(page, pageSize);
            if (res.data && res.data.data) {
                const { result, meta } = res.data.data;
                setUsers(result);
                setPagination({
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total
                });
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const fetchDependencies = async () => {
        try {
            const [compRes, roleRes] = await Promise.all([
                getCompaniesApi(1, 100),
                getRolesApi(1, 100)
            ]);
            
            if (compRes?.data?.data?.result) {
                setCompanies(compRes.data.data.result);
            }
            if (roleRes?.data?.data?.result) {
                setRoles(roleRes.data.data.result);
            }
        } catch (error) {
            console.error('Failed to load companies or roles', error);
        }
    };

    useEffect(() => {
        fetchUsers(pagination.current, pagination.pageSize);
        fetchDependencies();
    }, []);

    const handleTableChange = (newPagination) => {
        fetchUsers(newPagination.current, newPagination.pageSize);
    };

    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingUser(record);
        form.setFieldsValue({
            name: record.name,
            email: record.email,
            age: record.age,
            gender: record.gender,
            address: record.address,
            role: record.role?.id,
            company: record.company?.id,
            // We usually don't populate password for editing
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteUserApi(id);
            message.success('Deleted successfully');
            fetchUsers(pagination.current, pagination.pageSize);
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            
            // Format payload to match Backend Entity associations
            const payload = {
                ...values,
                role: values.role ? { id: values.role } : null,
                company: values.company ? { id: values.company } : null,
            };

            if (editingUser) {
                await updateUserApi({ ...payload, id: editingUser.id });
                message.success('Updated successfully');
            } else {
                await createUserApi(payload);
                message.success('Created successfully');
            }
            setIsModalVisible(false);
            fetchUsers(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error(error);
            message.error(error?.response?.data?.message || 'Validation failed or API error');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { 
            title: 'Gender', 
            dataIndex: 'gender', 
            key: 'gender',
            render: (text) => {
                let color = 'default';
                if (text === 'MALE') color = 'blue';
                if (text === 'FEMALE') color = 'pink';
                return text ? <Tag color={color}>{text}</Tag> : 'N/A';
            }
        },
        { title: 'Role', key: 'role', render: (_, record) => record.role?.name ? <Tag color="purple">{record.role.name}</Tag> : 'N/A' },
        { title: 'Company', key: 'company', render: (_, record) => record.company?.name || 'N/A' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Are you sure to delete this user?"
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
                <h2>Manage Users</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add New User
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{ x: 1000 }}
            />

            <Modal
                title={editingUser ? "Edit User" : "Add New User"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                                <Input placeholder="John Doe" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                                <Input placeholder="john.doe@example.com" disabled={!!editingUser} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="password" label="Password" rules={[{ required: !editingUser }]}>
                                <Input.Password placeholder="Enter password" disabled={!!editingUser} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="age" label="Age">
                                <InputNumber min={1} max={100} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                                <Select placeholder="Select gender">
                                    <Option value="MALE">MALE</Option>
                                    <Option value="FEMALE">FEMALE</Option>
                                    <Option value="OTHER">OTHER</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                                <Select placeholder="Select a role">
                                    {roles.map(r => (
                                        <Option key={r.id} value={r.id}>{r.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="company" label="Company">
                                <Select placeholder="Select a company" allowClear showSearch filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}>
                                    {companies.map(c => (
                                        <Option key={c.id} value={c.id}>{c.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="address" label="Address">
                        <Input.TextArea rows={2} placeholder="User address..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default UserPage;
