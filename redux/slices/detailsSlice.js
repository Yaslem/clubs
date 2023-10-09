import { createSlice } from '@reduxjs/toolkit';
export const detailsSlice = createSlice({
    name: 'detailsSlice',
    initialState: {
        isTrue: false,
    },
    reducers: {
        isTrue: (state, action) => {
            state.isTrue = action.payload;
        },
    },
})

export const detailsActions = detailsSlice.actions

export default detailsSlice.reducer