import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../reducer/authSlice";
import { productSlice } from "../reducer/productSlice";
import { catalogSlice } from "../reducer/catalogSlice";
import { userSlice } from "../reducer/usersSlice";
import { cartSlice } from "../reducer/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    products: productSlice.reducer,
    catalog: catalogSlice.reducer,
    userData: userSlice.reducer,
    cart: cartSlice.reducer
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch