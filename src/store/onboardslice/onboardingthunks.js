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
            const payload = {
                userName: submission.userName,
                ...submission.onboardingdata
            };
            const response = await axiosInstance.patch(`/onboarding/submit`, payload);    
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Submission failed');
        }
    }
);
