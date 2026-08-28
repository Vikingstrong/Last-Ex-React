import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../token/token";


interface typesInitial{
    responce:string,
    isLoading:boolean,
    error: boolean,
    token: string,
    userName:string,
    regStatus: boolean
}
const initialState:typesInitial = {
    responce: '',
    isLoading: false,
    error: false,
    token: '',
    userName: '',
    regStatus: false
}

export const regUserReq = createAsyncThunk('auth/regUserReq', async(user) => {
    try {
        const resp = await axiosInstance.post('/Account/register', user)
        console.log(resp)
        return resp.data
    } catch (error) {
        console.error(error)
    }
})
export const loginUserReq = createAsyncThunk('auth/loginUserReq', async(user) => {
    try {
        const resp = await axiosInstance.post('/Account/login', user)
        return resp.data
    } catch (error) {
        
    }
})

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{

    },
    extraReducers:(build) => {
        build
            .addCase(regUserReq.pending, (state) => {
                state.isLoading = true
            })
            .addCase(regUserReq.fulfilled, (state) => {
                state.isLoading = false;
                state.regStatus = true
            })
            .addCase(regUserReq.rejected, (state) => {
                state.isLoading = false
                state.error = true 
            })

            .addCase(loginUserReq.pending, (state) => {
                state.isLoading = true
            })
            .addCase(loginUserReq.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.data
                localStorage.setItem('token', state.token)
            })
            .addCase(loginUserReq.rejected, (state) => {
                state.isLoading = false
                state.error = true 
            })
    }
})