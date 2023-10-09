import { createSlice } from '@reduxjs/toolkit';
export const paginationSlice = createSlice({
    name: 'paginationSlice',
    initialState: {
        high: {
            isPagination: false,
            data: [],
            prev: 0,
            next: 2,
            currentPage: 1,
            states: {
                isPagination: false,
                data: [],
                prev: 0,
                next: 2,
                currentPage: 1,
            },
            counties: {
                isPagination: false,
                data: [],
                prev: 0,
                next: 2,
                currentPage: 1,
            },
            schools: {
                isPagination: false,
                data: [],
                prev: 0,
                next: 2,
                currentPage: 1,
            },
        },
        middle: {
            isPagination: false,
            data: [],
            prev: 0,
            next: 2,
            currentPage: 1,
            states: {
                isPagination: false,
                data: [],
                prev: 0,
                next: 2,
                currentPage: 1,
            },
            counties: {
                isPagination: false,
                data: [],
                prev: 0,
                next: 2,
                currentPage: 1,
            },
            schools: {
                isPagination: false,
                data: [],
                prev: 0,
                next: 2,
                currentPage: 1,
            },
        },
        elementary: {
            isPagination: false,
            data: [],
            prev: 0,
            next: 2,
            currentPage: 1,
            states: {
                isPagination: false,
                data: [],
                prev: 0,
                next: 2,
                currentPage: 1,
            },
            counties: {
                isPagination: false,
                data: [],
                prev: 0,
                next: 2,
                currentPage: 1,
            },
            schools: {
                isPagination: false,
                data: [],
                prev: 0,
                next: 2,
                currentPage: 1,
            },
        },

    },
    reducers: {
        // high
        getHigh: (state, action) => {
            state.high.data = action.payload;
        },
        getPrevHigh: (state, action) => {
            state.high.prev = action.payload;
        },
        getNextHigh: (state, action) => {
            state.high.next = action.payload;
        },
        getCurrentPageHigh: (state, action) => {
            state.high.currentPage = action.payload;
        },

        // high -> State
        getStatesHigh: (state, action) => {
            state.high.states.data = action.payload;
        },
        getStatesNextHigh: (state, action) => {
            state.high.states.next = action.payload;
        },
        getStatesPrevHigh: (state, action) => {
            state.high.states.prev = action.payload;
        },
        getStatesIsPaginationHigh: (state, action) => {
            state.high.states.isPagination = action.payload;
        },
        getstatesCurrentPageHigh: (state, action) => {
            state.high.states.currentPage = action.payload;
        },

        // high -> County
        getCountiesHigh: (state, action) => {
            state.high.counties.data = action.payload;
        },
        getCountiesNextHigh: (state, action) => {
            state.high.counties.next = action.payload;
        },
        getCountiesPrevHigh: (state, action) => {
            state.high.counties.prev = action.payload;
        },
        getCountiesIsPaginationHigh: (state, action) => {
            state.high.counties.isPagination = action.payload;
        },
        getCountiesCurrentPageHigh: (state, action) => {
            state.high.counties.currentPage = action.payload;
        },

        // high -> School
        getSchoolsHigh: (state, action) => {
            state.high.schools.data = action.payload;
        },
        getSchoolsNextHigh: (state, action) => {
            state.high.schools.next = action.payload;
        },
        getSchoolsPrevHigh: (state, action) => {
            state.high.schools.prev = action.payload;
        },
        getSchoolsIsPaginationHigh: (state, action) => {
            state.high.schools.isPagination = action.payload;
        },
        isPaginationHigh: (state, action) => {
            state.high.isPagination = action.payload;
        },
        getSchoolsCurrentPageHigh: (state, action) => {
            state.high.schools.currentPage = action.payload;
        },

        // Middle
        getMiddle: (state, action) => {
            state.middle.data = action.payload;
        },
        getPrevMiddle: (state, action) => {
            state.middle.prev = action.payload;
        },
        getNextMiddle: (state, action) => {
            state.middle.next = action.payload;
        },
        getCurrentPageMiddle: (state, action) => {
            state.middle.currentPage = action.payload;
        },

        // Middle -> State
        getStatesMiddle: (state, action) => {
            state.middle.states.data = action.payload;
        },
        getStatesNextMiddle: (state, action) => {
            state.middle.states.next = action.payload;
        },
        getStatesPrevMiddle: (state, action) => {
            state.middle.states.prev = action.payload;
        },
        getStatesIsPaginationMiddle: (state, action) => {
            state.middle.states.isPagination = action.payload;
        },
        getStatesCurrentPageMiddle: (state, action) => {
            state.middle.states.currentPage = action.payload;
        },

        // Middle -> County
        getCountiesMiddle: (state, action) => {
            state.middle.counties.data = action.payload;
        },
        getCountiesNextMiddle: (state, action) => {
            state.middle.counties.next = action.payload;
        },
        getCountiesPrevMiddle: (state, action) => {
            state.middle.counties.prev = action.payload;
        },
        getCountiesIsPaginationMiddle: (state, action) => {
            state.middle.counties.isPagination = action.payload;
        },
        getCountiesCurrentPageMiddle: (state, action) => {
            state.middle.counties.currentPage = action.payload;
        },

        // Middle -> School
        getSchoolsMiddle: (state, action) => {
            state.middle.schools.data = action.payload;
        },
        getSchoolsNextMiddle: (state, action) => {
            state.middle.schools.next = action.payload;
        },
        getSchoolsPrevMiddle: (state, action) => {
            state.middle.schools.prev = action.payload;
        },
        getSchoolsIsPaginationMiddle: (state, action) => {
            state.middle.schools.isPagination = action.payload;
        },
        isPaginationMiddle: (state, action) => {
            state.middle.isPagination = action.payload;
        },
        getSchoolsCurrentPageMiddle: (state, action) => {
            state.middle.schools.currentPage = action.payload;
        },

        // Elementary
        getElementary: (state, action) => {
            state.elementary.data = action.payload;
        },
        getPrevElementary: (state, action) => {
            state.elementary.prev = action.payload;
        },
        getNextElementary: (state, action) => {
            state.elementary.next = action.payload;
        },
        getCurrentPageElementary: (state, action) => {
            state.elementary.currentPage = action.payload;
        },

        // Elementary -> State
        getStatesElementary: (state, action) => {
            state.elementary.states.data = action.payload;
        },
        getStatesNextElementary: (state, action) => {
            state.elementary.states.next = action.payload;
        },
        getStatesPrevElementary: (state, action) => {
            state.elementary.states.prev = action.payload;
        },
        getStatesIsPaginationElementary: (state, action) => {
            state.elementary.states.isPagination = action.payload;
        },
        getStatesCurrentPageElementary: (state, action) => {
            state.elementary.states.currentPage = action.payload;
        },

        // Elementary -> County
        getCountiesElementary: (state, action) => {
            state.elementary.counties.data = action.payload;
        },
        getCountiesNextElementary: (state, action) => {
            state.elementary.counties.next = action.payload;
        },
        getCountiesPrevElementary: (state, action) => {
            state.elementary.counties.prev = action.payload;
        },
        getCountiesIsPaginationElementary: (state, action) => {
            state.elementary.counties.isPagination = action.payload;
        },
        getCountiesCurrentPageElementary: (state, action) => {
            state.elementary.counties.currentPage = action.payload;
        },

        // Elementary -> School
        getSchoolsElementary: (state, action) => {
            state.elementary.schools.data = action.payload;
        },
        getSchoolsNextElementary: (state, action) => {
            state.elementary.schools.next = action.payload;
        },
        getSchoolsPrevElementary: (state, action) => {
            state.elementary.schools.prev = action.payload;
        },
        getSchoolsIsPaginationElementary: (state, action) => {
            state.elementary.schools.isPagination = action.payload;
        },
        isPaginationElementary: (state, action) => {
            state.elementary.isPagination = action.payload;
        },
        getSchoolsCurrentPageElementary: (state, action) => {
            state.elementary.schools.currentPage = action.payload;
        },
    },
})

export const paginationActions = paginationSlice.actions
export default paginationSlice.reducer