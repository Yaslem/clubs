import { createSlice } from '@reduxjs/toolkit';
export const headerSlice = createSlice({
    name: 'headerSlice',
    initialState: {
        title: 'الرئيسية',
    },
    reducers: {
        get: (state, action) => {
            state.title = action.payload;
        },
    },
})

export const headerActions = headerSlice.actions

export default headerSlice.reducer