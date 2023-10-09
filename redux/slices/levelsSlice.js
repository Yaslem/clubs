import { createSlice } from '@reduxjs/toolkit';
export const levelsSlice = createSlice({
    name: 'levelsSlice',
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

export const levelsActions = levelsSlice.actions

export default levelsSlice.reducer
