import { createSlice } from '@reduxjs/toolkit';
export const TimesSlice = createSlice({
    name: 'TimesSlice',
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

export const timesActions = TimesSlice.actions

export default TimesSlice.reducer
