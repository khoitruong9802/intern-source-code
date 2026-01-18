import { createSlice } from '@reduxjs/toolkit';

export const flightBoardSlice = createSlice({
  name: 'flightBoard',
  initialState: {
    selectedScreen: 1,
    isConnected: false,
    isOpen: false,
    isConnecting: false,
    area: '',
    flights: [],
    blocks: [],
  },
  reducers: {
    setSelectedScreen: (state, action) => {
      state.selectedScreen = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setIsConnecting: (state, action) => {
      state.isConnecting = action.payload;
    },
    setArea: (state, action) => {
      state.area = action.payload;
    },
    setFlights: (state, action) => {
      state.flights = action.payload;
    },
    enqueueBlock: (state, action) => {
      state.blocks.push(action.payload);
    },
    dequeueBlock: (state, action) => {
      const block = state.blocks.shift();
      block.stopOver--;
      if (block.stopOver > 0) {
        state.blocks.push(block);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSelectedScreen,
  setIsConnected,
  setIsConnecting,
  setArea,
  setFlights,
  enqueueBlock,
  dequeueBlock,
  setIsOpen,
} = flightBoardSlice.actions;

export default flightBoardSlice.reducer;
