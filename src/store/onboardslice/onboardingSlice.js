import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import {fetchOnboardingData, submitApplication} from './onboardingthunks';


const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    formData: {},
    onboardingStatus: 'Not Started',
    loading: false,
    error: null
  },

  reducers: {
   resetOnboardingState: (state) => {
      state.formData = {};
      state.onboardingStatus = 'Not Started';
      state.loading = false;
      state.error = null;
    }
  },
  //handle if our backend request is successfull or not
  extraReducers:(builder)=>{
    builder
      .addCase(fetchOnboardingData.pending, (state)=>{
        state.loading = true;
      })
      .addCase(fetchOnboardingData.fulfilled, (state,action)=>{
        state.loading = false;
        state.formData = action.payload.formData;
        state.onboardingStatus = action.payload.onboardingStatus;
      })
      .addCase(fetchOnboardingData.rejected, (state,action) =>{
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.formData = action.payload.formData;
        state.onboardingStatus = action.payload.onboardingStatus; 
      })
    }
});
export const { resetOnboardingState } = onboardingSlice.actions;
export default onboardingSlice.reducer;