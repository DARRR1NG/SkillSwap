import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TUser } from '../../utils/types';

const REQUESTS_STORAGE_KEY = 'requests_cards';

export type ExchangeRequestCard = TUser;

interface RequestsState {
  items: ExchangeRequestCard[];
}

const saveToLocalStorage = (items: ExchangeRequestCard[]) => {
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(items));
};

const loadFromLocalStorage = (): ExchangeRequestCard[] => {
  try {
    const savedRequests = localStorage.getItem(REQUESTS_STORAGE_KEY);
    return savedRequests ? JSON.parse(savedRequests) : [];
  } catch (e) {
    console.error('Не удалось загрузить заявки на обмен', e);
    return [];
  }
};

const initialState: RequestsState = {
  items: loadFromLocalStorage(),
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    addRequest: (state, action: PayloadAction<ExchangeRequestCard>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);

      if (!exists) {
        state.items.push(action.payload);
        saveToLocalStorage(state.items);
      }
    },
    removeRequest: (state, action: PayloadAction<ExchangeRequestCard['id']>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveToLocalStorage(state.items);
    },
    loadRequests: (state) => {
      state.items = loadFromLocalStorage();
    },
  },
});

export const { addRequest, removeRequest, loadRequests } = requestsSlice.actions;

type RequestsRootState = {
  requests: RequestsState;
};

export const selectRequests = (state: RequestsRootState) => state.requests.items;

export const selectRequestById = (state: RequestsRootState, id: ExchangeRequestCard['id']) =>
  state.requests.items.find((item) => item.id === id);

export default requestsSlice.reducer;
