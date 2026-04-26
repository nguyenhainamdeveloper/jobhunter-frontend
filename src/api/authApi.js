import axiosClient from './axiosClient'

export const loginApi = (data) => {
    return axiosClient.post('/api/v1/auth/login', data)
}