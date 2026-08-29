import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../token/token"


interface UserRoles{
    id:string,
    name:string
}
interface User{
    userName: string,
    userId: string,
    image: string,
    userRoles: UserRoles[],
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    dob: string
}
interface ApiRespInfoUser{
    pageNumber: number,
    pageSize: number,
    totalPage: number,
    totalRecord: number,
    data: User[],
    errors: [],
    statusCode: number
}



const getDataUser = createAsyncThunk<ApiRespInfoUser>("usersData/getDataUser", async(userName) => {
    try {
        const resp = await axiosInstance.get(`/UserProfile/get-user?UserName=${userName}`)
        return resp.data 
    } catch (error) {
        console.log(error)
        return error
    }
})



interface LoaderTypes{
    getLoading: boolean
}
interface DataTypes{
    getUserInfo:User
}

interface InitialType{
    loader:LoaderTypes
    data: DataTypes
}
const initialState:InitialType = {
    loader:{
        getLoading: false
    },
    data: {
        getUserInfo:{}
    }
}

const userSlice = createSlice({
    name: 'usersData',
    initialState,
    reducers:{

    },
    extraReducers(builder) {
        builder
        .addCase(getDataUser.pending, (state) => {
            state.loader.getLoading = true
        })
        .addCase(getDataUser.fulfilled, (state, action) => {
            state.loader.getLoading = false
            state.data.getUserInfo = action.payload.data
        })
        .addCase(getDataUser.rejected, (state) => {
            state.loader.getLoading = false
        })
    },
})