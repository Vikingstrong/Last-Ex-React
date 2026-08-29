import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../token/token"

export interface UserRoles {
    id: string,
    name: string
}

export interface User {
    userName: string,
    userId: string,
    image: string,
    userRoles: UserRoles[],
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    dob: string,
    address?: string
}

export interface RoleItem {
    id: string,
    name: string
}

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        )
        return JSON.parse(jsonPayload)
    } catch {
        return null
    }
}

export const getDataUser = createAsyncThunk("usersData/getDataUser", async(userName: string | void, { rejectWithValue }) => {
    try {
        let searchName = userName || localStorage.getItem('userName') || ''
        
        if (!searchName) {
            const token = localStorage.getItem('token')
            if (token) {
                const decoded = parseJwt(token)
                if (decoded) {
                    searchName = decoded.name || decoded.unique_name || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.sub || ''
                }
            }
        }

        const url = searchName 
            ? `/UserProfile/get-user-profiles?UserName=${encodeURIComponent(searchName)}&PageNumber=1&PageSize=10`
            : `/UserProfile/get-user-profiles?PageNumber=1&PageSize=10`

        const resp = await axiosInstance.get(url)
        return resp.data 
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const getUsersList = createAsyncThunk("usersData/getUsersList", async(params: { pageNumber?: number, pageSize?: number, userName?: string } | void, { rejectWithValue }) => {
    try {
        const pageNumber = params?.pageNumber || 1
        const pageSize = params?.pageSize || 10
        const query = params?.userName ? `&UserName=${encodeURIComponent(params.userName)}` : ''
        const resp = await axiosInstance.get(`/UserProfile/get-user-profiles?PageNumber=${pageNumber}&PageSize=${pageSize}${query}`)
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const getUserRoles = createAsyncThunk("usersData/getUserRoles", async(_: void, { rejectWithValue }) => {
    try {
        const resp = await axiosInstance.get('/UserProfile/get-user-roles')
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const addRoleToUser = createAsyncThunk("usersData/addRoleToUser", async({ userId, roleId }: { userId: string, roleId: string }, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.post(`/UserProfile/addrole-from-user?UserId=${userId}&RoleId=${roleId}`)
        dispatch(getUsersList())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const removeRoleFromUser = createAsyncThunk("usersData/removeRoleFromUser", async({ userId, roleId }: { userId: string, roleId: string }, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.delete(`/UserProfile/remove-role-from-user?UserId=${userId}&RoleId=${roleId}`)
        dispatch(getUsersList())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const deleteUser = createAsyncThunk("usersData/deleteUser", async(id: string, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.delete(`/UserProfile/delete-user?id=${id}`)
        dispatch(getUsersList())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateUserProfile = createAsyncThunk("usersData/updateUserProfile", async(profileData: FormData | any, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.put('/UserProfile/update-user-profile', profileData)
        dispatch(getUsersList({ pageNumber: 1, pageSize: 10 }))
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

interface LoaderTypes {
    getLoading: boolean,
    usersListLoading: boolean,
    rolesLoading: boolean,
    updateLoading: boolean
}

interface DataTypes {
    getUserInfo: Partial<User>,
    usersList: User[],
    roles: RoleItem[],
    totalRecord: number,
    totalPage: number,
    pageNumber: number,
    pageSize: number
}

interface InitialType {
    loader: LoaderTypes,
    data: DataTypes,
    error: boolean,
    errorMessage: string | null
}

const initialState: InitialType = {
    loader: {
        getLoading: false,
        usersListLoading: false,
        rolesLoading: false,
        updateLoading: false
    },
    data: {
        getUserInfo: {},
        usersList: [],
        roles: [],
        totalRecord: 0,
        totalPage: 1,
        pageNumber: 1,
        pageSize: 10
    },
    error: false,
    errorMessage: null
}

export const userSlice = createSlice({
    name: 'usersData',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.data.getUserInfo = action.payload
        },
        clearUserData: (state) => {
            state.data.getUserInfo = {}
            state.data.usersList = []
            state.error = false
            state.errorMessage = null
        }
    },
    extraReducers(builder) {
        builder
            // Current User
            .addCase(getDataUser.pending, (state) => {
                state.loader.getLoading = true
                state.error = false
                state.errorMessage = null
            })
            .addCase(getDataUser.fulfilled, (state, action: any) => {
                state.loader.getLoading = false
                const payloadData = action.payload?.data || action.payload
                
                if (Array.isArray(payloadData)) {
                    state.data.usersList = payloadData
                    if (payloadData.length > 0) {
                        const localUser = localStorage.getItem('userName')?.toLowerCase()
                        const matched = payloadData.find((u: User) => u.userName?.toLowerCase() === localUser)
                        state.data.getUserInfo = matched || payloadData[0]
                    }
                } else if (payloadData && typeof payloadData === 'object') {
                    if (Array.isArray(payloadData.data)) {
                        state.data.usersList = payloadData.data
                        const localUser = localStorage.getItem('userName')?.toLowerCase()
                        const matched = payloadData.data.find((u: User) => u.userName?.toLowerCase() === localUser)
                        state.data.getUserInfo = matched || payloadData.data[0] || {}
                    } else {
                        state.data.getUserInfo = payloadData
                    }
                }
            })
            .addCase(getDataUser.rejected, (state, action: any) => {
                state.loader.getLoading = false
                state.error = true
                state.errorMessage = action.payload || 'Failed to fetch user data'
            })

            // Users List
            .addCase(getUsersList.pending, (state) => {
                state.loader.usersListLoading = true
            })
            .addCase(getUsersList.fulfilled, (state, action: any) => {
                state.loader.usersListLoading = false
                const payloadData = action.payload?.data || action.payload
                if (Array.isArray(payloadData)) {
                    state.data.usersList = payloadData
                } else if (payloadData && Array.isArray(payloadData.data)) {
                    state.data.usersList = payloadData.data
                }
                if (action.payload?.totalRecord !== undefined) {
                    state.data.totalRecord = action.payload.totalRecord
                } else if (action.payload?.data?.totalRecord !== undefined) {
                    state.data.totalRecord = action.payload.data.totalRecord
                } else if (state.data.totalRecord === 0 && Array.isArray(payloadData)) {
                    state.data.totalRecord = payloadData.length
                }
                if (action.payload?.totalPage !== undefined) {
                    state.data.totalPage = action.payload.totalPage
                } else if (action.payload?.data?.totalPage !== undefined) {
                    state.data.totalPage = action.payload.data.totalPage
                }
                if (action.payload?.pageNumber !== undefined) {
                    state.data.pageNumber = action.payload.pageNumber
                }
                if (action.payload?.pageSize !== undefined) {
                    state.data.pageSize = action.payload.pageSize
                }
            })
            .addCase(getUsersList.rejected, (state) => {
                state.loader.usersListLoading = false
            })

            // Roles
            .addCase(getUserRoles.pending, (state) => {
                state.loader.rolesLoading = true
            })
            .addCase(getUserRoles.fulfilled, (state, action: any) => {
                state.loader.rolesLoading = false
                const payloadData = action.payload?.data || action.payload
                state.data.roles = Array.isArray(payloadData) ? payloadData : []
            })
            .addCase(getUserRoles.rejected, (state) => {
                state.loader.rolesLoading = false
            })

            // Update
            .addCase(updateUserProfile.pending, (state) => {
                state.loader.updateLoading = true
            })
            .addCase(updateUserProfile.fulfilled, (state, action: any) => {
                state.loader.updateLoading = false
                if (action.payload?.data) {
                    state.data.getUserInfo = { ...state.data.getUserInfo, ...action.payload.data }
                }
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.loader.updateLoading = false
            })
    },
})

export const { setUserInfo, clearUserData } = userSlice.actions
export default userSlice.reducer