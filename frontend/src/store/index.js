import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import flightReducer from './slices/flightSlice';
import airportReducer from './slices/airportSlice';
import airlineReducer from './slices/airlineSlice';
import flightBoardReducer from './slices/flightBoardSlice';
import liveMessageReducer from './slices/liveMessageSlice';
import screenReducer from './slices/screenSlice';
import settingReducer from './slices/settingSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    flight: flightReducer,
    airport: airportReducer,
    airline: airlineReducer,
    flightBoard: flightBoardReducer,
    liveMessage: liveMessageReducer,
    screen: screenReducer,
    setting: settingReducer,
  },
});
