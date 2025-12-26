import axiosInstance from './auth.interceptor';
import uploadService from './uploadService';

export const fetchPersonalInfo = () => {
    return axiosInstance.get(`/personal-info/user`);
};

export const updatePersonInfo = (body) => {
    return axiosInstance.put(`/personal-info/user`, body);
};

// keep these wrappers but delegate to uploadService so uploads are normalized
export const uploadProfilePicture = (file) => {
    return uploadService.uploadProfilePicture(file);
};

export const uploadDriverLicense = (file) => {
    return uploadService.uploadDriverLicense(file);
};

export const fetchVisaDocs = () => {
    return axiosInstance.get('/visa');
};

export const uploadVisaDocument = (file, type, startDate = '', endDate = '') => {
    return uploadService.uploadVisaDocument(file, type, startDate, endDate);
};
