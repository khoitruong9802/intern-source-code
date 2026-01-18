import { createSlice } from '@reduxjs/toolkit';

export const adminSlice = createSlice({
  name: 'auth',
  initialState: {
    id: -1,
    fullName: '',
  },
  reducers: {
    setAdmin: (state, action) => {
      state.id = action.payload.id;
      state.fullName = action.payload.full_name;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAdmin } = adminSlice.actions;

export default adminSlice.reducer;
