import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../token/token";
import type { IProduct } from "./productSlice";

export interface ICartItem {
    id: number; // Cart item ID in cart table
    quantity?: number;
    productCount?: number;
    count?: number;
    productId?: number;
    product?: IProduct;
    // Flat fields if backend returns flat items
    productName?: string;
    price?: number;
    discountPrice?: number;
    hasDiscount?: boolean;
    image?: string;
    images?: { id: number, images: string }[];
    brand?: string;
}

export type CartItemTarget = number | string | { cartItemId?: number | string; productId?: number | string };

interface CartState {
    items: ICartItem[];
    totalProducts: number;
    totalPrice: number;
    totalDiscountPrice: number;
    loading: boolean;
    error: boolean;
    errorMessage: string | null;
}

const initialState: CartState = {
    items: [],
    totalProducts: 0,
    totalPrice: 0,
    totalDiscountPrice: 0,
    loading: false,
    error: false,
    errorMessage: null
};

// 1. Get cart items
export const getProductsFromCart = createAsyncThunk(
    "cart/getProductsFromCart",
    async (_, { rejectWithValue }) => {
        try {
            const resp = await axiosInstance.get("/Cart/get-products-from-cart");
            console.log("Cart response from server:", resp.data);
            return resp.data;
        } catch (error: any) {
            console.log("Error getting cart:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// 2. Add product to cart
export const addProductToCart = createAsyncThunk(
    "cart/addProductToCart",
    async (id: number | string, { rejectWithValue, dispatch, getState }) => {
        try {
            const numericId = Number(id);
            const state = getState() as any;
            const existingCartItems: ICartItem[] = state.cart?.items || [];
            
            // Check if item is already in cart
            const foundInCart = existingCartItems.find((item: any) => 
                Number(item.productId) === numericId || 
                Number(item.product?.id) === numericId || 
                Number(item.id) === numericId
            );

            if (foundInCart) {
                // If already in cart, use increase-product-in-cart
                const targetId = foundInCart.id ?? numericId;
                try {
                    const resp = await axiosInstance.put(`/Cart/increase-product-in-cart?id=${targetId}`);
                    dispatch(getProductsFromCart());
                    return resp.data;
                } catch (incErr: any) {
                    if (foundInCart.productId && foundInCart.productId !== targetId) {
                        const fb = await axiosInstance.put(`/Cart/increase-product-in-cart?id=${foundInCart.productId}`);
                        dispatch(getProductsFromCart());
                        return fb.data;
                    }
                    throw incErr;
                }
            }

            // Otherwise, try POST add-product-to-cart
            try {
                const resp = await axiosInstance.post(`/Cart/add-product-to-cart?id=${numericId}`);
                dispatch(getProductsFromCart());
                return resp.data;
            } catch (err: any) {
                // If backend returns 400 (e.g. already in cart), fallback to increase
                if (err.response?.status === 400) {
                    const incResp = await axiosInstance.put(`/Cart/increase-product-in-cart?id=${numericId}`);
                    dispatch(getProductsFromCart());
                    return incResp.data;
                }
                throw err;
            }
        } catch (error: any) {
            console.log("Error adding to cart:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// 3. Increase quantity in cart
export const increaseProductInCart = createAsyncThunk(
    "cart/increaseProductInCart",
    async (target: CartItemTarget, { rejectWithValue, dispatch }) => {
        try {
            const primaryId = typeof target === 'object' ? (target.cartItemId ?? target.productId) : target;
            try {
                const resp = await axiosInstance.put(`/Cart/increase-product-in-cart?id=${primaryId}`);
                dispatch(getProductsFromCart());
                return resp.data;
            } catch (firstErr: any) {
                if (typeof target === 'object' && target.productId && target.productId !== primaryId) {
                    const fallbackResp = await axiosInstance.put(`/Cart/increase-product-in-cart?id=${target.productId}`);
                    dispatch(getProductsFromCart());
                    return fallbackResp.data;
                }
                throw firstErr;
            }
        } catch (error: any) {
            console.log("Error increasing cart item:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// 4. Reduce quantity in cart
export const reduceProductInCart = createAsyncThunk(
    "cart/reduceProductInCart",
    async (target: CartItemTarget, { rejectWithValue, dispatch }) => {
        try {
            const primaryId = typeof target === 'object' ? (target.cartItemId ?? target.productId) : target;
            try {
                const resp = await axiosInstance.put(`/Cart/reduce-product-in-cart?id=${primaryId}`);
                dispatch(getProductsFromCart());
                return resp.data;
            } catch (firstErr: any) {
                if (typeof target === 'object' && target.productId && target.productId !== primaryId) {
                    const fallbackResp = await axiosInstance.put(`/Cart/reduce-product-in-cart?id=${target.productId}`);
                    dispatch(getProductsFromCart());
                    return fallbackResp.data;
                }
                throw firstErr;
            }
        } catch (error: any) {
            console.log("Error reducing cart item:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// 5. Delete product from cart
export const deleteProductFromCart = createAsyncThunk(
    "cart/deleteProductFromCart",
    async (target: CartItemTarget, { rejectWithValue, dispatch }) => {
        try {
            const primaryId = typeof target === 'object' ? (target.cartItemId ?? target.productId) : target;
            try {
                const resp = await axiosInstance.delete(`/Cart/delete-product-from-cart?id=${primaryId}`);
                dispatch(getProductsFromCart());
                return resp.data;
            } catch (firstErr: any) {
                if (typeof target === 'object' && target.productId && target.productId !== primaryId) {
                    const fallbackResp = await axiosInstance.delete(`/Cart/delete-product-from-cart?id=${target.productId}`);
                    dispatch(getProductsFromCart());
                    return fallbackResp.data;
                }
                throw firstErr;
            }
        } catch (error: any) {
            console.log("Error deleting from cart:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// 6. Clear entire cart
export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const resp = await axiosInstance.delete("/Cart/clear-cart");
            dispatch(getProductsFromCart());
            return resp.data;
        } catch (error: any) {
            console.log("Error clearing cart:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetCart: (state) => {
            state.items = [];
            state.totalProducts = 0;
            state.totalPrice = 0;
            state.totalDiscountPrice = 0;
            state.error = false;
            state.errorMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Cart
            .addCase(getProductsFromCart.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getProductsFromCart.fulfilled, (state, action: any) => {
                state.loading = false;
                const payloadData = action.payload?.data ?? action.payload;

                let itemsList: any[] = [];
                let summary = {
                    totalProducts: 0,
                    totalPrice: 0,
                    totalDiscountPrice: 0
                };

                if (Array.isArray(payloadData)) {
                    if (payloadData.length > 0 && typeof payloadData[0] === 'object') {
                        const first = payloadData[0];
                        if (first && ('totalProducts' in first || 'totalPrice' in first || 'productsInCart' in first || 'products' in first || 'items' in first)) {
                            summary.totalProducts = first.totalProducts ?? 0;
                            summary.totalPrice = first.totalPrice ?? 0;
                            summary.totalDiscountPrice = first.totalDiscountPrice ?? 0;
                            
                            const nested = first.productsInCart || first.products || first.items || first.productInCarts || first.productInCart || first.cartProducts;
                            if (Array.isArray(nested)) {
                                itemsList = nested;
                            } else {
                                const anyArr = Object.values(first).find((v) => Array.isArray(v));
                                if (anyArr) {
                                    itemsList = anyArr as any[];
                                }
                            }
                        } else {
                            itemsList = payloadData;
                        }
                    }
                } else if (payloadData && typeof payloadData === 'object') {
                    summary.totalProducts = payloadData.totalProducts ?? 0;
                    summary.totalPrice = payloadData.totalPrice ?? 0;
                    summary.totalDiscountPrice = payloadData.totalDiscountPrice ?? 0;
                    const nested = payloadData.productsInCart || payloadData.products || payloadData.items || payloadData.productInCarts || payloadData.cartProducts;
                    if (Array.isArray(nested)) {
                        itemsList = nested;
                    }
                }

                state.items = itemsList;
                state.totalProducts = summary.totalProducts || itemsList.reduce((sum, item) => sum + (item.productCount || item.quantity || 1), 0);
                state.totalPrice = summary.totalPrice || 0;
                state.totalDiscountPrice = summary.totalDiscountPrice || 0;
            })
            .addCase(getProductsFromCart.rejected, (state, action: any) => {
                state.loading = false;
                state.error = true;
                state.errorMessage = action.payload || "Failed to load cart";
            });
    }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
