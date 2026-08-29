import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../token/token"


export interface IProductImage {
    id: number;
    images: string;
}

export interface IProduct {
    id: number;
    productName: string;
    image?: string;
    images?: IProductImage[];
    color: string;
    brand?: string;
    description?: string;
    price: number;
    hasDiscount: boolean;
    discountPrice: number;
    quantity: number;
    productInMyCart: boolean;
    categoryId?: number;
    categoryName?: string;
    subCategoryId?: number;
    code?: string;
    weight?: any;
    size?: any;
    productInfoFromCart?: any;
}
export interface IColor {
  id: number;
  colorName: string;
}
export interface IBrand {
  id: number;
  brandName: string;
}

export interface IProductsResponseData {
  products: IProduct[];
  colors: IColor[];
  brands: IBrand[];
  minMaxPrice: {
    minPrice: number;
    maxPrice: number;
  };
}
export interface IAPIResponce{
    pageNumber: number,
    pageSize: number,
    totalPage: number,
    totalRecord: number,
    data: IProductsResponseData,
    errors: any[],
    statusCode: number
}



export interface ISingleProductResponse {
    data: IProduct;
    errors: any[];
    statusCode: number;
}

interface GetParamsType{
    pageNumber:number,
    pageSize:number,
}

export const getProducts = createAsyncThunk<IAPIResponce, GetParamsType>(
    'productSlice/getProducts',
    async({pageNumber = 1, pageSize = 10}, {rejectWithValue}) => {
        try {
            const resp = await axiosInstance.get<IAPIResponce>('/Product/get-products', {
                params: {pageNumber, pageSize}
            })
            return resp.data
        } catch (error: any) {
            console.log(error)
            return rejectWithValue(error.response?.data)
        }
    }
)

export const getProductById = createAsyncThunk<ISingleProductResponse, number | string>(
    'productSlice/getProductById',
    async(id, {rejectWithValue}) => {
        try {
            const resp = await axiosInstance.get<ISingleProductResponse>('/Product/get-product-by-id', {
                params: { id }
            })
            return resp.data
        } catch (error: any) {
            console.log(error)
            return rejectWithValue(error.response?.data)
        }
    }
)

export const addProduct = createAsyncThunk(
    'productSlice/addProduct',
    async(formData: FormData, { rejectWithValue, dispatch }) => {
        try {
            const resp = await axiosInstance.post('/Product/add-product', formData)
            dispatch(getProducts({ pageNumber: 1, pageSize: 20 }))
            return resp.data
        } catch (error: any) {
            console.log(error)
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const deleteProduct = createAsyncThunk(
    'productSlice/deleteProduct',
    async(id: number | string, { rejectWithValue, dispatch }) => {
        try {
            const resp = await axiosInstance.delete(`/Product/delete-product?id=${id}`)
            dispatch(getProducts({ pageNumber: 1, pageSize: 20 }))
            return resp.data
        } catch (error: any) {
            console.log(error)
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const updateProduct = createAsyncThunk(
    'productSlice/updateProduct',
    async(productData: any, { rejectWithValue, dispatch }) => {
        try {
            const resp = await axiosInstance.put('/Product/update-product', null, {
                params: productData
            })
            dispatch(getProducts({ pageNumber: 1, pageSize: 10 }))
            return resp.data
        } catch (error: any) {
            console.log(error)
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const addImageToProduct = createAsyncThunk(
    'productSlice/addImageToProduct',
    async({ productId, files }: { productId: number | string, files: FileList }, { rejectWithValue, dispatch }) => {
        try {
            const formData = new FormData()
            formData.append('ProductId', String(productId))
            for (let i = 0; i < files.length; i++) {
                formData.append('Files', files[i])
            }
            const resp = await axiosInstance.post('/Product/add-image-to-product', formData)
            dispatch(getProducts({ pageNumber: 1, pageSize: 10 }))
            return resp.data
        } catch (error: any) {
            console.log(error)
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

interface LoadingTypes{
    loadingProducts: boolean,
    loadingBrands: boolean,
    loadingColors: boolean,
    loadingProductById: boolean,
}
interface InitialType{
    loadings:LoadingTypes,
    error: boolean,
    dataProduct: IProduct[],
    dataBrands: IBrand[],
    dataColors: IColor[],
    productById: IProduct | null,
    minMaxPrice: {
        minPrice: number;
        maxPrice: number;
    },
    totalRecord: number,
    totalPage: number,
    pageNumber: number,
    pageSize: number
}
const initialState:InitialType = {
    loadings: {
        loadingProducts: false,
        loadingBrands: false,
        loadingColors: false,
        loadingProductById: false
    },
    error: false,
    dataProduct: [],
    dataBrands: [],
    dataColors: [],
    productById: null,
    minMaxPrice: {
        minPrice: 0,
        maxPrice: 1000
    },
    totalRecord: 0,
    totalPage: 1,
    pageNumber: 1,
    pageSize: 10
}
export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers:{

    },
    extraReducers: (builder) =>{
        builder
            .addCase(getProducts.pending, (state) => {
                state.loadings.loadingProducts = true
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loadings.loadingProducts = false
                state.dataProduct = action.payload?.data?.products || []
                state.dataBrands = action.payload?.data?.brands || []
                state.dataColors = action.payload?.data?.colors || []
                if (action.payload?.data?.minMaxPrice) {
                    state.minMaxPrice = action.payload.data.minMaxPrice
                }
                if (action.payload?.totalRecord !== undefined) {
                    state.totalRecord = action.payload.totalRecord
                } else if ((action.payload as any)?.data?.totalRecord !== undefined) {
                    state.totalRecord = (action.payload as any).data.totalRecord
                } else if (state.totalRecord === 0 && action.payload?.data?.products?.length) {
                    state.totalRecord = action.payload.data.products.length
                }
                if (action.payload?.totalPage !== undefined) {
                    state.totalPage = action.payload.totalPage
                } else if ((action.payload as any)?.data?.totalPage !== undefined) {
                    state.totalPage = (action.payload as any).data.totalPage
                }
                if (action.payload?.pageNumber !== undefined) {
                    state.pageNumber = action.payload.pageNumber
                }
                if (action.payload?.pageSize !== undefined) {
                    state.pageSize = action.payload.pageSize
                }
            })
            .addCase(getProducts.rejected, (state) => {
                state.loadings.loadingProducts = false;
                state.error = true
            })
            .addCase(getProductById.pending, (state) => {
                state.loadings.loadingProductById = true
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loadings.loadingProductById = false
                state.productById = action.payload?.data || null
            })
            .addCase(getProductById.rejected, (state) => {
                state.loadings.loadingProductById = false
                state.error = true
            })
    }
})