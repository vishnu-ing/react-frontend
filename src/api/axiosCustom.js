import axiosInstance from './auth.interceptor';

export const fetchPersonalInfo = (userId) => {
    console.log("userId: ", userId)
    return axiosInstance.get(`/api/personal-info/${userId}`);
}

export const updatePersonInfo = (userId, body) => {
    return axiosInstance.put(`/api/personal-info/${userId}`, body)

}