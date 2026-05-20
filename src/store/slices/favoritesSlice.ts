import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const FAVORITES_KEY = 'skillswap_favorites';

interface FavoritesState {
  favorites: number[];
}

const loadFavorites = (): number[] => {
  const saved = localStorage.getItem(FAVORITES_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveFavorites = (favorites: number[]) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

const initialState: FavoritesState = {
  favorites: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<number>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
        saveFavorites(state.favorites);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter((id) => id !== action.payload);
      saveFavorites(state.favorites);
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const isExist = state.favorites.includes(action.payload);
      if (isExist) {
        state.favorites = state.favorites.filter((id) => id !== action.payload);
      } else {
        state.favorites.push(action.payload);
      }
      saveFavorites(state.favorites);
    },
    clearFavorites: (state) => {
      state.favorites = [];
      saveFavorites([]);
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
