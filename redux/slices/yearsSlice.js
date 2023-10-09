import { createSlice } from '@reduxjs/toolkit';
export const yearsSlice = createSlice({
    name: 'activitiesSlice',
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

export const yearsActions = yearsSlice.actions

export default yearsSlice.reducer
