import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Card {
  id: string | number;
  title: string;
}

interface FavoritesState {
  items: Card[];
}

const loadFromLocalStorage = (): Card[] => {
  try {
    const savedFavorites = localStorage.getItem('favorites_cards');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (e) {
    console.error('Не удалось загрузить избранное', e);
    return [];
  }
};

const initialState: FavoritesState = {
  items: loadFromLocalStorage(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Card>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);

      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }

      localStorage.setItem('favorites_cards', JSON.stringify(state.items));
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
