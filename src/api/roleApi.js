import axiosClient from './axiosClient';

export const getRolesApi = (current = 1, pageSize = 100) => {
    let url = `/api/v1/roles?page=${current}&size=${pageSize}`;
    return axiosClient.get(url);
};
