import axiosClient from './axiosClient';

export const getJobsApi = (current = 1, pageSize = 10, query = '') => {
    let url = `/api/v1/jobs?page=${current}&size=${pageSize}`;
    if (query) {
        url += `&filter=${encodeURIComponent(query)}`;
    }
    return axiosClient.get(url);
};

export const createJobApi = (data) => {
    return axiosClient.post('/api/v1/jobs', data);
};

export const updateJobApi = (data) => {
    return axiosClient.put('/api/v1/jobs', data);
};

export const deleteJobApi = (id) => {
    return axiosClient.delete(`/api/v1/jobs/${id}`);
};

export const getJobByIdApi = (id) => {
    return axiosClient.get(`/api/v1/jobs/${id}`);
};

