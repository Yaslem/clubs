import { createSlice } from '@reduxjs/toolkit';
export const collegesSlice = createSlice({
    name: 'collegesSlice',
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

export const collegesActions = collegesSlice.actions

export default collegesSlice.reducer
