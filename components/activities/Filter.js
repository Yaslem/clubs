import Styles from "../../styles/activities/Filter.module.css"
import axios from "axios";
import useSWR from "swr";
import {activitiesActions} from "../../redux/slices/activitiesSlice";
import {useDispatch} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {useRef, useState} from "react";
import {studentsActions} from "../../redux/slices/studentsSlice";
import {postsActions} from "../../redux/slices/postsSlice";
import {contactsActions} from "../../redux/slices/contactsSlice";
import {reviewsActions} from "../../redux/slices/reviewsSlice";
import {reportsActions} from "../../redux/slices/reportsSlice";
import {useSession} from "next-auth/react";
import {designsActions} from "../../redux/slices/designsSlice";
import {discoursesActions} from "../../redux/slices/discoursesSlice";
const fetcher = url => axios.get(url).then(res => res.data);
export default ({url, isPosts = false, isActivities, isStudents = false, isContacts = false, isAttendees = false, isReports = false, isDesigns = false, isDiscourses = false}) => {
    const dispatch = useDispatch()
    const {data: session} = useSession()
    const [titleSearch, setTitleSearch] = useState('')
    const dateRef = useRef()
    const startDateRef = useRef()
    const endDateRef = useRef()
    const [isDate, setIsDate] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const { data, isError, isLoading } = useSWR(isAttendees ? `/${url}/getFilters` : `/${url}/get`, fetcher)
    if (isLoading) return;
    function filterActivities(by, value){
        switch (by) {
            case "title":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(url == "posts"){
                            if(res.data.success == true){
                                dispatch(postsActions.get({
                                    docs: res.data.posts,
                                    status: true
                                }))
                                dispatch(postsActions.countSearch(res.data.posts.length))
                                dispatch(postsActions.result(`نتائج البحث عن: "${value}"`))
                            }else {
                                dispatch(postsActions.countSearch(0))
                                dispatch(postsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "activities") {
                            if(res.data.success == true){
                                dispatch(activitiesActions.get({
                                    docs: res.data.activities,
                                    status: true
                                }))
                                dispatch(activitiesActions.countSearch(res.data.activities.length))
                                dispatch(activitiesActions.result(`نتائج البحث عن: "${value}"`))
                            }else {
                                dispatch(activitiesActions.countSearch(0))
                                dispatch(activitiesActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "contacts") {
                            if(res.data.success == true){
                                dispatch(contactsActions.get({
                                    docs: res.data.contacts,
                                    status: true
                                }))
                                dispatch(contactsActions.countSearch(res.data.contacts.length))
                                dispatch(contactsActions.result(`نتائج البحث عن: "${value}"`))
                            }else {
                                dispatch(contactsActions.countSearch(0))
                                dispatch(contactsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "attendees") {
                            if(res.data.success == true){
                                dispatch(reviewsActions.get({
                                    docs: res.data.reviews,
                                    status: true
                                }))
                                dispatch(reviewsActions.countSearch(res.data.reviews.length))
                                dispatch(reviewsActions.result(`نتائج البحث عن تقييم فعالية بعنوان: "${value}"`))
                            }else {
                                dispatch(reviewsActions.countSearch(0))
                                dispatch(reviewsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "reports") {
                            if(res.data.success == true){
                                dispatch(reportsActions.get({
                                    docs: res.data.reports,
                                    status: true
                                }))
                                dispatch(reportsActions.countSearch(res.data.reports.length))
                                dispatch(reportsActions.result(`نتائج البحث عن تقرير فعالية بعنوان: "${value}"`))
                            }else {
                                dispatch(reportsActions.countSearch(0))
                                dispatch(reportsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "designs") {
                            if(res.data.success == true){
                                dispatch(designsActions.get({
                                    docs: res.data.designs,
                                    status: true
                                }))
                                dispatch(designsActions.countSearch(res.data.designs.length))
                                dispatch(designsActions.result(`نتائج البحث عن تصميم فعالية بعنوان: "${value}"`))
                            }else {
                                dispatch(designsActions.countSearch(0))
                                dispatch(designsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "discourses") {
                            if(res.data.success == true){
                                dispatch(discoursesActions.get({
                                    docs: res.data.discourses,
                                    status: true
                                }))
                                dispatch(discoursesActions.countSearch(res.data.discourses.length))
                                dispatch(discoursesActions.result(`نتائج البحث عن خطاب فعالية بعنوان: "${value}"`))
                            }else {
                                dispatch(discoursesActions.countSearch(0))
                                dispatch(discoursesActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }
                    });
                }else {
                    if(url == "posts"){
                        dispatch(postsActions.countSearch(0))
                        dispatch(postsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "activities"){
                        dispatch(activitiesActions.countSearch(0))
                        dispatch(activitiesActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "contacts"){
                        dispatch(contactsActions.countSearch(0))
                        dispatch(contactsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "attendees"){
                        dispatch(reviewsActions.countSearch(0))
                        dispatch(reviewsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "reports"){
                        dispatch(reportsActions.countSearch(0))
                        dispatch(reportsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "designs"){
                        dispatch(designsActions.countSearch(0))
                        dispatch(designsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "discourses"){
                        dispatch(discoursesActions.countSearch(0))
                        dispatch(discoursesActions.get({
                            docs: [],
                            status: false
                        }))
                    }
                }
                break;
            case "club":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(url == "posts"){
                            if(res.data.success == true){
                                dispatch(postsActions.get({
                                    docs: res.data.posts,
                                    status: true
                                }))
                                dispatch(postsActions.countSearch(res.data.posts.length))
                                dispatch(postsActions.result(`نتائج البحث عن منشور في: "${res.data.club.name}"`))
                            }else {
                                dispatch(postsActions.countSearch(0))
                                dispatch(postsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "activities"){
                            if(res.data.success == true){
                                dispatch(activitiesActions.get({
                                    docs: res.data.activities,
                                    status: true
                                }))
                                dispatch(activitiesActions.countSearch(res.data.activities.length))
                                dispatch(activitiesActions.result(`نتائج البحث عن فعالية في: "${res.data.club.name}"`))
                            }else {
                                dispatch(activitiesActions.countSearch(0))
                                dispatch(activitiesActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "contacts"){
                            if(res.data.success == true){
                                dispatch(contactsActions.get({
                                    docs: res.data.contacts,
                                    status: true
                                }))
                                dispatch(contactsActions.countSearch(res.data.contacts.length))
                                dispatch(contactsActions.result(`نتائج البحث عن فعالية في: "${res.data.club.name}"`))
                            }else {
                                dispatch(contactsActions.countSearch(0))
                                dispatch(contactsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "attendees") {
                            if(res.data.success == true){
                                dispatch(reviewsActions.get({
                                    docs: res.data.reviews,
                                    status: true
                                }))
                                dispatch(reviewsActions.countSearch(res.data.reviews.length))
                                dispatch(reviewsActions.result(`نتائج البحث عن تقييم فعالية في: "${res.data.club.name}"`))
                            }else {
                                dispatch(reviewsActions.countSearch(0))
                                dispatch(reviewsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "reports") {
                            if(res.data.success == true){
                                dispatch(reportsActions.get({
                                    docs: res.data.reports,
                                    status: true
                                }))
                                dispatch(reportsActions.countSearch(res.data.reports.length))
                                dispatch(reportsActions.result(`نتائج البحث عن تقرير فعالية في: "${res.data.club.name}"`))
                            }else {
                                dispatch(reportsActions.countSearch(0))
                                dispatch(reportsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "designs") {
                            if(res.data.success == true){
                                dispatch(designsActions.get({
                                    docs: res.data.designs,
                                    status: true
                                }))
                                dispatch(designsActions.countSearch(res.data.designs.length))
                                dispatch(designsActions.result(`نتائج البحث عن تصميم فعالية في: "${res.data.club.name}"`))
                            }else {
                                dispatch(designsActions.countSearch(0))
                                dispatch(designsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "discourses") {
                            if(res.data.success == true){
                                dispatch(discoursesActions.get({
                                    docs: res.data.discourses,
                                    status: true
                                }))
                                dispatch(discoursesActions.countSearch(res.data.discourses.length))
                                dispatch(discoursesActions.result(`نتائج البحث عن خطاب فعالية في: "${res.data.club.name}"`))
                            }else {
                                dispatch(discoursesActions.countSearch(0))
                                dispatch(discoursesActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }
                    });
                }else {
                    if(url == "posts"){
                        dispatch(postsActions.countSearch(0))
                        dispatch(postsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "activities"){
                        dispatch(activitiesActions.countSearch(0))
                        dispatch(activitiesActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "contacts"){
                        dispatch(contactsActions.countSearch(0))
                        dispatch(contactsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "attendees"){
                        dispatch(reviewsActions.countSearch(0))
                        dispatch(reviewsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "reports"){
                        dispatch(reportsActions.countSearch(0))
                        dispatch(reportsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "designs"){
                        dispatch(designsActions.countSearch(0))
                        dispatch(designsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "discourses"){
                        dispatch(discoursesActions.countSearch(0))
                        dispatch(discoursesActions.get({
                            docs: [],
                            status: false
                        }))
                    }
                }
                break;
            case "clubUser":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(res.data.success == true){
                            dispatch(studentsActions.get({
                                docs: res.data.students,
                                status: true
                            }))
                            dispatch(studentsActions.countSearch(res.data.students.length))
                            dispatch(studentsActions.result(`نتائج البحث عن طالب في: "${res.data.club.name}"`))
                        }else {
                            dispatch(studentsActions.countSearch(0))
                            dispatch(studentsActions.get({
                                docs: [],
                                status: false
                            }))
                        }
                    });
                }else {
                    dispatch(studentsActions.countSearch(0))
                    dispatch(studentsActions.get({
                        docs: [],
                        status: false
                    }))
                }
                break;
            case "location":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                    if(url == "activities") {
                        if(res.data.success == true){
                            dispatch(activitiesActions.get({
                                docs: res.data.activities,
                                status: true
                            }))
                            dispatch(activitiesActions.countSearch(res.data.activities.length))
                            dispatch(activitiesActions.result(`نتائج البحث عن فعالية في: "${res.data.location.name}"`))
                        }else {
                            dispatch(activitiesActions.countSearch(0))
                            dispatch(activitiesActions.get({
                                docs: [],
                                status: false
                            }))
                        }
                    } else if(url == "attendees") {
                            if(res.data.success == true){
                                dispatch(reviewsActions.get({
                                    docs: res.data.reviews,
                                    status: true
                                }))
                                dispatch(reviewsActions.countSearch(res.data.reviews.length))
                                dispatch(reviewsActions.result(`نتائج البحث عن تقييم فعالية في: "${res.data.location.name}"`))
                            }else {
                                dispatch(reviewsActions.countSearch(0))
                                dispatch(reviewsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "reports") {
                            if(res.data.success == true){
                                dispatch(reportsActions.get({
                                    docs: res.data.reports,
                                    status: true
                                }))
                                dispatch(reportsActions.countSearch(res.data.reports.length))
                                dispatch(reportsActions.result(`نتائج البحث عن تقرير فعالية في: "${res.data.location.name}"`))
                            }else {
                                dispatch(reportsActions.countSearch(0))
                                dispatch(reportsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }
                    });
                }else {
                    if(url == "activities"){
                        dispatch(activitiesActions.countSearch(0))
                        dispatch(activitiesActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "attendees"){
                        dispatch(reviewsActions.countSearch(0))
                        dispatch(reviewsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "reports"){
                        dispatch(reportsActions.countSearch(0))
                        dispatch(reportsActions.get({
                            docs: [],
                            status: false
                        }))
                    }
                }
                break;
            case "type":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(url == "activities"){
                            if(res.data.success == true){
                                dispatch(activitiesActions.get({
                                    docs: res.data.activities,
                                    status: true
                                }))
                                dispatch(activitiesActions.countSearch(res.data.activities.length))
                                dispatch(activitiesActions.result(`نتائج البحث عن: "${res.data.type.name}"`))
                            }else {
                                dispatch(activitiesActions.countSearch(0))
                                dispatch(activitiesActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "contacts"){
                            if(res.data.success == true){
                                dispatch(contactsActions.get({
                                    docs: res.data.contacts,
                                    status: true
                                }))
                                dispatch(contactsActions.countSearch(res.data.contacts.length))
                                dispatch(contactsActions.result(`نتائج البحث عن طلب بتصنيف: "${value}"`))
                            }else {
                                dispatch(contactsActions.countSearch(0))
                                dispatch(contactsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "attendees"){
                            if(res.data.success == true){
                                dispatch(reviewsActions.get({
                                    docs: res.data.reviews,
                                    status: true
                                }))
                                dispatch(reviewsActions.countSearch(res.data.reviews.length))
                                dispatch(reviewsActions.result(`نتائج البحث عن تقييم فعالية من نوع: "${res.data.type.name}"`))
                            }else {
                                dispatch(reviewsActions.countSearch(0))
                                dispatch(reviewsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "reports"){
                            if(res.data.success == true){
                                dispatch(reportsActions.get({
                                    docs: res.data.reports,
                                    status: true
                                }))
                                dispatch(reportsActions.countSearch(res.data.reports.length))
                                dispatch(reportsActions.result(`نتائج البحث عن تقرير فعالية من نوع: "${res.data.type.name}"`))
                            }else {
                                dispatch(reportsActions.countSearch(0))
                                dispatch(reportsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "designs"){
                            if(res.data.success == true){
                                dispatch(designsActions.get({
                                    docs: res.data.designs,
                                    status: true
                                }))
                                dispatch(designsActions.countSearch(res.data.designs.length))
                                dispatch(designsActions.result(`نتائج البحث عن تصميم فعالية من نوع: "${res.data.type.name}"`))
                            }else {
                                dispatch(designsActions.countSearch(0))
                                dispatch(designsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "discourses"){
                            if(res.data.success == true){
                                dispatch(discoursesActions.get({
                                    docs: res.data.discourses,
                                    status: true
                                }))
                                dispatch(discoursesActions.countSearch(res.data.discourses.length))
                                dispatch(discoursesActions.result(`نتائج البحث عن خطاب فعالية من نوع: "${res.data.type.name}"`))
                            }else {
                                dispatch(discoursesActions.countSearch(0))
                                dispatch(discoursesActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }

                    });
                }else {
                    if(url == "activities"){
                        dispatch(activitiesActions.countSearch(0))
                        dispatch(activitiesActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "contacts"){
                        dispatch(contactsActions.countSearch(0))
                        dispatch(contactsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "attendees"){
                        dispatch(reviewsActions.countSearch(0))
                        dispatch(reviewsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "reports"){
                        dispatch(reportsActions.countSearch(0))
                        dispatch(reportsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "designs"){
                        dispatch(designsActions.countSearch(0))
                        dispatch(designsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "discourses"){
                        dispatch(discoursesActions.countSearch(0))
                        dispatch(discoursesActions.get({
                            docs: [],
                            status: false
                        }))
                    }
                }
                break;
            case "status":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(url == "activities"){
                            if(res.data.success == true){
                                dispatch(activitiesActions.get({
                                    docs: res.data.activities,
                                    status: true
                                }))
                                dispatch(activitiesActions.countSearch(res.data.activities.length))
                                dispatch(activitiesActions.result(`نتائج البحث عن فعالية: "${value}"`))
                            }else {
                                dispatch(activitiesActions.countSearch(0))
                                dispatch(activitiesActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "contacts"){
                            if(res.data.success == true){
                                dispatch(contactsActions.get({
                                    docs: res.data.contacts,
                                    status: true
                                }))

                                function getStatusContact(statusValue){
                                    switch (statusValue) {
                                        case "completed":
                                            return "مكتمل"
                                            break
                                        case "canceled":
                                            return "ملغى"
                                            break
                                        case "pending":
                                            return "تحت التنفيذ"
                                            break
                                    }
                                }

                                dispatch(contactsActions.countSearch(res.data.contacts.length))
                                dispatch(contactsActions.result(`نتائج البحث عن طلب: "${getStatusContact(value)}"`))
                            }else {
                                dispatch(contactsActions.countSearch(0))
                                dispatch(contactsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "designs"){
                            if(res.data.success == true){
                                dispatch(designsActions.get({
                                    docs: res.data.designs,
                                    status: true
                                }))

                                function getStatusContact(statusValue){
                                    switch (statusValue) {
                                        case "completed":
                                            return "تم تصميها"
                                            break
                                        case "canceled":
                                            return "لم يتم تصميمها"
                                            break
                                        case "pending":
                                            return "تحت التنفيذ"
                                            break
                                    }
                                }

                                dispatch(designsActions.countSearch(res.data.designs.length))
                                dispatch(designsActions.result(`نتائج البحث عن فعالية: "${getStatusContact(value)}"`))
                            }else {
                                dispatch(designsActions.countSearch(0))
                                dispatch(designsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "discourses"){
                            if(res.data.success == true){
                                dispatch(discoursesActions.get({
                                    docs: res.data.discourses,
                                    status: true
                                }))

                                function getStatusContact(statusValue){
                                    switch (statusValue) {
                                        case "completed":
                                            return "تمت الموافقة عليه"
                                            break
                                        case "canceled":
                                            return "لم تتم الموافقة عليه"
                                            break
                                        case "pending":
                                            return "تحت التنفيذ"
                                            break
                                    }
                                }

                                dispatch(discoursesActions.countSearch(res.data.discourses.length))
                                dispatch(discoursesActions.result(`نتائج البحث عن خطاب: "${getStatusContact(value)}"`))
                            }else {
                                dispatch(discoursesActions.countSearch(0))
                                dispatch(discoursesActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }

                    });
                }else {
                    if(url == "activities"){
                        dispatch(activitiesActions.countSearch(0))
                        dispatch(activitiesActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "contacts"){
                        dispatch(contactsActions.countSearch(0))
                        dispatch(contactsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "designs"){
                        dispatch(designsActions.countSearch(0))
                        dispatch(designsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "discourses"){
                        dispatch(discoursesActions.countSearch(0))
                        dispatch(discoursesActions.get({
                            docs: [],
                            status: false
                        }))
                    }
                }
                break;
            case "isShare":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(res.data.success == true){
                            dispatch(activitiesActions.get({
                                docs: res.data.activities,
                                status: true
                            }))
                            dispatch(activitiesActions.countSearch(res.data.activities.length))
                            const title = value === true ? 'مشتركة' : 'غير مشتركة'
                            dispatch(activitiesActions.result(`نتائج البحث عن فعالية: "${title}"`))
                        }else{
                            dispatch(activitiesActions.countSearch(0))
                            dispatch(activitiesActions.get({
                                docs: [],
                                status: false
                            }))
                        }

                    });
                }else {
                    dispatch(activitiesActions.countSearch(0))
                    dispatch(activitiesActions.get({
                        docs: [],
                        status: false
                    }))
                }
                break;
            case "date":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(res.data.success == true){
                            dispatch(activitiesActions.get({
                                docs: res.data.activities,
                                status: true
                            }))
                            dispatch(activitiesActions.countSearch(res.data.activities.length))
                            dispatch(activitiesActions.result(`نتائج البحث عن فعالية بتاريح: "${value}"`))
                        }else {
                            dispatch(activitiesActions.countSearch(0))
                            dispatch(activitiesActions.get({
                                docs: [],
                                status: false
                            }))
                        }

                    });
                }else {
                    dispatch(activitiesActions.countSearch(0))
                    dispatch(activitiesActions.get({
                        docs: [],
                        status: false
                    }))
                }
                break;
            case "between":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&start=${value.start}&end=${value.end}`).then(res => {
                        if(res.data.success == true){
                            dispatch(activitiesActions.get({
                                docs: res.data.activities,
                                status: true
                            }))
                            dispatch(activitiesActions.countSearch(res.data.activities.length))
                            dispatch(activitiesActions.result(`نتائج البحث عن فعالية بين "${value.start}" و "${value.end}"`))
                        }else {
                            dispatch(activitiesActions.countSearch(0))
                            dispatch(activitiesActions.get({
                                docs: [],
                                status: false
                            }))
                        }

                    });
                }else {
                    dispatch(activitiesActions.countSearch(0))
                    dispatch(activitiesActions.get({
                        docs: [],
                        status: false
                    }))
                }
                break;
            case "college":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(res.data.success == true){
                            dispatch(studentsActions.get({
                                docs: res.data.students,
                                status: true
                            }))
                            dispatch(studentsActions.countSearch(res.data.students.length))
                            dispatch(studentsActions.result(`نتائج البحث عن طالب بكلية: "${res.data.college.name}"`))
                        }else {
                            dispatch(studentsActions.countSearch(0))
                            dispatch(studentsActions.get({
                                docs: [],
                                status: false
                            }))
                        }

                    });
                }else {
                    dispatch(studentsActions.countSearch(0))
                    dispatch(studentsActions.get({
                        docs: [],
                        status: false
                    }))
                }
                break;
            case "level":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(res.data.success == true){
                            dispatch(studentsActions.get({
                                docs: res.data.students,
                                status: true
                            }))
                            dispatch(studentsActions.countSearch(res.data.students.length))
                            dispatch(studentsActions.result(`نتائج البحث عن طالب في المستوى: "${res.data.level.name}"`))
                        }else {
                            dispatch(studentsActions.countSearch(0))
                            dispatch(studentsActions.get({
                                docs: [],
                                status: false
                            }))
                        }

                    });
                }else {
                    dispatch(studentsActions.countSearch(0))
                    dispatch(studentsActions.get({
                        docs: [],
                        status: false
                    }))
                }
                break;
            case "name":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(url == "students"){
                            if(res.data.success == true){
                                dispatch(studentsActions.get({
                                    docs: res.data.students,
                                    status: true
                                }))
                                dispatch(studentsActions.countSearch(res.data.students.length))
                                dispatch(studentsActions.result(`نتائج البحث عن طالب باسم: "${value}"`))
                            }else {
                                dispatch(studentsActions.countSearch(0))
                                dispatch(studentsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }else if(url == "attendees"){
                            if(res.data.success == true){
                                dispatch(reviewsActions.get({
                                    docs: res.data.reviews,
                                    status: true
                                }))
                                dispatch(reviewsActions.countSearch(res.data.reviews.length))
                                dispatch(reviewsActions.result(`نتائج البحث عن تقييم طالب باسم: "${value}"`))
                            }else {
                                dispatch(reviewsActions.countSearch(0))
                                dispatch(reviewsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }
                        }

                    });
                }else {
                    if(url == "students"){
                        dispatch(studentsActions.countSearch(0))
                        dispatch(studentsActions.get({
                            docs: [],
                            status: false
                        }))
                    }else if(url == "attendees"){
                        dispatch(reviewsActions.countSearch(0))
                        dispatch(reviewsActions.get({
                            docs: [],
                            status: false
                        }))
                    }
                }
                break;
            case "username":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(res.data.success == true){
                            dispatch(studentsActions.get({
                                docs: res.data.students,
                                status: true
                            }))
                            dispatch(studentsActions.countSearch(res.data.students.length))
                            dispatch(studentsActions.result(`نتائج البحث عن طالب رقمه الجامعي: "${value}"`))
                        }else {
                            dispatch(studentsActions.countSearch(0))
                            dispatch(studentsActions.get({
                                docs: [],
                                status: false
                            }))
                        }

                    });
                }else {
                    dispatch(studentsActions.countSearch(0))
                    dispatch(studentsActions.get({
                        docs: [],
                        status: false
                    }))
                }
                break;
            case "country":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(res.data.success == true){
                            dispatch(studentsActions.get({
                                docs: res.data.students,
                                status: true
                            }))
                            dispatch(studentsActions.countSearch(res.data.students.length))
                            dispatch(studentsActions.result(`نتائج البحث عن طلاب من دولة: "${res.data.country.name}"`))
                        }else {
                            dispatch(studentsActions.countSearch(0))
                            dispatch(studentsActions.get({
                                docs: [],
                                status: false
                            }))
                        }

                    });
                }else {
                    dispatch(studentsActions.countSearch(0))
                    dispatch(studentsActions.get({
                        docs: [],
                        status: false
                    }))
                }
                break;
            case "role":
                if(value.length != 0){
                    axios.get(`/${url}/filter?by=${by}&value=${value}`).then(res => {
                        if(res.data.success == true){
                            dispatch(studentsActions.get({
                                docs: res.data.students,
                                status: true
                            }))
                            dispatch(studentsActions.countSearch(res.data.students.length))
                            dispatch(studentsActions.result(`نتائج البحث عن طلاب من نوع: "${getType(value)}"`))
                        }else {
                            dispatch(studentsActions.countSearch(0))
                            dispatch(studentsActions.get({
                                docs: [],
                                status: false
                            }))
                        }

                    });
                }else {
                    dispatch(studentsActions.countSearch(0))
                    dispatch(studentsActions.get({
                        docs: [],
                        status: false
                    }))
                }
                break;

        }
    }

    function getType(type){
        switch (type){
            case "student":
                return "طالب"
                break;
            case "admin":
                return "مدير الموقع"
                break;
            case "manager":
                return "مدير"
                break;
            case "president":
                return "المشرف"
                break;
            case "officials":
                return "مسؤول"
                break;
            case "deputy":
                return "نائب"
                break;
            case "coordinator":
                return "منسق"
                break;
        }
    }
    function filterDate(){
        return (
            <div className={Styles.filterDate}>
                <div>
                    <div>
                        <label>من</label>
                        <input
                            ref={startDateRef}
                            type={"date"}
                            onChange={e => setStartDate(e.target.value)}
                            defaultValue={startDate}
                        />
                    </div>
                    <div>
                        <label>إلى</label>
                        <input
                            ref={endDateRef}
                            type={"date"}
                            onChange={e => setEndDate(e.target.value)}
                            defaultValue={endDate}
                        />
                    </div>
                </div>
                <span onClick={e => {
                    startDate.length != 0 || endDate.length != 0
                        ? filterActivities('between', {
                            start: startDate,
                            end: endDate
                        })
                        : null
                }} title={startDate.length == 0 || endDate.length == 0
                    ? 'يجب تعيين التاريخ ونهايته'
                    : null} style={startDate.length == 0 || endDate.length == 0 ? {
                    backgroundColor: 'var(--background-color)',
                    cursor: 'not-allowed',
                    color: 'gray'
                } : null}>تطبيق</span>
            </div>
        )
    }



    function getActivitiesElements(){
        return (
            <>
                <div>
                    <label>عنوان الفعالية</label>
                    <div>
                        <input
                            placeholder={'البحث باستخدام عنوان الفعالية'}
                            type={'text'}
                            onChange={e => {
                                setTitleSearch(e.target.value)
                                e.target.value.length == 0 && dispatch(activitiesActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }}
                        />
                        <span className={Styles.search} onClick={e => filterActivities('title', titleSearch)}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                    </div>
                </div>
                <div>
                    <label>اسم النادي</label>
                    <select onChange={ e => filterActivities('club', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.clubs.map(club => club.name != "---" && club.name != "فريق الإدارة" && <option value={club._id}>{club.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>موقع الفعالية</label>
                    <select onChange={ e => filterActivities('location', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.locations.map(location => <option value={location._id}>{location.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>نوع الفعالية</label>
                    <select onChange={ e => filterActivities('type', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.types.map(type => <option value={type._id}>{type.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>حالة الفعالية</label>
                    <select onChange={ e => filterActivities('status', e.target.value)}>
                        <option value={''}>الكل</option>
                        <option value={'أقيمت'}>أقيمت</option>
                        <option value={'لم تقم'}>لم تقم</option>
                        <option value={'ملغاة'}>ملغاة</option>
                        <option value={'مؤجلة'}>مؤجلة</option>
                        <option value={'تم الطلب'}>تم الطلب</option>
                        <option value={'تم الحجز'}>تم الحجز</option>
                    </select>
                </div>
                <div>
                    <label>حالة الاشتراك</label>
                    <select onChange={ e => filterActivities('isShare', e.target.value)}>
                        <option value={''}>الكل</option>
                        <option value={true}>مشتركة</option>
                        <option value={false}>غير مشتركة</option>
                    </select>
                </div>
                <div>
                    <div className={Styles.reset}>
                        <label>تاريخ معين</label>
                        <svg onClick={e => {
                            dateRef.current.value = ''
                            dispatch(activitiesActions.countSearch(0))
                            dispatch(activitiesActions.get({
                                docs: [],
                                status: false
                            }))
                        }}
                             xmlns="http://www.w3.org/2000/svg"
                             width={20}
                             height={20}
                             fill="#2d5e99"
                             stroke="#2d5e99"
                             strokeWidth={0}
                             viewBox="0 0 32 32"
                        >
                            <title>{"إعادة تعيين التاريخ"}</title>
                            <path
                                stroke="none"
                                d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6 6-6-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z"
                            />
                            <path
                                stroke="none"
                                d="M0 0h32v32H0z"
                                data-name="&lt;Transparent Rectangle&gt;"
                                style={{
                                    fill: "none",
                                }}
                            />
                        </svg>
                    </div>
                    <input
                        ref={dateRef}
                        type={'date'}
                        onChange={e => {
                            filterActivities('date', e.target.value)
                        }}
                    />
                </div>
                <div>
                    <div className={Styles.reset}>
                        <label>بين تاريخين</label>
                        {
                            isDate &&
                            <svg onClick={e => {
                                startDateRef.current.value = ''
                                endDateRef.current.value = ''
                                dispatch(activitiesActions.countSearch(0))
                                dispatch(activitiesActions.get({
                                    docs: [],
                                    status: false
                                }))
                                setStartDate('')
                                setEndDate('')
                            }}
                                 xmlns="http://www.w3.org/2000/svg"
                                 width={20}
                                 height={20}
                                 fill="#2d5e99"
                                 stroke="#2d5e99"
                                 strokeWidth={0}
                                 viewBox="0 0 32 32"
                            >
                                <title>{"إعادة تعيين التاريخ"}</title>
                                <path
                                    stroke="none"
                                    d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6 6-6-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z"
                                />
                                <path
                                    stroke="none"
                                    d="M0 0h32v32H0z"
                                    data-name="&lt;Transparent Rectangle&gt;"
                                    style={{
                                        fill: "none",
                                    }}
                                />
                            </svg>
                        }
                    </div>
                    <span onClick={e => setIsDate(!isDate)}>البحث بين تاريخين</span>
                    {
                        isDate && filterDate()
                    }
                </div>
            </>
        )
    }
    function getStudentsElements(){
        return (
            <>
                <div>
                    <label>الاسم/الرقم الجامعي</label>
                    <div>
                        <input
                            placeholder={'اكتب اسم الطالب أو رقمه الجامعي'}
                            type={'text'}
                            onChange={e => {
                                setTitleSearch(e.target.value)
                                if(e.target.value.length == 0){
                                    dispatch(studentsActions.countSearch(0))
                                    dispatch(studentsActions.get({
                                        docs: [],
                                        status: false
                                    }))
                                }
                            }}
                        />
                        <span className={Styles.search} onClick={e => {
                            function isNumberCandidate(s) {
                                const str = (''+ s).trim();
                                if (str.length === 0) return false;
                                return !isNaN(+str);
                            }
                            if(isNumberCandidate(titleSearch)){
                                filterActivities('username', titleSearch)
                            }else {
                                filterActivities('name', titleSearch)
                            }
                        }}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                    </div>
                </div>
                {
                    session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                        ? <div>
                            <label>اسم النادي</label>
                            <select onChange={ e => filterActivities('clubUser', e.target.value)}>
                                <option value={''}>الكل</option>
                                {
                                    data.clubs.map(club => club.name != "---" && <option value={club._id}>{club.name}</option>)
                                }
                            </select>
                        </div>
                        : null
                }
                <div>
                    <label>الكلية</label>
                    <select onChange={ e => filterActivities('college', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.colleges.map(college => college.name != "---" && <option value={college._id}>{college.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>المستوى</label>
                    <select onChange={ e => filterActivities('level', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.levels.map(level => level.name != "---" && level.name != "التاسع" && level.name != "الثاني عشر" && level.name != "الحادي عشر" && level.name != "العاشر" && <option value={level._id}>{level.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>الدولة</label>
                    <select onChange={ e => filterActivities('country', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.countries.map(country => <option value={country._id}>{country.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>الرتبة</label>
                    <select onChange={e => filterActivities('role', e.target.value)}>
                        <option value={''}>اختر رتبة المستخدم</option>
                        <option value={'student'}>طالب</option>
                        {
                            session.user.role === 'admin'
                                ? <option value={'admin'}>مدير الموقع</option>
                                : null
                        }
                        {
                            session.user.role === 'admin'
                            || session.user.role === 'president'
                                ? <option value={'president'}>المشرف على الأندية</option>
                                : null
                        }
                        {
                            session.user.role === 'admin'
                            || session.user.role === 'coordinator'
                            || session.user.role === 'president'
                                ? <>
                                    <option value={'manager'}>مدير</option>
                                    <option value={'coordinator'}>منسق</option>
                                </>
                                : null
                        }
                        <option value={'officials'}>مسؤول</option>
                        <option value={'deputy'}>نائب</option>
                    </select>
                </div>
            </>
        )
    }
    function getAttendeesElements(){
        return (
            <>
                <div>
                    <label>الاسم</label>
                    <div>
                        <input
                            placeholder={'اكتب اسم الطالب'}
                            type={'text'}
                            onChange={e => {
                                setTitleSearch(e.target.value)
                                if(e.target.value.length == 0){
                                    dispatch(reviewsActions.countSearch(0))
                                    dispatch(reviewsActions.get({
                                        docs: [],
                                        status: false
                                    }))
                                }
                            }}
                        />
                        <span className={Styles.search} onClick={e => {
                            filterActivities('name', titleSearch)
                        }}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                    </div>
                </div>
                <div>
                    <label>العنوان</label>
                    <div>
                        <input
                            placeholder={'اكتب عنوان الفعالية'}
                            type={'text'}
                            onChange={e => {
                                setTitleSearch(e.target.value)
                                if(e.target.value.length == 0){
                                    dispatch(reviewsActions.countSearch(0))
                                    dispatch(reviewsActions.get({
                                        docs: [],
                                        status: false
                                    }))
                                }
                            }}
                        />
                        <span className={Styles.search} onClick={e => {
                            filterActivities('title', titleSearch)
                        }}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                    </div>
                </div>
                <div>
                    <label>اسم النادي</label>
                    <select onChange={ e => filterActivities('club', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.clubs.map(club => club.name != "---" && club.name != "فريق الإدارة" && <option value={club._id}>{club.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>النوع</label>
                    <select onChange={ e => filterActivities('type', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.types.map(type => <option value={type._id}>{type.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>الموقع</label>
                    <select onChange={ e => filterActivities('location', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.locations.map(location => <option value={location._id}>{location.name}</option>)
                        }
                    </select>
                </div>
            </>
        )
    }
    function getReportsElements(){
        return (
            <>
                <div>
                    <label>العنوان</label>
                    <div>
                        <input
                            placeholder={'اكتب عنوان الفعالية'}
                            type={'text'}
                            onChange={e => {
                                setTitleSearch(e.target.value)
                                if(e.target.value.length == 0){
                                    dispatch(reportsActions.countSearch(0))
                                    dispatch(reportsActions.get({
                                        docs: [],
                                        status: false
                                    }))
                                }
                            }}
                        />
                        <span className={Styles.search} onClick={e => {
                            filterActivities('title', titleSearch)
                        }}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                    </div>
                </div>
                <div>
                    <label>اسم النادي</label>
                    <select onChange={ e => filterActivities('club', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.clubs.map(club => club.name != "---" && club.name != "فريق الإدارة" && <option value={club._id}>{club.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>النوع</label>
                    <select onChange={ e => filterActivities('type', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.types.map(type => <option value={type._id}>{type.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>الموقع</label>
                    <select onChange={ e => filterActivities('location', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.locations.map(location => <option value={location._id}>{location.name}</option>)
                        }
                    </select>
                </div>
            </>
        )
    }
    function getPostsElements(){
        return (
            <>
                <div style={{
                    gridColumn: "span 3"
                }}>
                    <label>عنوان الفعالية</label>
                    <div>
                        <input
                            placeholder={'البحث باستخدام عنوان المنشور'}
                            type={'text'}
                            onChange={e => {
                                setTitleSearch(e.target.value)
                                e.target.value.length == 0 && dispatch(postsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }}
                        />
                        <span className={Styles.search} onClick={e => filterActivities('title', titleSearch)}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                    </div>
                </div>
                <div>
                    <label>اسم النادي</label>
                    <select onChange={ e => filterActivities('club', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.clubs.map(club => club.name != "---" && club.name != "فريق الإدارة" && <option value={club._id}>{club.name}</option>)
                        }
                    </select>
                </div>
            </>
        )
    }
    function getContactsElements(){
        return (
            <>
                <div>
                    <label>عنوان الطلب</label>
                    <div>
                        <input
                            placeholder={'البحث باستخدام عنوان الطلب'}
                            type={'text'}
                            onChange={e => {
                                setTitleSearch(e.target.value)
                                e.target.value.length == 0 && dispatch(contactsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }}
                        />
                        <span className={Styles.search} onClick={e => filterActivities('title', titleSearch)}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                    </div>
                </div>
                <div>
                    <label>اسم النادي</label>
                    <select onChange={ e => filterActivities('club', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.clubs.map(club => club.name != "---" && club.name != "فريق الإدارة" && <option value={club._id}>{club.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>نوع الطلب</label>
                    <select onChange={ e => filterActivities('type', e.target.value)}>
                        <option value={''}>الكل</option>
                        <option value={'الشهادات'}>الشهادات</option>
                        <option value={'الجوائز'}>الجوائز</option>
                        <option value={'شكوى'}>شكوى</option>
                        <option value={'تغيير النادي الأساسي'}>تغيير النادي الأساسي</option>
                        <option value={'غير ذلك'}>غير ذلك</option>
                    </select>
                </div>
                <div>
                    <label>حالة الطلب</label>
                    <select onChange={ e => filterActivities('status', e.target.value)}>
                        <option value={''}>الكل</option>
                        <option value={'completed'}>مكتمل</option>
                        <option value={'pending'}>تحت التنفيذ</option>
                        <option value={'canceled'}>ملغاة</option>
                    </select>
                </div>
            </>
        )
    }
    function getDesignsElements(){
        return (
            <>
                <div>
                    <label>عنوان الفعالية</label>
                    <div>
                        <input
                            placeholder={'البحث باستخدام عنوان الفعالية'}
                            type={'text'}
                            onChange={e => {
                                setTitleSearch(e.target.value)
                                e.target.value.length == 0 && dispatch(designsActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }}
                        />
                        <span className={Styles.search} onClick={e => filterActivities('title', titleSearch)}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                    </div>
                </div>
                <div>
                    <label>اسم النادي</label>
                    <select onChange={ e => filterActivities('club', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.clubs.map(club => club.name != "---" && club.name != "فريق الإدارة" && <option value={club._id}>{club.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>نوع الفعالية</label>
                    <select onChange={ e => filterActivities('type', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.types.map(type => type.name != "---" && <option value={type._id}>{type.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>حالة التصميم</label>
                    <select onChange={ e => filterActivities('status', e.target.value)}>
                        <option value={''}>الكل</option>
                        <option value={'completed'}>تم التصميم</option>
                        <option value={'pending'}>تحت التنفيذ</option>
                        <option value={'canceled'}>لم يتم التصميم</option>
                    </select>
                </div>
            </>
        )
    }
    function getDiscoursesElements(){
        return (
            <>
                <div>
                    <label>عنوان الفعالية</label>
                    <div>
                        <input
                            placeholder={'البحث باستخدام عنوان الفعالية'}
                            type={'text'}
                            onChange={e => {
                                setTitleSearch(e.target.value)
                                e.target.value.length == 0 && dispatch(discoursesActions.get({
                                    docs: [],
                                    status: false
                                }))
                            }}
                        />
                        <span className={Styles.search} onClick={e => filterActivities('title', titleSearch)}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                    </div>
                </div>
                <div>
                    <label>اسم النادي</label>
                    <select onChange={ e => filterActivities('club', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.clubs.map(club => club.name != "---" && club.name != "فريق الإدارة" && <option value={club._id}>{club.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>نوع الفعالية</label>
                    <select onChange={ e => filterActivities('type', e.target.value)}>
                        <option value={''}>الكل</option>
                        {
                            data.types.map(type => type.name != "---" && <option value={type._id}>{type.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label>حالة الخطاب</label>
                    <select onChange={ e => filterActivities('status', e.target.value)}>
                        <option value={''}>الكل</option>
                        <option value={'completed'}>تمت الموافقة</option>
                        <option value={'pending'}>تحت التنفيذ</option>
                        <option value={'canceled'}>لم تمم الموافقة</option>
                    </select>
                </div>
            </>
        )
    }
    return (
        <div className={Styles.index}>
            {
                isActivities && getActivitiesElements()
            }
            {
                isPosts && getPostsElements()
            }
            {
                isStudents && getStudentsElements()
            }
            {
                isContacts && getContactsElements()
            }
            {
                isDesigns && getDesignsElements()
            }
            {
                isDiscourses && getDiscoursesElements()
            }
            {
                isAttendees && getAttendeesElements()
            }
            {
                isReports && getReportsElements()
            }
        </div>
    )
}
