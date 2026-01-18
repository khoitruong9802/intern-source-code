import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFlights as getFlightsService,
  deleteFlight as deleteFlightService,
  createFlight as createFlightService,
  updateFlight as updateFlightService,
} from '../../services/flightService';

// Create the thunk
export const getFlights = createAsyncThunk(
  'flight/getFlights',
  async (data, { rejectWithValue }) => {
    try {
      const [page, pageSize] = data;
      const res = await getFlightsService(page, pageSize);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const createFlight = createAsyncThunk(
  'flight/createFlight',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createFlightService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const updateFlight = createAsyncThunk(
  'flight/updateFlight',
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateFlightService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const deleteFlight = createAsyncThunk(
  'flight/deleteFlight',
  async (data, { rejectWithValue }) => {
    try {
      const res = await deleteFlightService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  flights: [],
  totalFlight: 0,
  readLoading: false,
  createLoading: false,
  updateLoading: false,
  error: '',
  currentPage: 1,
  editId: 0,
};

export const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    resetState: (state) => {
      return initialState;
    },
    setFlights: (state, action) => {
      state.flights = action.payload.data;
      state.totalFlight = action.payload.totalCount;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setEditId: (state, action) => {
      state.editId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getFlights.fulfilled, (state, action) => {
      // Add user to the state array
      state.flights = action.payload.data;
      state.totalFlight = action.payload.totalCount;
      state.readLoading = false;
      state.error = '';
    }),
      builder.addCase(getFlights.pending, (state, action) => {
        state.readLoading = true;
      }),
      builder.addCase(getFlights.rejected, (state, action) => {
        console.log('rejected ', action);
        state.readLoading = false;
        state.error = 'Server error';
      });

    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(createFlight.fulfilled, (state, action) => {
      // Add user to the state array

      // state.flights = action.payload.data
      // state.totalFlight = action.payload.totalCount;
      state.createLoading = false;
      state.currentPage = 1;
    }),
      builder.addCase(createFlight.pending, (state, action) => {
        state.createLoading = true;
      }),
      builder.addCase(createFlight.rejected, (state, action) => {
        console.log('rejected ', action);
        state.createLoading = false;
      });

    builder.addCase(updateFlight.fulfilled, (state, action) => {
      // Add user to the state array
      state.updateLoading = false;
      state.currentPage = 1;
    }),
      builder.addCase(updateFlight.pending, (state, action) => {
        state.updateLoading = true;
      }),
      builder.addCase(updateFlight.rejected, (state, action) => {
        console.log('rejected ', action);
        state.updateLoading = false;
      });

    builder.addCase(deleteFlight.fulfilled, (state, action) => {
      // Add user to the state array

      // state.flights = action.payload.data
      // state.totalFlight = action.payload.totalCount;
      state.currentPage = 1;
    }),
      builder.addCase(deleteFlight.pending, (state, action) => {}),
      builder.addCase(deleteFlight.rejected, (state, action) => {
        console.log('rejected ', action);
      });
  },
});

// Action creators are generated for each case reducer function
export const { setFlights, setCurrentPage, setEditId, resetState } =
  flightSlice.actions;

export default flightSlice.reducer;
