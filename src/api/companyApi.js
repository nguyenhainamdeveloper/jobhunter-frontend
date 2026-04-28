import axiosClient from './axiosClient';

export const getCompaniesApi = (current = 1, pageSize = 10, query = '') => {
    // Backend Spring Data JPA Pageable uses page index starting from 1 with com.turkraft.springfilter (usually standard, but let's send page and size)
    // Wait, spring filter default page is 1
    let url = `/api/v1/companies?page=${current}&size=${pageSize}`;
    if (query) {
        url += `&filter=${encodeURIComponent(query)}`;
    }
    return axiosClient.get(url);
};

export const createCompanyApi = (data) => {
    return axiosClient.post('/api/v1/companies', data);
};

export const updateCompanyApi = (data) => {
    return axiosClient.put('/api/v1/companies', data);
};

export const deleteCompanyApi = (id) => {
    return axiosClient.delete(`/api/v1/companies/${id}`);
};
