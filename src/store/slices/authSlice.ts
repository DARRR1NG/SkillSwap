import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  cityId?: number;
  gender?: 'male' | 'female';
  birthday?: string;
  createdAt?: string;
  about?: string;
  skillsWantId?: string[];
  likes?: number;
  skillsCanTeach?: {
    id: number;
    categoryId: number;
    subcategoryId: number;
    customTitle: string;
    description: string;
    images: string[];
  }[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
}

// Ключи для localStorage
const USERS_STORAGE_KEY = 'users';
const CURRENT_USER_KEY = 'current_user';
const TOKEN_KEY = 'token';

// Вспомогательные функции
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

const saveToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const generateToken = () => {
  return `token_${Date.now()}_${crypto.randomUUID()}`;
};

const generateId = () => {
  return `${Date.now()}_${crypto.randomUUID()}`;
};

// Начальное состояние
const initialState: AuthState = {
  user: (() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  })(),
  token: localStorage.getItem(TOKEN_KEY),
  error: null,
};

// Слайс с синхронными редьюсерами
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Очистка ошибки
    clearError: (state) => {
      state.error = null;
    },
    
    // Регистрация
    register: (state, action: PayloadAction<{ name: string; email: string; password: string }>) => {
      const { name, email, password } = action.payload;
      const users = getUsers();
      
      // Проверка, существует ли пользователь
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        state.error = 'Пользователь с таким email уже существует';
        return;
      }
      
      // Создание нового пользователя
      const newUser: User = {
        id: generateId(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
        likes: 0,
        skillsWantId: [],
        skillsCanTeach: [],
      };
      
      users.push(newUser);
      saveUsers(users);
      
      const token = generateToken();
      saveToken(token);
      saveCurrentUser(newUser);
      
      state.user = newUser;
      state.token = token;
      state.error = null;
    },
    
    // Логин
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const { email, password } = action.payload;
      const users = getUsers();
      
      // Поиск пользователя
      const user = users.find(u => u.email === email);
      if (!user) {
        state.error = 'Пользователь с таким email не найден';
        return;
      }
      
      if (user.password !== password) {
        state.error = 'Неверный пароль';
        return;
      }
      
      const token = generateToken();
      saveToken(token);
      saveCurrentUser(user);
      
      state.user = user;
      state.token = token;
      state.error = null;
    },
    
    // Обновление данных пользователя
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      const currentUser = state.user;
      if (!currentUser) {
        state.error = 'Пользователь не авторизован';
        return;
      }
      
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex === -1) {
        state.error = 'Пользователь не найден';
        return;
      }
      
      const updatedUser = { ...users[userIndex], ...action.payload };
      users[userIndex] = updatedUser;
      saveUsers(users);
      saveCurrentUser(updatedUser);
      
      state.user = updatedUser;
      state.error = null;
    },
    
    // Выход
    logout: (state) => {
      saveToken(null);
      saveCurrentUser(null);
      
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
});

// Экшены
export const { clearError, register, login, updateUser, logout } = authSlice.actions;

// Селекторы
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;

// Редьюсер
export const authReducer = authSlice.reducer;
export default authSlice.reducer;