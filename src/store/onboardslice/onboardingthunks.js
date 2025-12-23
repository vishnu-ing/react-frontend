import { createAsyncThunk } from "@reduxjs/toolkit";
import  axiosInstance from "../../api/auth.interceptor";

export const fetchOnboardingData = createAsyncThunk(
  'onboarding/fetchData',
  async (username, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/onboarding/${username}`);
      // hands data to reducer
      return response.data; 
    } 
    catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch data');
    }
  }
);

export const submitApplication = createAsyncThunk(
    'onboarding/submit',
    async (submission, { rejectWithValue }) => {
        try {
            const data = new FormData();
            data.append('userName', submission.userName);

            // loop formdata to handle nested objects and files
            Object.keys(submission.onboardingdata).forEach((key) => {
                const value = submission.onboardingdata[key];
                if (key === 'driverLicense') {
                    if (value instanceof File) {
                        data.append('licenseCopy', value);
                    }
                    return;
                }
                if (value instanceof File) {
                    data.append(key, value);
                } 
                else if (value && typeof value === 'object') {
                    data.append(key, JSON.stringify(value));
                } 
                else {
                    data.append(key, value || "");
                }
            });

            const response = await axiosInstance.patch(`/onboarding/submit`, data, {
                headers: { 'Content-Type': 'multipart/form-data' } //tells server we have files
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Submission failed');
        }
    }
);
