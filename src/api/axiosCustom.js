import axiosInstance from './auth.interceptor';

export const fetchPersonalInfo = () => {
    console.log("inside fetch")
    return axiosInstance.get(`/personal-info/user`);
}

export const updatePersonInfo = ( body) => {
    return axiosInstance.put(`/personal-info/user`, body)

}