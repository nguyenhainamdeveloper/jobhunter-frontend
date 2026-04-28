import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getCompaniesApi, createCompanyApi, updateCompanyApi, deleteCompanyApi } from '../../api/companyApi';

function CompanyPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    
    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [form] = Form.useForm();

    const fetchCompanies = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            // Note: Spring Data JPA usually expects page=0 for the first page, but we'll try current page first
            // If the backend returns page 1 instead of 0 for the first page, we adjust here.
            // Let's assume 1-based indexing for now, or adapt if API requires 0-based.
            const res = await getCompaniesApi(page, pageSize);
            if (res.data && res.data.data) {
                const { result, meta } = res.data.data;
                setCompanies(result);
                setPagination({
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total
                });
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies(pagination.current, pagination.pageSize);
    }, []);

    const handleTableChange = (newPagination) => {
        fetchCompanies(newPagination.current, newPagination.pageSize);
    };

    const handleAdd = () => {
        setEditingCompany(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingCompany(record);
        form.setFieldsValue({
            name: record.name,
            address: record.address,
            description: record.description,
            logo: record.logo
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteCompanyApi(id);
            message.success('Deleted successfully');
            fetchCompanies(pagination.current, pagination.pageSize);
        } catch (error) {
            message.error('Failed to delete company');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingCompany) {
                await updateCompanyApi({ ...values, id: editingCompany.id });
                message.success('Updated successfully');
            } else {
                await createCompanyApi(values);
                message.success('Created successfully');
            }
            setIsModalVisible(false);
            fetchCompanies(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error(error);
            message.error('Validation failed or API error');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { 
            title: 'Logo', 
            dataIndex: 'logo', 
            key: 'logo', 
            render: (text) => {
                if (!text) return 'N/A';
                const imageUrl = text.startsWith('http') ? text : `http://localhost:8080/storage/company/${text}`;
                return <img src={imageUrl} alt="logo" style={{ height: 30, objectFit: 'contain' }}/>;
            }
        },
        { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', render: (text) => text ? new Date(text).toLocaleDateString() : 'N/A' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Are you sure to delete this company?"
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
                <h2>Manage Companies</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add New Company
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={companies}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
            />

            <Modal
                title={editingCompany ? "Edit Company" : "Add New Company"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Company Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Address">
                        <Input />
                    </Form.Item>
                    <Form.Item name="logo" label="Logo URL">
                        <Input placeholder="https://example.com/logo.png" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default CompanyPage;
