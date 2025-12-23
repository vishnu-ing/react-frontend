import axiosInstance from './auth.interceptor';

export const fetchPersonalInfo = () => {
    return axiosInstance.get(`/personal-info/user`);
}

export const updatePersonInfo = ( body) => {
    return axiosInstance.put(`/personal-info/user`, body)

}

export const uploadProfilePicture = (file) => {
    const form = new FormData();
    form.append('file', file);
    return axiosInstance.post('/upload/profile-picture', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}
