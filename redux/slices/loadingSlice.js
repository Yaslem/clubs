import { createSlice } from '@reduxjs/toolkit';
export const loadingSlice = createSlice({
    name: 'loadingSlice',
    initialState: {
        isLoading: false,
    },
    reducers: {
        isLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
})

export const loadingActions = loadingSlice.actions

export default loadingSlice.reducer