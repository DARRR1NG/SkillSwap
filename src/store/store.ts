import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice.ts';
import requestsReducer from './slices/requestsSlice.ts';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    requests: requestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
