import { createSlice } from '@reduxjs/toolkit';
export const designsSlice = createSlice({
    name: 'designsSlice',
    initialState: {
        edit: [],
        show: [],
        result: '',
        count: 0,
        countSearch: 0,
        designs: {
            docs: [],
            status: false
        },
        isEdit: false,
        isShow: false,
    },
    reducers: {
        get: (state, action) => {
            state.designs = action.payload;
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

export const designsActions = designsSlice.actions

export default designsSlice.reducer