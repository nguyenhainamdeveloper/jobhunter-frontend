import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Select, message, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { getResumesApi, updateResumeStatusApi, deleteResumeApi } from '../../api/resumeApi';
import dayjs from 'dayjs';

const { Option } = Select;

function ResumePage() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingResume, setEditingResume] = useState(null);
    const [form] = Form.useForm();

    const fetchResumes = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const res = await getResumesApi(page, pageSize);
            if (res.data && res.data.data) {
                const { result, meta } = res.data.data;
                setResumes(result);
                setPagination({
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total
                });
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch resumes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes(pagination.current, pagination.pageSize);
    }, []);

    const handleTableChange = (newPagination) => {
        fetchResumes(newPagination.current, newPagination.pageSize);
    };

    const handleEdit = (record) => {
        setEditingResume(record);
        form.setFieldsValue({
            status: record.status
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteResumeApi(id);
            message.success('Deleted successfully');
            fetchResumes(pagination.current, pagination.pageSize);
        } catch (error) {
            message.error('Failed to delete resume');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();

            await updateResumeStatusApi(editingResume.id, values.status);
            message.success('Status updated successfully');

            setIsModalVisible(false);
            fetchResumes(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error(error);
            message.error('Validation failed or API error');
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'PENDING':
                return <Tag color="gold">PENDING</Tag>;
            case 'REVIEWING':
                return <Tag color="blue">REVIEWING</Tag>;
            case 'APPROVED':
                return <Tag color="green">APPROVED</Tag>;
            case 'REJECTED':
                return <Tag color="red">REJECTED</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Candidate Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Job Applied',
            key: 'job',
            render: (_, record) => record.job?.name ? <b>{record.job.name}</b> : 'N/A'
        },
        {
            title: 'Company',
            dataIndex: 'companyName',
            key: 'companyName'
        },
        {
            title: 'CV Link',
            key: 'url',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    // Using backend route to access uploaded file
                    href={`http://localhost:8080/storage/resume/${record.url}`}
                    target="_blank"
                >
                    View CV
                </Button>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => getStatusTag(text)
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : ''
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Update Status
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this resume?"
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

    const handleCreateFakeData = async () => {
        try {
            // Import axiosClient để tự động đính kèm token và xử lý lỗi chuẩn xác
            const axiosClient = (await import('../../api/axiosClient')).default;

            // Gọi API bằng axios
            const jobRes = await axiosClient.get('/api/v1/jobs?page=1&size=1');
            const userRes = await axiosClient.get('/api/v1/users?page=1&size=1');

            // Với axios, dữ liệu được bọc trong res.data. Sau đó Backend bọc thêm 1 lớp data nữa
            // Nên truy cập đúng là: res.data.data.result
            const jobResult = jobRes.data?.data?.result;
            const userResult = userRes.data?.data?.result;

            if (!jobResult?.length || !userResult?.length) {
                message.error('Hệ thống không tìm thấy Job hoặc User nào trong Database!');
                return;
            }

            const validJobId = jobResult[0].id;
            const validUserId = userResult[0].id;

            const payload = {
                email: 'ungvien.test@gmail.com',
                url: '1716687538974-cv-cua-nam.pdf',
                status: 'PENDING',
                job: { id: validJobId },
                user: { id: validUserId }
            };

            const res = await axiosClient.post('/api/v1/resumes', payload);

            if (res.data?.statusCode === 201 || res.status === 201) {
                message.success(`Tạo thành công Resume cho Job ID=${validJobId} và User ID=${validUserId}`);
                fetchResumes(pagination.current, pagination.pageSize);
            } else {
                message.error('Lỗi khi lưu vào Database');
            }
        } catch (error) {
            console.error("Chi tiết lỗi:", error);
            // In ra message lỗi chính xác từ Backend nếu có
            message.error(error.response?.data?.message || 'Lỗi mạng hoặc CORS');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Manage Resumes</h2>
                <Button type="dashed" onClick={handleCreateFakeData}>
                    [Test] Tạo dữ liệu ảo
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={resumes}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{ x: 1000 }}
            />

            <Modal
                title="Update Resume Status"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Update"
            >
                <div style={{ marginBottom: 20 }}>
                    <p><b>Candidate:</b> {editingResume?.email}</p>
                    <p><b>Job:</b> {editingResume?.job?.name}</p>
                </div>

                <Form form={form} layout="vertical">
                    <Form.Item name="status" label="New Status" rules={[{ required: true }]}>
                        <Select placeholder="Select a new status">
                            <Option value="PENDING">PENDING</Option>
                            <Option value="REVIEWING">REVIEWING</Option>
                            <Option value="APPROVED">APPROVED</Option>
                            <Option value="REJECTED">REJECTED</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ResumePage;
