import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../token/token"


export interface IProduct{
    id: number,
    productName: string,
    image: string,
    color: string,
    price: number,
    hasDiscount: boolean,
    discountPrice: number,
    quantity: number,
    productInMyCart: boolean,
    categoryId: number,
    categoryName: string,
    productInfoFromCart: null
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


interface InitialType{
    isLoading: boolean,
    error: boolean,
    dataProduct: IProduct[]
}
const initialState:InitialType = {
    isLoading: false,
    error: false,
    dataProduct: []
}
export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers:{

    },
    extraReducers: (builder) =>{
        builder
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.dataProduct = action.payload.data.products
            })
            .addCase(getProducts.rejected, (state) => {
                state.isLoading = false;
                state.error = true
            })
    }
})