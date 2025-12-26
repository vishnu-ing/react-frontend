import axiosInstance from './auth.interceptor';

export const fetchPersonalInfo = () => {
    return axiosInstance.get(`/personal-info/user`);
}

export const updatePersonInfo = (body) => {
    return axiosInstance.put(`/personal-info/user`, body)

}

export const uploadProfilePicture = (file) => {
    const form = new FormData();
    form.append('file', file);
    return axiosInstance.post('/upload/profile-picture', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export const uploadDriverLicense = (file) => {
    const form = new FormData();
    form.append('file', file);
    return axiosInstance.post('/upload/driver-license', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export const fetchVisaDocs = () => {
    return axiosInstance.get('/visa');
}

export const uploadVisaDocument = (file, type, startDate = '', endDate = '') => {
    const form = new FormData();
    form.append('file', file);
    form.append('type', type);
    form.append('startDate', startDate);
    form.append('endDate', endDate);
    return axiosInstance.post('/visa/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}
