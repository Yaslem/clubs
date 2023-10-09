import { createSlice } from '@reduxjs/toolkit';
export const sideSlice = createSlice({
    name: 'sideSlice',
    initialState: {
        isActive: false,
        isHide: false,
        isOpen: true,
    },
    reducers: {
        isActive: (state, action) => {
            state.isActive = action.payload;
        },
        isHide: (state, action) => {
            state.isHide = action.payload;
        },
        isOpen: (state, action) => {
            state.isOpen = action.payload;
        },
    },
})

export const sideActions = sideSlice.actions

export default sideSlice.reducer