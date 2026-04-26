import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '../../api/authApi'
import { useAuth } from '../../components/context/AuthContext'

function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const onFinish = async (values) => {
        try {
            const res = await loginApi(values)

            console.log('LOGIN SUCCESS FULL:', res)
            console.log('TOKEN DEBUG:', res?.data?.data?.access_token)

            const token = res?.data?.data?.access_token
            const user = res?.data?.data?.user

            if (!token) {
                message.error('Không lấy được token từ response')
                return
            }

            // Sử dụng hàm login từ Context để cập nhật state global và localStorage
            login(user, token)

            message.success('Login success')
            navigate('/dashboard')
        } catch (error) {
            console.error('LOGIN FAIL:', error)
            message.error(error?.response?.data?.message || 'Login failed')
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '100px auto' }}>
            <h2>Login</h2>

            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please enter username' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter password' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    Login
                </Button>
            </Form>
        </div>
    )
}

export default LoginPage