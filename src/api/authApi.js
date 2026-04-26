import axiosClient from './axiosClient'

export const loginApi = (data) => {
    return axiosClient.post('/api/v1/auth/login', data)
}

export const getAccountApi = () => {
    return axiosClient.get('/api/v1/auth/account')
}

export const logoutApi = () => {
    return axiosClient.post('/api/v1/auth/logout')
}