import { createSlice } from '@reduxjs/toolkit';
export const discoursesSlice = createSlice({
    name: 'discoursesSlice',
    initialState: {
        edit: [],
        show: [],
        result: '',
        count: 0,
        countSearch: 0,
        discourses: {
            docs: [],
            status: false
        },
        isEdit: false,
        isShow: false,
    },
    reducers: {
        get: (state, action) => {
            state.discourses = action.payload;
        },
        result: (state, action) => {
            state.result = action.payload;
        },
        count: (state, action) => {
            state.count = action.payload;
        },
        countSearch: (state, action) => {
            state.countSearch = action.payload;
        },
        edit: (state, action) => {
            state.edit = action.payload;
        },
        show: (state, action) => {
            state.show = action.payload;
        },
        isShow: (state, action) => {
            state.isShow = action.payload;
        },
        isEdit: (state, action) => {
            state.isEdit = action.payload;
        },
    },
})

export const discoursesActions = discoursesSlice.actions

export default discoursesSlice.reducer
