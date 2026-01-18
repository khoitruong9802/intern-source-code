import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkIsAuth as checkIsAuthService } from '../../services/authService';

// Create the thunk
export const checkIsAuth = createAsyncThunk(
  'auth/checkIsAuth',
  async (data, { rejectWithValue }) => {
    try {
      const res = await checkIsAuthService();
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        return rejectWithValue('Not logged');
      } else {
        return rejectWithValue('Server error');
      }
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuth: true,
    isLoading: true,
    error: '',
  },
  reducers: {
    login: (state) => {
      state.isAuth = true;
    },
    logout: (state) => {
      state.isAuth = false;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(checkIsAuth.fulfilled, (state, action) => {
      // Add user to the state array
      state.isAuth = true;
      state.isLoading = false;
      state.error = '';
    }),
      builder.addCase(checkIsAuth.pending, (state, action) => {
        state.isLoading = true;
      }),
      builder.addCase(checkIsAuth.rejected, (state, action) => {
        console.log('rejected ', action);
        state.error = action.payload === 'Server error' ? 'Server error' : '';
        state.isAuth = false;
        state.isLoading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
