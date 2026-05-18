import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
  isLoading: boolean;
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
  isLoading: false,
  error: null,
};

// Регистрация
export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const users = getUsers();
    
    // Проверка, существует ли пользователь
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
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
    
    return { user: newUser, token };
  }
);

// Логин
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const users = getUsers();
    
    // Поиск пользователя
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Пользователь с таким email не найден');
    }
    
    if (user.password !== password) {
      throw new Error('Неверный пароль');
    }
    
    const token = generateToken();
    saveToken(token);
    saveCurrentUser(user);
    
    return { user, token };
  }
);

// Обновление данных пользователя
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<User>) => {
    const currentUser = (() => {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    })();
    
    if (!currentUser) {
      throw new Error('Пользователь не авторизован');
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
      throw new Error('Пользователь не найден');
    }
    
    const updatedUser = { ...users[userIndex], ...userData };
    users[userIndex] = updatedUser;
    saveUsers(users);
    saveCurrentUser(updatedUser);
    
    return updatedUser;
  }
);

// Выход
export const logout = createAsyncThunk('auth/logout', async () => {
  saveToken(null);
  saveCurrentUser(null);
  return null;
});

// Слайс
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      
      // Логин
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка входа';
      })
      
      // Обновление
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления';
      })
      
      // Выход
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

// Экшены
export const { clearError } = authSlice.actions;

// Селекторы
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;

// Редьюсер
export const authReducer = authSlice.reducer;
export default authReducer;