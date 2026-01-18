import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getSettings as getSettingsService,
  updateSetting as updateSettingService,
  deleteSetting as deleteSettingService,
} from '../../services/settingService';

// Create the thunk
export const getSettings = createAsyncThunk(
  'setting/getSettings',
  async (data, { rejectWithValue }) => {
    try {
      const res = await getSettingsService();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const updateSetting = createAsyncThunk(
  'setting/updateSetting',
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateSettingService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const deleteSetting = createAsyncThunk(
  'setting/deleteSetting',
  async (data, { rejectWithValue }) => {
    try {
      const res = await deleteSettingService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  settings: {
    screenInterval: 0,
  },
  readLoading: false,
  updateLoading: false,
  error: '',
};

export const settingSlice = createSlice({
  name: 'liveMessage',
  initialState,
  reducers: {
    resetState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getSettings.fulfilled, (state, action) => {
      // Add user to the state array
      state.settings = action.payload;
      state.readLoading = false;
      state.error = '';
    }),
      builder.addCase(getSettings.pending, (state, action) => {
        state.readLoading = true;
      }),
      builder.addCase(getSettings.rejected, (state, action) => {
        console.log('rejected ', action);
        state.readLoading = false;
        state.error = 'Server error';
      });
    builder.addCase(updateSetting.fulfilled, (state, action) => {
      // Add user to the state array
      state.settings = action.payload;
      state.updateLoading = false;
      state.currentPage = 1;
    }),
      builder.addCase(updateSetting.pending, (state, action) => {
        state.updateLoading = true;
      }),
      builder.addCase(updateSetting.rejected, (state, action) => {
        console.log('rejected ', action);
        state.updateLoading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const { resetState } = settingSlice.actions;

export default settingSlice.reducer;
