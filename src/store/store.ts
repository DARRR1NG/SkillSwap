import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice.ts';
import requestsReducer from './slices/requestsSlice.ts';
import { authReducer } from './slices/authSlice.ts';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    requests: requestsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
