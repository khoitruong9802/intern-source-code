import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllAirports } from '../../services/airportService';

// Create the thunk
export const getAirports = createAsyncThunk('airport/getAirports', async () => {
  const response = await getAllAirports();
  return response.data;
});

export const airportSlice = createSlice({
  name: 'airport',
  initialState: {
    airports: [],
    isLoading: false,
    isError: false,
  },
  reducers: {
    setAirports: (state, action) => {
      state.airports = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getAirports.fulfilled, (state, action) => {
      // Add user to the state array
      state.airports = action.payload;
      state.isLoading = false;
    }),
      builder.addCase(getAirports.pending, (state, action) => {
        state.isLoading = true;
      }),
      builder.addCase(getAirports.rejected, (state, action) => {
        console.log('rejected ', action);
        state.isLoading = false;
        state.isError = true;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setAirports } = airportSlice.actions;

export default airportSlice.reducer;
