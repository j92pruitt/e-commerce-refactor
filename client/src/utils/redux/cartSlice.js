import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cart: [],
    cartOpen: false,
};

export const cartSlice = createSlice({
    name: 'cart',

    initialState,

    reducers: {
        REDUX_ADD_TO_CART: (state, action) => {
            state.cartOpen = true;
            state.cart.push(action.payload)
        },

        REDUX_ADD_MULTIPLE_TO_CART: (state, action) => {
            state.cart.push(action.payload)
        },

        REDUX_UPDATE_CART_QUANTITY: (state, action) => {
            state.cartOpen = true;

            state.cart.map((product) => {
                if (action.payload._id === product._id) {
                  product.purchaseQuantity = action.payload.purchaseQuantity;
                }
                return product;
            });
        },

        REDUX_REMOVE_FROM_CART: (state, action) => {
            let newState = state.cart.filter((product) => {
                return product._id !== action._id;
            });

            state.cartOpen = newState.length > 0
            state.cart = newState
        },

        REDUX_CLEAR_CART: (state) => {
            state.cartOpen = false
            state.cart = []
        },

        REDUX_TOGGLE_CART: (state) => {
            state.cartOpen = !state.cartOpen
        }
    }
});

export const {REDUX_ADD_TO_CART, REDUX_ADD_MULTIPLE_TO_CART, REDUX_UPDATE_CART_QUANTITY, REDUX_REMOVE_FROM_CART, REDUX_CLEAR_CART, REDUX_TOGGLE_CART} = cartSlice.actions;

export const selectCart = (state) => state.cart.cart;
export const selectCartOpen = (state) => state.cart.cartOpen;

export default cartSlice.reducer;