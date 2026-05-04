import axiosClient from './axiosClient';

export const getSkillsApi = (current = 1, pageSize = 100) => {
    // We use a large pageSize by default to load all skills into the dropdown
    let url = `/api/v1/skills?page=${current}&size=${pageSize}`;
    return axiosClient.get(url);
};

export const createSkillApi = (data) => {
    return axiosClient.post('/api/v1/skills', data);
};

export const updateSkillApi = (data) => {
    return axiosClient.put('/api/v1/skills', data);
};

export const deleteSkillApi = (id) => {
    return axiosClient.delete(`/api/v1/skills/${id}`);
};
