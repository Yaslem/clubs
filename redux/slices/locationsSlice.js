import { createSlice } from '@reduxjs/toolkit';
export const locationsSlice = createSlice({
    name: 'locationsSlice',
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

export const locationsActions = locationsSlice.actions

export default locationsSlice.reducer
