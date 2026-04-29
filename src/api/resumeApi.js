import axiosClient from './axiosClient';

export const getResumesApi = (current = 1, pageSize = 10, query = '') => {
    let url = `/api/v1/resumes?page=${current}&size=${pageSize}`;
    if (query) {
        url += `&filter=${encodeURIComponent(query)}`;
    }
    return axiosClient.get(url);
};

// Admin only needs to update status
export const updateResumeStatusApi = (id, status) => {
    return axiosClient.put('/api/v1/resumes', { id, status });
};

export const deleteResumeApi = (id) => {
    return axiosClient.delete(`/api/v1/resumes/${id}`);
};
