import { createContext, useContext, useEffect, useState } from 'react'
import { getAccountApi } from '../../api/authApi'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Khôi phục phiên đăng nhập khi load trang
    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem('token')
            if (token && token !== 'undefined' && token !== 'null') {
                try {
                    const res = await getAccountApi()
                    if (res?.data?.data?.user) {
                        setUser(res.data.data.user)
                        setIsAuthenticated(true)
                    } else {
                        // Token có thể không hợp lệ nữa
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                    }
                } catch (error) {
                    console.error('Error fetching account:', error)
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                }
            }
            setIsLoading(false)
        }

        fetchAccount()
    }, [])

    const login = (userData, token) => {
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
