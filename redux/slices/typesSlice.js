import { createSlice } from '@reduxjs/toolkit';
export const typesSlice = createSlice({
    name: 'typesSlice',
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

export const typesActions = typesSlice.actions

export default typesSlice.reducer
