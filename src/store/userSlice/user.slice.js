import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPersonalInfo, updatePersonInfo } from "../../api/axiosCustom";

export const getPersonalInfoThunk = createAsyncThunk(
  "user/getPersonalInfo",
  async (_,{ rejectWithValue }) => {
    try {
      console.log("inside getpersonalinfothunk")
      const res = await fetchPersonalInfo();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updatePersonalInfoThunk = createAsyncThunk(
  "user/updatePersonalInfo",
  async ({ payload }, { rejectWithValue }) => {
    try {
      const res = await updatePersonInfo(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    personalInfo: null,
    loading: false,
    updating: false,
    error: null,
  },
  reducers: {resetUser: (state) => {
    state.personalInfo = null;
    state.loading = false;
    state.updating = false;
    state.error = null;
  },},
  extraReducers: (builder) => {
    builder
      .addCase(getPersonalInfoThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPersonalInfoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.personalInfo = action.payload;
      })
      .addCase(getPersonalInfoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePersonalInfoThunk.pending, (state) => {
        state.updating = true;
      })
      .addCase(updatePersonalInfoThunk.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updatePersonalInfoThunk.rejected, (state, action) => {
        state.updating = false;

        state.error = action.payload;

      });
  },
});


export default userSlice.reducer;

export const { resetUser } = userSlice.actions;
