import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllAirlines,
  getAllAirlinesImg,
} from '../../services/airlineService';

// Create the thunk
export const getAirlines = createAsyncThunk('airline/getAirlines', async () => {
  const response = await getAllAirlines();
  return response.data;
});
// Create the thunk
export const getAirlinesImg = createAsyncThunk(
  'airline/getAirlinesImg',
  async () => {
    const response = await getAllAirlinesImg();
    return response.data;
  }
);

export const airlineSlice = createSlice({
  name: 'airline',
  initialState: {
    airlines: [],
    readLoading: false,
    error: false,
  },
  reducers: {
    setAirlines: (state, action) => {
      state.airlines = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getAirlines.fulfilled, (state, action) => {
      // Add user to the state array
      state.airlines = action.payload;
      state.readLoading = false;
      state.error = '';
    }),
      builder.addCase(getAirlines.pending, (state, action) => {
        state.readLoading = true;
      }),
      builder.addCase(getAirlines.rejected, (state, action) => {
        console.log('rejected ', action);
        state.readLoading = false;
        state.error = 'Server error';
      });
    builder.addCase(getAirlinesImg.fulfilled, (state, action) => {
      // Add user to the state array
      state.airlines = action.payload;
      state.readLoading = false;
      state.error = '';
    }),
      builder.addCase(getAirlinesImg.pending, (state, action) => {
        state.readLoading = true;
      }),
      builder.addCase(getAirlinesImg.rejected, (state, action) => {
        console.log('rejected ', action);
        state.readLoading = false;
        state.error = 'Server error';
      });
  },
});

// Action creators are generated for each case reducer function
export const { setAirlines } = airlineSlice.actions;

export default airlineSlice.reducer;
