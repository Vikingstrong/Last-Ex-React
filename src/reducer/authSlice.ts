import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../token/token";

interface TypesInitial {
    response: string;
    isLoading: boolean;
    error: boolean;
    errorMessage: string | null;
    token: string;
    userName: string;
    regStatus: boolean;
}

const getStoredToken = (): string => {
    const t = localStorage.getItem('token');
    if (!t || t === 'undefined' || t === 'null') return '';
    return t;
};

const initialState: TypesInitial = {
    response: '',
    isLoading: false,
    error: false,
    errorMessage: null,
    token: getStoredToken(),
    userName: '',
    regStatus: false
};

function extractErrorMessage(error: any, fallbackMessage: string): string {
    if (!error) return fallbackMessage;
    const data = error.response?.data;
    if (!data) return error.message || fallbackMessage;

    if (typeof data === 'string') {
        if (data.includes('already exists') || data.includes('already taken') || data.includes('User exists')) {
            return 'Этот пользователь уже занят';
        }
        return data;
    }

    if (data.message && typeof data.message === 'string') {
        if (data.message.toLowerCase().includes('already exist') || data.message.toLowerCase().includes('duplicate')) {
            return 'Этот пользователь уже занят';
        }
        if (data.message.toLowerCase().includes('invalid') || data.message.toLowerCase().includes('incorrect') || data.message.toLowerCase().includes('password') || data.message.toLowerCase().includes('not found')) {
            return 'Неверный пароль или юзернейм';
        }
        return data.message;
    }

    if (data.title && typeof data.title === 'string' && data.title !== 'One or more validation errors occurred.') {
        return data.title;
    }

    if (data.errors) {
        if (Array.isArray(data.errors) && data.errors.length > 0) {
            const first = data.errors[0];
            const msg = typeof first === 'string' ? first : (first.description || first.message || fallbackMessage);
            return msg;
        }
        if (typeof data.errors === 'object') {
            const keys = Object.keys(data.errors);
            if (keys.length > 0) {
                const firstVal = data.errors[keys[0]];
                if (Array.isArray(firstVal) && firstVal.length > 0) return firstVal[0];
                if (typeof firstVal === 'string') return firstVal;
            }
        }
    }

    return fallbackMessage;
}

export const regUserReq = createAsyncThunk(
    'auth/regUserReq',
    async (user: any, { rejectWithValue }) => {
        try {
            const resp = await axiosInstance.post('/Account/register', user);
            if (resp.data && (resp.data.statusCode >= 400 || (resp.data.errors && resp.data.errors.length > 0))) {
                return rejectWithValue(resp.data.message || 'Этот пользователь уже занят');
            }
            return resp.data;
        } catch (error: any) {
            const msg = extractErrorMessage(error, 'Этот пользователь уже занят');
            return rejectWithValue(msg);
        }
    }
);

export const loginUserReq = createAsyncThunk(
    'auth/loginUserReq',
    async (user: any, { rejectWithValue }) => {
        try {
            const resp = await axiosInstance.post('/Account/login', user);
            if (resp.data) {
                const token = resp.data.data || resp.data.token || (typeof resp.data === 'string' ? resp.data : null);
                if (token && typeof token === 'string' && token !== 'undefined' && token !== 'null') {
                    return resp.data;
                }
                if (resp.data.statusCode >= 400 || (resp.data.errors && resp.data.errors.length > 0)) {
                    return rejectWithValue(resp.data.message || 'Неверный пароль или юзернейм');
                }
            }
            return resp.data;
        } catch (error: any) {
            const msg = extractErrorMessage(error, 'Неверный пароль или юзернейм');
            return rejectWithValue(msg);
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = false;
            state.errorMessage = null;
        },
        logout: (state) => {
            state.token = '';
            state.userName = '';
            state.error = false;
            state.errorMessage = null;
            state.regStatus = false;
            localStorage.removeItem('token');
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            if (action.payload && action.payload !== 'undefined' && action.payload !== 'null') {
                localStorage.setItem('token', action.payload);
            } else {
                localStorage.removeItem('token');
            }
        }
    },
    extraReducers: (build) => {
        build
            // Register cases
            .addCase(regUserReq.pending, (state) => {
                state.isLoading = true;
                state.error = false;
                state.errorMessage = null;
                state.regStatus = false;
            })
            .addCase(regUserReq.fulfilled, (state, action) => {
                state.isLoading = false;
                state.regStatus = true;
                state.error = false;
                state.errorMessage = null;
                state.response = typeof action.payload === 'string' ? action.payload : JSON.stringify(action.payload);
            })
            .addCase(regUserReq.rejected, (state, action) => {
                state.isLoading = false;
                state.error = true;
                state.regStatus = false;
                state.errorMessage = (action.payload as string) || 'Этот пользователь уже занят';
            })

            // Login cases
            .addCase(loginUserReq.pending, (state) => {
                state.isLoading = true;
                state.error = false;
                state.errorMessage = null;
            })
            .addCase(loginUserReq.fulfilled, (state, action) => {
                state.isLoading = false;
                const token = action.payload?.data || action.payload?.token || (typeof action.payload === 'string' ? action.payload : null);
                if (token && typeof token === 'string' && token !== 'undefined' && token !== 'null') {
                    state.token = token;
                    state.error = false;
                    state.errorMessage = null;
                    localStorage.setItem('token', token);
                } else {
                    state.token = '';
                    state.error = true;
                    state.errorMessage = 'Неверный пароль или юзернейм';
                    localStorage.removeItem('token');
                }
            })
            .addCase(loginUserReq.rejected, (state, action) => {
                state.isLoading = false;
                state.error = true;
                state.token = '';
                state.errorMessage = (action.payload as string) || 'Неверный пароль или юзернейм';
                localStorage.removeItem('token');
            });
    }
});

export const { clearError, logout, setToken } = authSlice.actions;
export default authSlice.reducer;