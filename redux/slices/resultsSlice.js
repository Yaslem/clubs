import { createSlice } from '@reduxjs/toolkit';
export const resultsSlice = createSlice({
    name: 'resultsSlice',
    initialState: {
        edit: [],
        isEdit: false
    },
    reducers: {
        edit: (state, action) => {
            state.edit = action.payload;
        },
        isEdit: (state, action) => {
            state.isEdit = action.payload;
        },
    },
})

export const resultsActions = resultsSlice.actions

export default resultsSlice.reducer