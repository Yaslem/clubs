import { createSlice } from '@reduxjs/toolkit';
export const administrativeSlice = createSlice({
    name: 'administrativeSlice',
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

export const administrativeActions = administrativeSlice.actions

export default administrativeSlice.reducer
