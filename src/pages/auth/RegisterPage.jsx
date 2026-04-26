import { Button, Form, Input, InputNumber, Select, message } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { registerApi } from '../../api/authApi'

const { Option } = Select;

function RegisterPage() {
    const navigate = useNavigate()
    const [form] = Form.useForm()

    const onFinish = async (values) => {
        try {
            // The backend User model has: name, email, password, age, gender, address
            const res = await registerApi(values)
            
            if (res?.data?.statusCode === 201) {
                message.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.')
                navigate('/login')
            } else {
                message.error(res?.data?.message || 'Đăng ký thất bại')
            }
        } catch (error) {
            console.error('REGISTER FAIL:', error)
            message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi đăng ký')
        }
    }

    return (
        <div style={{ maxWidth: 500, margin: '60px auto', padding: '30px', background: 'var(--bg-white)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Tạo tài khoản mới</h2>
                <p style={{ color: 'var(--text-muted)' }}>Tham gia JobHunter để tìm kiếm cơ hội nghề nghiệp</p>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Họ và Tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                    <Input size="large" placeholder="Nguyễn Văn A" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input size="large" placeholder="email@example.com" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                >
                    <Input.Password size="large" placeholder="••••••••" />
                </Form.Item>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <Form.Item
                        label="Tuổi"
                        name="age"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
                    >
                        <InputNumber size="large" min={18} max={100} style={{ width: '100%' }} placeholder="22" />
                    </Form.Item>

                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    >
                        <Select size="large" placeholder="Chọn giới tính">
                            <Option value="MALE">Nam</Option>
                            <Option value="FEMALE">Nữ</Option>
                            <Option value="OTHER">Khác</Option>
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                    <Input size="large" placeholder="123 Đường ABC, Quận X, TP Y" />
                </Form.Item>

                <Button type="primary" htmlType="submit" size="large" block style={{ marginTop: '10px' }}>
                    Đăng Ký
                </Button>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Đã có tài khoản? </span>
                    <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>Đăng nhập ngay</Link>
                </div>
            </Form>
        </div>
    )
}

export default RegisterPage
