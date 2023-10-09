import { createSlice } from '@reduxjs/toolkit';
export const clubsSlice = createSlice({
    name: 'clubsSlice',
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

export const clubsActions = clubsSlice.actions

export default clubsSlice.reducer
