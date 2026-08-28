import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../token/token"


export interface ISubCategory{
    id:number,
    subCategoryName: string
}
export interface ICategory{
    id: number,
    categoryImage:string,
    subCategories: ISubCategory[] | [],
    categoryName: string
}
interface CategoryApiResp{
    data: ICategory[],
    errors: [],
    statusCode: number
}

export const getCategories = createAsyncThunk<CategoryApiResp >('catalogSlice/getCategories', async() => {
    try {
        const resp = await axiosInstance.get('Category/get-categories')
        return resp.data
    } catch (error) {
        console.log(error)
        return error
    }
})


interface LoadingTypes{
    categoryLoading: boolean
}
interface InitialType{
    categories:ICategory[]
    loaders:LoadingTypes
}
const initialState:InitialType = {
    categories: [],
    loaders: {
        categoryLoading: false
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers:{

    },
    extraReducers(builder) {
        builder
            .addCase(getCategories.pending, (state) => {
                state.loaders.categoryLoading = true
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loaders.categoryLoading = false;
                state.categories = action.payload.data
            })
            .addCase(getCategories.rejected, (state) => {
                state.loaders.categoryLoading = false
            })
    },
})




