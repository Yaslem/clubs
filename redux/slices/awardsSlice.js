import { createSlice } from '@reduxjs/toolkit';
export const awardsSlice = createSlice({
    name: 'awardsSlice',
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

export const awardsActions = awardsSlice.actions

export default awardsSlice.reducer
