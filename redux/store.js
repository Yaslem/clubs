import { configureStore } from '@reduxjs/toolkit'
import typesReducer from "./slices/typesSlice";
import yearsReducer from "./slices/yearsSlice";
import countriesReducer from "./slices/countriesSlice";
import collegesReducer from "./slices/collegesSlice";
import awardsReducer from "./slices/awardsSlice";
import levelsReducer from "./slices/levelsSlice";
import headerReducer from "./slices/headerSlice";
import loadingReducer from "./slices/loadingSlice";
import sideReducer from "./slices/sideSlice";
import isFileReducer from "./slices/isFileSlice";
import locationsReducer from "./slices/locationsSlice";
import datesReducer from "./slices/datesSlice";
import administrativeReducer from "./slices/administrativeSlice";
import timesReducer from "./slices/TimesSlice";
import studentsReducer from "./slices/studentsSlice";
import clubsReducer from "./slices/clubsSlice";
import activitiesReducer from "./slices/activitiesSlice";
import profilesReducer from "./slices/profilesSlice";
import postsReducer from "./slices/postsSlice";
import widthReducer from "./slices/widthSlice";
import reportsReducer from "./slices/reportsSlice";
import designsReducer from "./slices/designsSlice";
import discoursesReducer from "./slices/discoursesSlice";
import contactsReducer from "./slices/contactsSlice";
import attendeesReducer from "./slices/attendeesSlice";
import resultsReducer from "./slices/resultsSlice";
import reviewsReducer from "./slices/reviewsSlice";
import commentsReducer from "./slices/commentsSlice";
import certificatesReducer from "./slices/certificatesSlice";
import awardsAndActivitiesReducer from "./slices/awardsAndActivitiesSlice";
import certificatesAndActivitiesReducer from "./slices/certificatesAndActivitiesSlice";

const store = configureStore({
    reducer: {
        types: typesReducer,
        years: yearsReducer,
        posts: postsReducer,
        reports: reportsReducer,
        countries: countriesReducer,
        attendees: attendeesReducer,
        reviews: reviewsReducer,
        profiles: profilesReducer,
        width: widthReducer,
        results: resultsReducer,
        certificates: certificatesReducer,
        awardsAndActivities: awardsAndActivitiesReducer,
        certificatesAndActivities: certificatesAndActivitiesReducer,
        colleges: collegesReducer,
        awards: awardsReducer,
        activities: activitiesReducer,
        clubs: clubsReducer,
        dates: datesReducer,
        comments: commentsReducer,
        students: studentsReducer,
        contacts: contactsReducer,
        designs: designsReducer,
        discourses: discoursesReducer,
        levels: levelsReducer,
        times: timesReducer,
        locations: locationsReducer,
        administrative: administrativeReducer,
        header: headerReducer,
        loading: loadingReducer,
        side: sideReducer,
        isFile: isFileReducer,
    },
})

export default store;
