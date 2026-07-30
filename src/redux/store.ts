import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/app-slice';
import authReducer from './slices/auth-slice';
import bookingModalReducer from './slices/booking-modal-slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      auth: authReducer,
      bookingModal: bookingModalReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
