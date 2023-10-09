import { createSlice } from '@reduxjs/toolkit';
export const widthSlice = createSlice({
    name: 'widthSlice',
    initialState: {
        sideBar: 200,
    },
    reducers: {
        setSideBar: (state, action) => {
            state.sideBar = action.payload;
        },
    },
})

export const widthActions = widthSlice.actions

export default widthSlice.reducer
