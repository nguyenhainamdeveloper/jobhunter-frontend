import axiosClient from './axiosClient';

export const getUsersApi = (current = 1, pageSize = 10, query = '') => {
    let url = `/api/v1/users?page=${current}&size=${pageSize}`;
    if (query) {
        url += `&filter=${encodeURIComponent(query)}`;
    }
    return axiosClient.get(url);
};

export const createUserApi = (data) => {
    return axiosClient.post('/api/v1/users', data);
};

export const updateUserApi = (data) => {
    return axiosClient.put('/api/v1/users', data);
};

export const deleteUserApi = (id) => {
    return axiosClient.delete(`/api/v1/users/${id}`);
};
