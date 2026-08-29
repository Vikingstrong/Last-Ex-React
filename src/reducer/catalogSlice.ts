import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../token/token"

export interface ISubCategory {
    id: number,
    subCategoryName: string,
    categoryId?: number
}

export interface ICategory {
    id: number,
    categoryImage: string,
    subCategories: ISubCategory[] | [],
    categoryName: string
}

export interface IBrand {
    id: number,
    brandName: string
}

export interface IColor {
    id: number,
    colorName: string
}

interface CategoryApiResp {
    data: ICategory[],
    errors: [],
    statusCode: number
}

// Categories
export const getCategories = createAsyncThunk<CategoryApiResp>('catalogSlice/getCategories', async(_: void, { rejectWithValue }) => {
    try {
        const resp = await axiosInstance.get('/Category/get-categories')
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const addCategory = createAsyncThunk('catalogSlice/addCategory', async(formData: FormData, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.post('/Category/add-category', formData)
        dispatch(getCategories())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateCategory = createAsyncThunk('catalogSlice/updateCategory', async(formData: FormData, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.put('/Category/update-category', formData)
        dispatch(getCategories())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const deleteCategory = createAsyncThunk('catalogSlice/deleteCategory', async(id: number | string, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.delete(`/Category/delete-category?id=${id}`)
        dispatch(getCategories())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

// Brands
export const getBrands = createAsyncThunk('catalogSlice/getBrands', async(_: void, { rejectWithValue }) => {
    try {
        const resp = await axiosInstance.get('/Brand/get-brands')
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const addBrand = createAsyncThunk('catalogSlice/addBrand', async(brandData: { brandName: string }, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.post('/Brand/add-brand', brandData)
        dispatch(getBrands())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateBrand = createAsyncThunk('catalogSlice/updateBrand', async(brandData: { id: number | string, brandName: string }, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.put(`/Brand/update-brand?Id=${brandData.id}&BrandName=${encodeURIComponent(brandData.brandName)}`)
        dispatch(getBrands())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const deleteBrand = createAsyncThunk('catalogSlice/deleteBrand', async(id: number | string, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.delete(`/Brand/delete-brand?id=${id}`)
        dispatch(getBrands())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

// SubCategories
export const getSubCategories = createAsyncThunk('catalogSlice/getSubCategories', async(_: void, { rejectWithValue }) => {
    try {
        const resp = await axiosInstance.get('/SubCategory/get-sub-category')
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const addSubCategory = createAsyncThunk('catalogSlice/addSubCategory', async(data: { categoryId: number | string, subCategoryName: string }, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.post(`/SubCategory/add-sub-category?CategoryId=${data.categoryId}&SubCategoryName=${encodeURIComponent(data.subCategoryName)}`)
        dispatch(getSubCategories())
        dispatch(getCategories())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateSubCategory = createAsyncThunk('catalogSlice/updateSubCategory', async(data: { id: number | string, categoryId: number | string, subCategoryName: string }, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.put(`/SubCategory/update-sub-category?Id=${data.id}&CategoryId=${data.categoryId}&SubCategoryName=${encodeURIComponent(data.subCategoryName)}`)
        dispatch(getSubCategories())
        dispatch(getCategories())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const deleteSubCategory = createAsyncThunk('catalogSlice/deleteSubCategory', async(id: number | string, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.delete(`/SubCategory/delete-sub-category?id=${id}`)
        dispatch(getSubCategories())
        dispatch(getCategories())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

// Colors
export const getColors = createAsyncThunk('catalogSlice/getColors', async(_: void, { rejectWithValue }) => {
    try {
        const resp = await axiosInstance.get('/Color/get-colors')
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const addColor = createAsyncThunk('catalogSlice/addColor', async(colorData: { colorName: string }, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.post(`/Color/add-color?ColorName=${encodeURIComponent(colorData.colorName)}`)
        dispatch(getColors())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateColor = createAsyncThunk('catalogSlice/updateColor', async(colorData: { id: number | string, colorName: string }, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.put(`/Color/update-color?Id=${colorData.id}&ColorName=${encodeURIComponent(colorData.colorName)}`)
        dispatch(getColors())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const deleteColor = createAsyncThunk('catalogSlice/deleteColor', async(id: number | string, { rejectWithValue, dispatch }) => {
    try {
        const resp = await axiosInstance.delete(`/Color/delete-color?id=${id}`)
        dispatch(getColors())
        return resp.data
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data || error.message)
    }
})

interface LoadingTypes {
    categoryLoading: boolean,
    brandLoading: boolean,
    subCategoryLoading: boolean,
    colorLoading: boolean
}

interface InitialType {
    categories: ICategory[],
    brands: IBrand[],
    subCategories: ISubCategory[],
    colors: IColor[],
    loaders: LoadingTypes
}

const initialState: InitialType = {
    categories: [],
    brands: [],
    subCategories: [],
    colors: [],
    loaders: {
        categoryLoading: false,
        brandLoading: false,
        subCategoryLoading: false,
        colorLoading: false
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getCategories.pending, (state) => {
                state.loaders.categoryLoading = true
            })
            .addCase(getCategories.fulfilled, (state, action: any) => {
                state.loaders.categoryLoading = false
                state.categories = action.payload?.data || action.payload || []
            })
            .addCase(getCategories.rejected, (state) => {
                state.loaders.categoryLoading = false
            })
            .addCase(getBrands.pending, (state) => {
                state.loaders.brandLoading = true
            })
            .addCase(getBrands.fulfilled, (state, action: any) => {
                state.loaders.brandLoading = false
                state.brands = action.payload?.data || action.payload || []
            })
            .addCase(getBrands.rejected, (state) => {
                state.loaders.brandLoading = false
            })
            .addCase(getSubCategories.pending, (state) => {
                state.loaders.subCategoryLoading = true
            })
            .addCase(getSubCategories.fulfilled, (state, action: any) => {
                state.loaders.subCategoryLoading = false
                state.subCategories = action.payload?.data || action.payload || []
            })
            .addCase(getSubCategories.rejected, (state) => {
                state.loaders.subCategoryLoading = false
            })
            .addCase(getColors.pending, (state) => {
                state.loaders.colorLoading = true
            })
            .addCase(getColors.fulfilled, (state, action: any) => {
                state.loaders.colorLoading = false
                state.colors = action.payload?.data || action.payload || []
            })
            .addCase(getColors.rejected, (state) => {
                state.loaders.colorLoading = false
            })
    },
})

export default catalogSlice.reducer
