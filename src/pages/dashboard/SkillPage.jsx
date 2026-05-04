import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getSkillsApi, createSkillApi, updateSkillApi, deleteSkillApi } from '../../api/skillApi';
import dayjs from 'dayjs';

function SkillPage() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    
    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [form] = Form.useForm();

    const fetchSkills = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const res = await getSkillsApi(page, pageSize);
            if (res.data && res.data.data) {
                const { result, meta } = res.data.data;
                setSkills(result);
                setPagination({
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total
                });
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch skills');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills(pagination.current, pagination.pageSize);
    }, []);

    const handleTableChange = (newPagination) => {
        fetchSkills(newPagination.current, newPagination.pageSize);
    };

    const handleAdd = () => {
        setEditingSkill(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingSkill(record);
        form.setFieldsValue({
            name: record.name,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteSkillApi(id);
            message.success('Deleted successfully');
            fetchSkills(pagination.current, pagination.pageSize);
        } catch (error) {
            message.error('Failed to delete skill');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            
            if (editingSkill) {
                await updateSkillApi({ ...values, id: editingSkill.id });
                message.success('Updated successfully');
            } else {
                await createSkillApi(values);
                message.success('Created successfully');
            }
            setIsModalVisible(false);
            fetchSkills(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error(error);
            message.error(error?.response?.data?.message || 'Validation failed or API error');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Skill Name', dataIndex: 'name', key: 'name' },
        { 
            title: 'Created At', 
            dataIndex: 'createdAt', 
            key: 'createdAt',
            render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : ''
        },
        { 
            title: 'Updated At', 
            dataIndex: 'updatedAt', 
            key: 'updatedAt',
            render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : ''
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Are you sure to delete this skill?"
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
                <h2>Manage Skills</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add New Skill
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={skills}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
            />

            <Modal
                title={editingSkill ? "Edit Skill" : "Add New Skill"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Skill Name" rules={[{ required: true, message: 'Please input skill name!' }]}>
                        <Input placeholder="e.g. React.js, Java, Python..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default SkillPage;
