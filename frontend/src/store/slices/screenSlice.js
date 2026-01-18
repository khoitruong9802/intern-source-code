import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllScreens as getAllScreensService,
  getScreens as getScreensService,
  createScreen as createScreenService,
  updateScreen as updateScreenService,
  deleteScreen as deleteScreenService,
  controlScreen as controlScreenService,
} from '../../services/screenService';

// Create the thunk
export const getScreens = createAsyncThunk(
  'screen/getScreens',
  async (data, { rejectWithValue }) => {
    try {
      const [page, pageSize] = data;
      const res = await getScreensService(page, pageSize);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const getAllScreens = createAsyncThunk(
  'screen/getAllScreens',
  async (data, { rejectWithValue }) => {
    try {
      const res = await getAllScreensService();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const createScreen = createAsyncThunk(
  'screen/createScreen',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createScreenService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const updateScreen = createAsyncThunk(
  'screen/updateScreen',
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateScreenService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const deleteScreen = createAsyncThunk(
  'screen/deleteScreen',
  async (data, { rejectWithValue }) => {
    try {
      const res = await deleteScreenService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Create the thunk
export const controlScreen = createAsyncThunk(
  'screen/controlScreen',
  async (data, { rejectWithValue }) => {
    try {
      const res = await controlScreenService(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  screens: [],
  selectedScreen: [],
  totalScreen: 0,
  readLoading: false,
  createLoading: false,
  updateLoading: false,
  controlLoading: false,
  error: '',
  currentPage: 1,
  editId: 0,
  controlId: 0,
};

export const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    resetState: (state) => {
      return initialState;
    },
    setSelectedScreen: (state, action) => {
      state.selectedScreen = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setEditId: (state, action) => {
      state.editId = action.payload;
    },
    setControlId: (state, action) => {
      state.controlId = action.payload;
    },
    setScreenStatus: (state, action) => {
      const statusMap = new Map(
        action.payload.map(({ id, status }) => [id, status])
      );
      state.screens = state.screens.map((screen) => {
        const status = statusMap.get(screen.id);
        return {
          ...screen,
          status: status !== undefined ? status : -1, // default -1
        };
      });
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getAllScreens.fulfilled, (state, action) => {
      // Add user to the state array
      state.screens = action.payload;
      state.readLoading = false;
      state.error = '';
    }),
      builder.addCase(getAllScreens.pending, (state, action) => {
        state.readLoading = true;
      }),
      builder.addCase(getAllScreens.rejected, (state, action) => {
        console.log('rejected ', action);
        state.readLoading = false;
        state.error = 'Server error';
      });
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getScreens.fulfilled, (state, action) => {
      // Add user to the state array
      state.screens = action.payload.data.map((item) => ({
        ...item,
        status: -1,
      }));
      state.totalScreen = action.payload.totalCount;
      state.readLoading = false;
      state.error = '';
    }),
      builder.addCase(getScreens.pending, (state, action) => {
        state.readLoading = true;
      }),
      builder.addCase(getScreens.rejected, (state, action) => {
        console.log('rejected ', action);
        state.readLoading = false;
        state.error = 'Server error';
      });

    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(createScreen.fulfilled, (state, action) => {
      // Add user to the state array

      // state.screens = action.payload.data
      // state.totalScreen = action.payload.totalCount;
      state.createLoading = false;
      state.currentPage = 1;
    }),
      builder.addCase(createScreen.pending, (state, action) => {
        state.createLoading = true;
      }),
      builder.addCase(createScreen.rejected, (state, action) => {
        console.log('rejected ', action);
        state.createLoading = false;
      });

    builder.addCase(updateScreen.fulfilled, (state, action) => {
      // Add user to the state array
      state.updateLoading = false;
      state.currentPage = 1;
    }),
      builder.addCase(updateScreen.pending, (state, action) => {
        state.updateLoading = true;
      }),
      builder.addCase(updateScreen.rejected, (state, action) => {
        console.log('rejected ', action);
        state.updateLoading = false;
      });

    builder.addCase(deleteScreen.fulfilled, (state, action) => {
      // Add user to the state array

      // state.screens = action.payload.data
      // state.totalScreen = action.payload.totalCount;
      state.currentPage = 1;
    }),
      builder.addCase(deleteScreen.pending, (state, action) => {}),
      builder.addCase(deleteScreen.rejected, (state, action) => {
        console.log('rejected ', action);
      });

    builder.addCase(controlScreen.fulfilled, (state, action) => {
      // Add user to the state array
      state.controlLoading = false;
    }),
      builder.addCase(controlScreen.pending, (state, action) => {
        state.controlLoading = true;
      }),
      builder.addCase(controlScreen.rejected, (state, action) => {
        console.log('rejected ', action);
        state.controlLoading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  resetState,
  setSelectedScreen,
  setCurrentPage,
  setEditId,
  setControlId,
  setScreenStatus,
} = screenSlice.actions;

export default screenSlice.reducer;
