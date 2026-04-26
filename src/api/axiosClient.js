import axios from 'axios'

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    const isLoginApi = config.url?.includes('/api/v1/auth/login')

    if (!isLoginApi && token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default axiosClient