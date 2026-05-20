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

// Временные данные для регистрации
interface RegistrationTempData {
  email: string;
  password: string;
  name?: string;
  avatar?: string;
  cityId?: number;
  gender?: 'male' | 'female';
  birthday?: string;
  skillsWantId?: string[];
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
  registrationStep: 1 | 2 | 3;
}

// Ключи для localStorage
const USERS_STORAGE_KEY = 'users';
const CURRENT_USER_KEY = 'current_user';
const TOKEN_KEY = 'token';
const REGISTRATION_TEMP_KEY = 'registration_temp';

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

const getRegistrationTemp = (): RegistrationTempData | null => {
  const data = localStorage.getItem(REGISTRATION_TEMP_KEY);
  return data ? JSON.parse(data) : null;
};

const saveRegistrationTemp = (data: RegistrationTempData | null) => {
  if (data) {
    localStorage.setItem(REGISTRATION_TEMP_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(REGISTRATION_TEMP_KEY);
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
  registrationStep: 1,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    // Проверка email и сохранение (1)
    checkEmail: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const { email, password } = action.payload;
      const users = getUsers();
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        state.error = 'Пользователь с таким email уже существует';
        return;
      }
      saveRegistrationTemp({ email, password });
      state.registrationStep = 2;
      state.error = null;
    },

    // Сохранение личных данных (2)
    savePersonalData: (
      state,
      action: PayloadAction<{
        name: string;
        avatar?: string;
        cityId?: number;
        gender?: 'male' | 'female';
        birthday?: string;
        skillsWantId?: string[];
      }>
    ) => {
      const tempData = getRegistrationTemp();
      if (!tempData) {
        state.error = 'Сначала заполните email и пароль';
        return;
      }
      saveRegistrationTemp({
        ...tempData,
        ...action.payload,
      });
      state.registrationStep = 3;
      state.error = null;
    },

    // Сохранение навыков (3)
    completeRegistration: (
      state,
      action: PayloadAction<{
        skillsCanTeach?: {
          id: number;
          categoryId: number;
          subcategoryId: number;
          customTitle: string;
          description: string;
          images: string[];
        }[];
      }>
    ) => {
      const tempData = getRegistrationTemp();
      if (!tempData) {
        state.error = 'Сначала заполните все предыдущие шаги';
        return;
      }

      if (!tempData.name) {
        state.error = 'Не заполнены личные данные';
        return;
      }

      const users = getUsers();

      // Создаём полного пользователя
      const newUser: User = {
        id: generateId(),
        name: tempData.name,
        email: tempData.email,
        password: tempData.password,
        avatar: tempData.avatar,
        cityId: tempData.cityId,
        gender: tempData.gender,
        birthday: tempData.birthday,
        createdAt: new Date().toISOString(),
        likes: 0,
        skillsWantId: tempData.skillsWantId || [],
        skillsCanTeach: action.payload.skillsCanTeach || [],
      };

      users.push(newUser);
      saveUsers(users);

      const token = generateToken();
      saveToken(token);
      saveCurrentUser(newUser);

      saveRegistrationTemp(null);

      state.user = newUser;
      state.token = token;
      state.registrationStep = 1;
      state.error = null;
    },

    // Отмена регистрации
    cancelRegistration: (state) => {
      saveRegistrationTemp(null);
      state.registrationStep = 1;
      state.error = null;
    },

    // Логин
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const { email, password } = action.payload;
      const users = getUsers();

      const user = users.find((u) => u.email === email);
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
      const userIndex = users.findIndex((u) => u.id === currentUser.id);

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
      saveRegistrationTemp(null);

      state.user = null;
      state.token = null;
      state.error = null;
      state.registrationStep = 1;
    },
  },
});

// Экшены
export const {
  clearError,
  checkEmail,
  savePersonalData,
  completeRegistration,
  cancelRegistration,
  login,
  updateUser,
  logout,
} = authSlice.actions;

// Селекторы
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;
export const selectRegistrationStep = (state: RootState) => state.auth.registrationStep;
export const selectRegistrationTemp = () => {
  const temp = localStorage.getItem(REGISTRATION_TEMP_KEY);
  return temp ? JSON.parse(temp) : null;
};

export default authSlice.reducer;
export const authReducer = authSlice.reducer;
