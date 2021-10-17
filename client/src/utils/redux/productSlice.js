import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
};

export const productSlice = createSlice({
    name: 'product',

    initialState,

    reducers: {

        REDUX_UPDATE_PRODUCTS: (state, action) => {
            state.products = action.payload
        }
    }
});

export const { REDUX_UPDATE_PRODUCTS } = productSlice.actions;

export const selectProducts = (state) => state.product.products;

export default productSlice.reducer;