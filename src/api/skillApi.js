import axiosClient from './axiosClient';

export const getSkillsApi = (current = 1, pageSize = 100) => {
    // We use a large pageSize by default to load all skills into the dropdown
    let url = `/api/v1/skills?page=${current}&size=${pageSize}`;
    return axiosClient.get(url);
};
