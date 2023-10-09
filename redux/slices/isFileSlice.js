import { createSlice } from '@reduxjs/toolkit';
export const isFileSlice = createSlice({
    name: 'isFileSlice',
    initialState: {
        isFile: false,
    },
    reducers: {
        set: (state, action) => {
            state.isFile = action.payload;
        },
    },
})

export const isFileActions = isFileSlice.actions

export default isFileSlice.reducer
