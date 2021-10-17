import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [],
    currentCategory: ''
};

export const categorySlice = createSlice({
    name: 'category',

    initialState,

    reducers: {
        REDUX_UPDATE_CATEGORIES: (state, action) => {
            state.categories = action.payload
        },

        REDUX_UPDATE_CURRENT_CATEGORY: (state, action) => {
            state.currentCategory = action.payload
        }
    }
});

export const {REDUX_UPDATE_CATEGORIES, REDUX_UPDATE_CURRENT_CATEGORY} = categorySlice.actions;

export const selectCategories = (state) => state.category.categories;
export const selectCurrentCategory = (state) => state.category.currentCategory;

export default categorySlice.reducer;