import { createSlice } from '@reduxjs/toolkit';
export const profilesSlice = createSlice({
    name: 'profilesSlice',
    initialState: {
        isEdit: false,
        isEditPassword: false,
        isShow: false,
        data: []
    },
    reducers: {
        get: (state, action) => {
            state.data = action.payload;
        },
        isShow: (state, action) => {
            state.isShow = action.payload;
        },
        isEdit: (state, action) => {
            state.isEdit = action.payload;
        },
        isEditPassword: (state, action) => {
            state.isEditPassword = action.payload;
        },
    },
})

export const profilesActions = profilesSlice.actions

export default profilesSlice.reducer
