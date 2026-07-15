import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken as refreshTokenApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isLoginLoading: boolean;
  loginError: string | null;
  isRegisterLoading: boolean;
  registerError: string | null;
  isUpdateLoading: boolean;
  updateUserError: string | null;
  isForgotPasswordLoading: boolean;
  forgotPasswordError: string | null;
  isResetPasswordLoading: boolean;
  resetPasswordError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  isLoginLoading: false,
  loginError: null,
  isRegisterLoading: false,
  registerError: null,
  isUpdateLoading: false,
  updateUserError: null,
  isForgotPasswordLoading: false,
  forgotPasswordError: null,
  isResetPasswordLoading: false,
  resetPasswordError: null
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const checkUserAuth = createAsyncThunk<TUser | null>(
  'user/checkAuth',
  async () => {
    const hasRefreshToken = !!localStorage.getItem('refreshToken');

    if (!getCookie('accessToken')) {
      if (!hasRefreshToken) {
        return null;
      }
      try {
        await refreshTokenApi();
      } catch {
        clearTokens();
        return null;
      }
    }

    try {
      const { user } = await getUserApi();
      return user;
    } catch {
      clearTokens();
      return null;
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  clearTokens();
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const requestPasswordReset = createAsyncThunk(
  'user/requestPasswordReset',
  async (data: { email: string }) => forgotPasswordApi(data)
);

export const resetUserPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => resetPasswordApi(data)
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectLoginError: (state) => state.loginError,
    selectIsLoginLoading: (state) => state.isLoginLoading,
    selectRegisterError: (state) => state.registerError,
    selectIsRegisterLoading: (state) => state.isRegisterLoading,
    selectUpdateUserError: (state) => state.updateUserError,
    selectIsUpdateLoading: (state) => state.isUpdateLoading,
    selectIsForgotPasswordLoading: (state) => state.isForgotPasswordLoading,
    selectForgotPasswordError: (state) => state.forgotPasswordError,
    selectIsResetPasswordLoading: (state) => state.isResetPasswordLoading,
    selectResetPasswordError: (state) => state.resetPasswordError
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isRegisterLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRegisterLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegisterLoading = false;
        state.registerError =
          action.error.message ?? 'Не удалось зарегистрироваться';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoginLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoginLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.loginError = action.error.message ?? 'Не удалось войти';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isUpdateLoading = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUpdateLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUpdateLoading = false;
        state.updateUserError =
          action.error.message ?? 'Не удалось обновить данные';
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.isForgotPasswordLoading = true;
        state.forgotPasswordError = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isForgotPasswordLoading = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isForgotPasswordLoading = false;
        state.forgotPasswordError =
          action.error.message ?? 'Не удалось отправить запрос';
      })
      .addCase(resetUserPassword.pending, (state) => {
        state.isResetPasswordLoading = true;
        state.resetPasswordError = null;
      })
      .addCase(resetUserPassword.fulfilled, (state) => {
        state.isResetPasswordLoading = false;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.isResetPasswordLoading = false;
        state.resetPasswordError =
          action.error.message ?? 'Не удалось изменить пароль';
      });
  }
});

export const {
  selectUser,
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectLoginError,
  selectIsLoginLoading,
  selectRegisterError,
  selectIsRegisterLoading,
  selectUpdateUserError,
  selectIsUpdateLoading,
  selectIsForgotPasswordLoading,
  selectForgotPasswordError,
  selectIsResetPasswordLoading,
  selectResetPasswordError
} = userSlice.selectors;

export default userSlice.reducer;
