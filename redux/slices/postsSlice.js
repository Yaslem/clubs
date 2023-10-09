import { createSlice } from '@reduxjs/toolkit';
export const postsSlice = createSlice({
    name: 'postsSlice',
    initialState: {
        edit: [],
        show: [],
        result: '',
        count: 0,
        countSearch: 0,
        posts: {
            docs: [],
            status: false
        },
        isEdit: false,
        isShow: false,
    },
    reducers: {
        get: (state, action) => {
            state.posts = action.payload;
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

export const postsActions = postsSlice.actions

export default postsSlice.reducer
