import Styles from "../styles/Table.module.css"
import StylesIndex from "../styles/Index.module.css"
import Pagination from "../components/Pagination";
import {useDispatch, useSelector} from "react-redux";
import {countriesActions} from "../redux/slices/countriesSlice";
import FormAdd from "../components/FormAdd";
import Close from "../components/Close";
import axios from "axios";
import swal from "sweetalert";
import {collegesActions} from "../redux/slices/collegesSlice";
import {awardsActions} from "../redux/slices/awardsSlice";
import {levelsActions} from "../redux/slices/levelsSlice";
import {locationsActions} from "../redux/slices/locationsSlice";
import {typesActions} from "../redux/slices/typesSlice";
import {administrativeActions} from "../redux/slices/administrativeSlice";
import {datesActions} from "../redux/slices/datesSlice";
import {timesActions} from "../redux/slices/TimesSlice";
import {studentsActions} from "../redux/slices/studentsSlice";
import FormUser from "../components/FormUser";
import {clubsActions} from "../redux/slices/clubsSlice";
import {activitiesActions} from "../redux/slices/activitiesSlice";
import {yearsActions} from "../redux/slices/yearsSlice";
import {useState} from "react";
import Image from 'next/image';
import {useSession} from "next-auth/react";
import Show from "../components/activities/Show";
import {postsActions} from "../redux/slices/postsSlice";
import {contactsActions} from "../redux/slices/contactsSlice";
import Form from "../components/attendees/Form";
import {reviewsActions} from "../redux/slices/reviewsSlice";
import {awardsAndActivitiesActions} from "../redux/slices/awardsAndActivitiesSlice";
import {useRouter} from "next/router";
import FormClub from "../components/Clubs/FormClub";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import {reportsActions} from "../redux/slices/reportsSlice";
import {designsActions} from "../redux/slices/designsSlice";
import {discoursesActions} from "../redux/slices/discoursesSlice";
import {certificatesAndActivitiesActions} from "../redux/slices/certificatesAndActivitiesSlice";
import {resultsActions} from "../redux/slices/resultsSlice";
export default (
    {
        headers,
        data,
        mutate,
        permissions,
        isStudents = false,
        isAllAwards = false,
        isPaginate = true,
        isResults = true,
        isActivity = false,
        isAll = false,
        isToDay = false,
        isContact = false,
        isCertificate = false,
        isAwardAndActivity = false,
        isPost = false,
        isReport = false,
        isDesign = false,
        isDiscourse = false,
        isComment = false,
        isShowUser= false,
        isCountry = false,
        awardClubName = '',
        isFull = false,
        isReview = false,
        isAward = false,
        isLevel = false,
        isLocations = false,
        isType = false,
        isDate = false,
        isYear = false,
        isTime = false,
        isClub = false,
        isCollege = false,
        isAdministrative = false,
        isAdministrativeClub = false
    }) => {
    const {data: session} = useSession()
    const router = useRouter()
    const [listData, setListData] = useState([])
    const [statusIsAttendTrue, setStatusIsAttendTrue] = useState('مفتوح')
    const [statusIsAttendFalse, setStatusIsAttendFalse] = useState('مغلق')
    const [listDataStudents, setListDataStudents] = useState([])

    const [ListDates, setListDates]= useState([])
    const [ListTimes, setListTimes]= useState([])

    const dispatch = useDispatch()
    const isEditCountry = useSelector(state => state.countries.isEdit)
    const isEditCollege = useSelector(state => state.colleges.isEdit)
    const isEditAward = useSelector(state => state.awards.isEdit)
    const isEditLevel = useSelector(state => state.levels.isEdit)
    const isEditType = useSelector(state => state.types.isEdit)
    const isEditLocation = useSelector(state => state.locations.isEdit)
    const isEditResult = useSelector(state => state.results.isEdit)
    const isEditDate = useSelector(state => state.dates.isEdit)
    const isEditAdministrative = useSelector(state => state.administrative.isEdit)
    const isEditTime = useSelector(state => state.times.isEdit)
    const isEditStudent = useSelector(state => state.students.isEdit)
    const isEditClub = useSelector(state => state.clubs.isEdit)
    const isEditActivity = useSelector(state => state.activities.isEdit)
    const isShowActivity = useSelector(state => state.activities.isShow)
    const isShowDiscourse = useSelector(state => state.discourses.isShow)
    const isShowStudent = useSelector(state => state.students.isShow)
    const isShowPost = useSelector(state => state.posts.isShow)
    const isEditContact = useSelector(state => state.contacts.isEdit)
    const isShowReport = useSelector(state => state.reports.isShow)
    const isShowReview = useSelector(state => state.reviews.isShow)
    const isShowContact = useSelector(state => state.contacts.isShow)
    const isShowAwardsAndActivities = useSelector(state => state.awardsAndActivities.isShow)
    const isShowCertificate = useSelector(state => state.certificatesAndActivities.isShow)
    const isEditYear = useSelector(state => state.years.isEdit)
    const isEditPost = useSelector(state => state.posts.isEdit)
    const isEditReport = useSelector(state => state.reports.isEdit)
    const isEditDesign = useSelector(state => state.designs.isEdit)
    const isEditDiscourse = useSelector(state => state.discourses.isEdit)
    const isEditReview = useSelector(state => state.reviews.isEdit)

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

    function getDate(date){
        let days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        return  days[new Date(date).getDay()]
    }

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

    function getStatusDesign(statusValue){
        switch (statusValue) {
            case "completed":
                return "تم التصميم"
                break
            case "canceled":
                return "لم يتم التصميم"
                break
            case "pending":
                return "تحت التنفيذ"
                break
        }
    }

    function getStatusDiscourse(statusValue){
        switch (statusValue) {
            case "completed":
                return "تمت الموافقة"
                break
            case "canceled":
                return "لم تتم الموافقة"
                break
            case "pending":
                return "تحت التنفيذ"
                break
        }
    }

    function getStatusDiscourse(statusValue){
        switch (statusValue) {
            case "completed":
                return "تمت الموافقة"
                break
            case "canceled":
                return "لم تتم الموافقة"
                break
            case "pending":
                return "تحت التنفيذ"
                break
        }
    }

    return (
        <div className={StylesIndex.index}>
            {
                isCountry
                    ? isEditCountry
                        ? <>
                            <Close action={countriesActions.isEdit} />
                            <FormAdd isCountry={isCountry} titleAdd={'تعديل الدولة'} isEdit={isEditCountry} />
                         </>
                        : <>
                            <div className={Styles.index}>
                                <table className={Styles.table}>
                                    <thead>
                                    <tr>
                                        {
                                            headers.map((header, key) => <th key={key}>{header}</th>)
                                        }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        data.docs.map((data, key) =>
                                            <tr key={key}>
                                                <td>{data.name}</td>
                                                <td>{data.code}</td>
                                                <td>{data.studentsCount}</td>
                                                <td>
                                                            <span onClick={() => {
                                                                dispatch(countriesActions.isEdit(true))
                                                                dispatch(countriesActions.edit({
                                                                    id: data.id,
                                                                    name: data.name,
                                                                    code: data.code,
                                                                }))
                                                            }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#fff"
                                                                            d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                            opacity={0.4}
                                                                        />
                                                                      </svg>
                                                            </span>
                                                    <span onClick={() => {
                                                        swal({
                                                            title: 'هل أنت متأكد؟',
                                                            text: `هل أنت متأكد من أنك تريد حذف الدولة [${data.name}]`,
                                                            icon: 'warning',
                                                            buttons: {
                                                                cancel: {
                                                                    text: 'إلغاء',
                                                                    value: null,
                                                                    visible: true,
                                                                    className: '',
                                                                    closeModal: true,
                                                                },
                                                                confirm: {
                                                                    text: 'موافق',
                                                                    value: true,
                                                                    visible: true,
                                                                    className: '',
                                                                    closeModal: true
                                                                },
                                                            },
                                                            dangerMode: true,
                                                        }).then((willDelete) => {
                                                            if (willDelete) {
                                                                axios.delete(`/tools/countries/delete?id=${data.id}`)
                                                                    .then( async (res) => {
                                                                        if(res.status === 201 ){
                                                                            await swal({
                                                                                title: 'تم!',
                                                                                text: res.data.mess,
                                                                                icon: "success",
                                                                                button: false,
                                                                                timer: 2000,
                                                                            });
                                                                        }else {
                                                                            await swal({
                                                                                title: 'خطأ!',
                                                                                text: res.data.mess,
                                                                                icon: "error",
                                                                                button: false,
                                                                                timer: 2000,
                                                                            });
                                                                        }
                                                                    })
                                                            }
                                                        });
                                                    }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#FD8A8A"
                                                                            fillOpacity={0.5}
                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#DC3535"
                                                                            fillOpacity={0.5}
                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                        />
                                                                      </svg>
                                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                            </div>
                            {
                                data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                            }
                        </>
                    : isCollege
                        ? isEditCollege
                            ? <>
                                <Close action={collegesActions.isEdit} />
                                <FormAdd isCollege={isCollege} titleAdd={'تعديل الكلية'} isEdit={isEditCollege} />
                            </>
                            : <>
                                <div className={Styles.index}>
                                    <table className={Styles.table}>
                                        <thead>
                                        <tr>
                                            {
                                                headers.map((header, key) => <th key={key}>{header}</th>)
                                            }
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            data.docs.map((data, key) =>
                                                <tr key={key}>
                                                    <td>{data.name}</td>
                                                    <td>{data.studentsCount}</td>
                                                    <td>
                                                            <span onClick={() => {
                                                                dispatch(collegesActions.isEdit(true))
                                                                dispatch(collegesActions.edit({
                                                                    id: data.id,
                                                                    name: data.name,
                                                                }))
                                                            }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#fff"
                                                                            d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                            opacity={0.4}
                                                                        />
                                                                      </svg>
                                                            </span>
                                                        <span onClick={() => {
                                                            swal({
                                                                title: 'هل أنت متأكد؟',
                                                                text: `هل أنت متأكد من أنك تريد حذف كلية [${data.name}]`,
                                                                icon: 'warning',
                                                                buttons: {
                                                                    cancel: {
                                                                        text: 'إلغاء',
                                                                        value: null,
                                                                        visible: true,
                                                                        className: '',
                                                                        closeModal: true,
                                                                    },
                                                                    confirm: {
                                                                        text: 'موافق',
                                                                        value: true,
                                                                        visible: true,
                                                                        className: '',
                                                                        closeModal: true
                                                                    },
                                                                },
                                                                dangerMode: true,
                                                            }).then((willDelete) => {
                                                                if (willDelete) {
                                                                    axios.delete(`/tools/colleges/delete?id=${data.id}`)
                                                                        .then( async (res) => {
                                                                            if(res.status === 201 ){
                                                                                await swal({
                                                                                    title: 'تم!',
                                                                                    text: res.data.mess,
                                                                                    icon: "success",
                                                                                    button: false,
                                                                                    timer: 2000,
                                                                                });
                                                                            }else {
                                                                                await swal({
                                                                                    title: 'خطأ!',
                                                                                    text: res.data.mess,
                                                                                    icon: "error",
                                                                                    button: false,
                                                                                    timer: 2000,
                                                                                });
                                                                            }
                                                                        })
                                                                }
                                                            });
                                                        }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#FD8A8A"
                                                                            fillOpacity={0.5}
                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#DC3535"
                                                                            fillOpacity={0.5}
                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                        />
                                                                      </svg>
                                                                    </span>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </table>
                                </div>
                                {
                                    data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                }
                            </>
                        : isAward
                            ? isEditAward
                                ? <>
                                    <Close action={awardsActions.isEdit} />
                                    <FormAdd isAward={isAward} titleAdd={'تعديل الجائزة'} isEdit={isEditAward} />
                                </>
                                : <>
                                    <div className={Styles.index}>
                                        <table className={Styles.table}>
                                            <thead>
                                            <tr>
                                                {
                                                    headers.map((header, key) => <th key={key}>{header}</th>)
                                                }
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                data.docs.map((data, key) =>
                                                    <tr key={key}>
                                                        <td>{data.name}</td>
                                                        <td>{data.studentsCount}</td>
                                                        <td>
                                                            <span onClick={() => {
                                                                dispatch(awardsActions.isEdit(true))
                                                                dispatch(awardsActions.edit({
                                                                    id: data.id,
                                                                    name: data.name,
                                                                }))
                                                            }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#fff"
                                                                            d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                            opacity={0.4}
                                                                        />
                                                                      </svg>
                                                            </span>
                                                            <span onClick={() => {
                                                                swal({
                                                                    title: 'هل أنت متأكد؟',
                                                                    text: `هل أنت متأكد من أنك تريد حذف الجائزة [${data.name}]`,
                                                                    icon: 'warning',
                                                                    buttons: {
                                                                        cancel: {
                                                                            text: 'إلغاء',
                                                                            value: null,
                                                                            visible: true,
                                                                            className: '',
                                                                            closeModal: true,
                                                                        },
                                                                        confirm: {
                                                                            text: 'موافق',
                                                                            value: true,
                                                                            visible: true,
                                                                            className: '',
                                                                            closeModal: true
                                                                        },
                                                                    },
                                                                    dangerMode: true,
                                                                }).then((willDelete) => {
                                                                    if (willDelete) {
                                                                        axios.delete(`/tools/awards/delete?id=${data.id}`)
                                                                            .then( async (res) => {
                                                                                if(res.status === 201 ){
                                                                                    await swal({
                                                                                        title: 'تم!',
                                                                                        text: res.data.mess,
                                                                                        icon: "success",
                                                                                        button: false,
                                                                                        timer: 2000,
                                                                                    });
                                                                                }else {
                                                                                    await swal({
                                                                                        title: 'خطأ!',
                                                                                        text: res.data.mess,
                                                                                        icon: "error",
                                                                                        button: false,
                                                                                        timer: 2000,
                                                                                    });
                                                                                }
                                                                            })
                                                                    }
                                                                });
                                                            }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#FD8A8A"
                                                                            fillOpacity={0.5}
                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#DC3535"
                                                                            fillOpacity={0.5}
                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                        />
                                                                      </svg>
                                                                    </span>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                    {
                                        data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                    }
                                </>
                            : isLevel
                                ? isEditLevel
                                    ? <>
                                        <Close action={levelsActions.isEdit} />
                                        <FormAdd isLevel={isLevel} titleAdd={'تعديل المستوى'} isEdit={isEditLevel} />
                                    </>
                                    : <>
                                        <div className={Styles.index}>
                                            <table className={Styles.table}>
                                                <thead>
                                                <tr>
                                                    {
                                                        headers.map((header, key) => <th key={key}>{header}</th>)
                                                    }
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    data.docs.map((data, key) =>
                                                        <tr key={key}>
                                                            <td>{data.name}</td>
                                                            <td>{data.studentsCount}</td>
                                                            <td>
                                                            <span onClick={() => {
                                                                dispatch(levelsActions.isEdit(true))
                                                                dispatch(levelsActions.edit({
                                                                    id: data.id,
                                                                    name: data.name,
                                                                }))
                                                            }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#fff"
                                                                            d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                            opacity={0.4}
                                                                        />
                                                                      </svg>
                                                            </span>
                                                                <span onClick={() => {
                                                                    swal({
                                                                        title: 'هل أنت متأكد؟',
                                                                        text: `هل أنت متأكد من أنك تريد حذف المستوى [${data.name}]`,
                                                                        icon: 'warning',
                                                                        buttons: {
                                                                            cancel: {
                                                                                text: 'إلغاء',
                                                                                value: null,
                                                                                visible: true,
                                                                                className: '',
                                                                                closeModal: true,
                                                                            },
                                                                            confirm: {
                                                                                text: 'موافق',
                                                                                value: true,
                                                                                visible: true,
                                                                                className: '',
                                                                                closeModal: true
                                                                            },
                                                                        },
                                                                        dangerMode: true,
                                                                    }).then((willDelete) => {
                                                                        if (willDelete) {
                                                                            axios.delete(`/tools/levels/delete?id=${data.id}`)
                                                                                .then( async (res) => {
                                                                                    if(res.status === 201 ){
                                                                                        await swal({
                                                                                            title: 'تم!',
                                                                                            text: res.data.mess,
                                                                                            icon: "success",
                                                                                            button: false,
                                                                                            timer: 2000,
                                                                                        });
                                                                                    }else {
                                                                                        await swal({
                                                                                            title: 'خطأ!',
                                                                                            text: res.data.mess,
                                                                                            icon: "error",
                                                                                            button: false,
                                                                                            timer: 2000,
                                                                                        });
                                                                                    }
                                                                                })
                                                                        }
                                                                    });
                                                                }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#FD8A8A"
                                                                            fillOpacity={0.5}
                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#DC3535"
                                                                            fillOpacity={0.5}
                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                        />
                                                                      </svg>
                                                                    </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                        {
                                            data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                        }
                                    </>
                                : isLocations
                                    ? isEditLocation
                                        ? <>
                                            <Close action={locationsActions.isEdit} />
                                            <FormAdd isLocation={isLocations} titleAdd={'تعديل المستوى'} isEdit={isEditLocation} />
                                        </>
                                        : <>
                                            <div className={Styles.index}>
                                                <table className={Styles.table}>
                                                    <thead>
                                                    <tr>
                                                        {
                                                            headers.map((header, key) => <th key={key}>{header}</th>)
                                                        }
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        data.docs.map((data, key) =>
                                                            <tr key={key}>
                                                                <td>{data.name}</td>
                                                                <td>{data.activitiesCount}</td>
                                                                <td>
                                                            <span onClick={() => {
                                                                dispatch(locationsActions.isEdit(true))
                                                                dispatch(locationsActions.edit({
                                                                    id: data.id,
                                                                    name: data.name,
                                                                }))
                                                            }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#fff"
                                                                            d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                            opacity={0.4}
                                                                        />
                                                                      </svg>
                                                            </span>
                                                                    <span onClick={() => {
                                                                        swal({
                                                                            title: 'هل أنت متأكد؟',
                                                                            text: `هل أنت متأكد من أنك تريد حذف الموقع [${data.name}]`,
                                                                            icon: 'warning',
                                                                            buttons: {
                                                                                cancel: {
                                                                                    text: 'إلغاء',
                                                                                    value: null,
                                                                                    visible: true,
                                                                                    className: '',
                                                                                    closeModal: true,
                                                                                },
                                                                                confirm: {
                                                                                    text: 'موافق',
                                                                                    value: true,
                                                                                    visible: true,
                                                                                    className: '',
                                                                                    closeModal: true
                                                                                },
                                                                            },
                                                                            dangerMode: true,
                                                                        }).then((willDelete) => {
                                                                            if (willDelete) {
                                                                                axios.delete(`/tools/locations/delete?id=${data.id}`)
                                                                                    .then( async (res) => {
                                                                                        if(res.status === 201 ){
                                                                                            await swal({
                                                                                                title: 'تم!',
                                                                                                text: res.data.mess,
                                                                                                icon: "success",
                                                                                                button: false,
                                                                                                timer: 2000,
                                                                                            });
                                                                                        }else {
                                                                                            await swal({
                                                                                                title: 'خطأ!',
                                                                                                text: res.data.mess,
                                                                                                icon: "error",
                                                                                                button: false,
                                                                                                timer: 2000,
                                                                                            });
                                                                                        }
                                                                                    })
                                                                            }
                                                                        });
                                                                    }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#FD8A8A"
                                                                            fillOpacity={0.5}
                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#DC3535"
                                                                            fillOpacity={0.5}
                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                        />
                                                                      </svg>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                            {
                                                data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                            }
                                        </>
                                    : isType
                                        ? isEditType
                                            ? <>
                                                <Close action={typesActions.isEdit} />
                                                <FormAdd isType={isType} titleAdd={'تعديل النوع'} isEdit={isEditType} />
                                            </>
                                            : <>
                                                <div className={Styles.index}>
                                                    <table className={Styles.table}>
                                                        <thead>
                                                        <tr>
                                                            {
                                                                headers.map((header, key) => <th key={key}>{header}</th>)
                                                            }
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            data.docs.map((data, key) =>
                                                                    <tr key={key}>
                                                                        <td>{data.name}</td>
                                                                        <td>{data.activitiesCount}</td>
                                                                        <td>
                                                            <span onClick={() => {
                                                                dispatch(typesActions.isEdit(true))
                                                                dispatch(typesActions.edit({
                                                                    id: data.id,
                                                                    name: data.name,
                                                                }))
                                                            }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#fff"
                                                                            d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                            opacity={0.4}
                                                                        />
                                                                      </svg>
                                                            </span>
                                                                            <span onClick={() => {
                                                                                swal({
                                                                                    title: 'هل أنت متأكد؟',
                                                                                    text: `هل أنت متأكد من أنك تريد حذف النوع [${data.name}]`,
                                                                                    icon: 'warning',
                                                                                    buttons: {
                                                                                        cancel: {
                                                                                            text: 'إلغاء',
                                                                                            value: null,
                                                                                            visible: true,
                                                                                            className: '',
                                                                                            closeModal: true,
                                                                                        },
                                                                                        confirm: {
                                                                                            text: 'موافق',
                                                                                            value: true,
                                                                                            visible: true,
                                                                                            className: '',
                                                                                            closeModal: true
                                                                                        },
                                                                                    },
                                                                                    dangerMode: true,
                                                                                }).then((willDelete) => {
                                                                                    if (willDelete) {
                                                                                        axios.delete(`/tools/types/delete?id=${data.id}`)
                                                                                            .then( async (res) => {
                                                                                                if(res.status === 201 ){
                                                                                                    await swal({
                                                                                                        title: 'تم!',
                                                                                                        text: res.data.mess,
                                                                                                        icon: "success",
                                                                                                        button: false,
                                                                                                        timer: 2000,
                                                                                                    });
                                                                                                }else {
                                                                                                    await swal({
                                                                                                        title: 'خطأ!',
                                                                                                        text: res.data.mess,
                                                                                                        icon: "error",
                                                                                                        button: false,
                                                                                                        timer: 2000,
                                                                                                    });
                                                                                                }
                                                                                            })
                                                                                    }
                                                                                });
                                                                            }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#FD8A8A"
                                                                            fillOpacity={0.5}
                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#DC3535"
                                                                            fillOpacity={0.5}
                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                        />
                                                                      </svg>
                                                                    </span>
                                                                        </td>
                                                                    </tr>
                                                            )
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {
                                                    data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                }
                                            </>
                                        : isAdministrative
                                            ? isEditAdministrative
                                                ? <>
                                                    <Close action={administrativeActions.isEdit} />
                                                    <FormAdd isAdministrative={isAdministrative} titleAdd={'تعديل النوع'} isEdit={isEditAdministrative} />
                                                </>
                                                : <>
                                                    <div className={Styles.index}>
                                                        <table className={Styles.table}>
                                                            <thead>
                                                            <tr>
                                                                {
                                                                    headers.map((header, key) => <th key={key}>{header}</th>)
                                                                }
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                data.docs.map((data, key) =>
                                                                        <tr key={key}>
                                                                            <td>{data.name}</td>
                                                                            <td>{data.studentsCount}</td>
                                                                            <td>
                                                            <span onClick={() => {
                                                                dispatch(administrativeActions.isEdit(true))
                                                                dispatch(administrativeActions.edit({
                                                                    id: data.id,
                                                                    name: data.name,
                                                                }))
                                                            }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#fff"
                                                                            d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                            opacity={0.4}
                                                                        />
                                                                      </svg>
                                                            </span>
                                                                                <span onClick={() => {
                                                                                    swal({
                                                                                        title: 'هل أنت متأكد؟',
                                                                                        text: `هل أنت متأكد من أنك تريد حذف الوظيفة [${data.name}]`,
                                                                                        icon: 'warning',
                                                                                        buttons: {
                                                                                            cancel: {
                                                                                                text: 'إلغاء',
                                                                                                value: null,
                                                                                                visible: true,
                                                                                                className: '',
                                                                                                closeModal: true,
                                                                                            },
                                                                                            confirm: {
                                                                                                text: 'موافق',
                                                                                                value: true,
                                                                                                visible: true,
                                                                                                className: '',
                                                                                                closeModal: true
                                                                                            },
                                                                                        },
                                                                                        dangerMode: true,
                                                                                    }).then((willDelete) => {
                                                                                        if (willDelete) {
                                                                                            axios.delete(`/tools/administrative/delete?id=${data.id}`)
                                                                                                .then( async (res) => {
                                                                                                    if(res.status === 201 ){
                                                                                                        await swal({
                                                                                                            title: 'تم!',
                                                                                                            text: res.data.mess,
                                                                                                            icon: "success",
                                                                                                            button: false,
                                                                                                            timer: 2000,
                                                                                                        });
                                                                                                    }else {
                                                                                                        await swal({
                                                                                                            title: 'خطأ!',
                                                                                                            text: res.data.mess,
                                                                                                            icon: "error",
                                                                                                            button: false,
                                                                                                            timer: 2000,
                                                                                                        });
                                                                                                    }
                                                                                                })
                                                                                        }
                                                                                    });
                                                                                }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#FD8A8A"
                                                                            fillOpacity={0.5}
                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#DC3535"
                                                                            fillOpacity={0.5}
                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                        />
                                                                      </svg>
                                                                    </span>
                                                                            </td>
                                                                        </tr>
                                                                )
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {
                                                        data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                    }
                                                </>
                                            : isDate
                                                ? isEditDate
                                                    ? <>
                                                        <Close action={datesActions.isEdit} />
                                                        <FormAdd isDate={isDate} titleAdd={'تعديل التاريخ'} isEdit={isEditDate} />
                                                    </>
                                                    : <>
                                                        <div className={Styles.index}>
                                                            <table className={Styles.table}>
                                                                <thead>
                                                                <tr>
                                                                    {
                                                                        headers.map((header, key) => <th key={key}>{header}</th>)
                                                                    }
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {
                                                                    data.docs.map((data, key) =>
                                                                            <tr key={key}>
                                                                                <td>{data.start}</td>
                                                                                <td>{data.end}</td>
                                                                                <td>
                                                            <span onClick={() => {
                                                                dispatch(datesActions.isEdit(true))
                                                                dispatch(datesActions.edit({
                                                                    id: data.id,
                                                                    start: data.start,
                                                                    end: data.end,
                                                                }))
                                                            }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#fff"
                                                                            d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                            opacity={0.4}
                                                                        />
                                                                      </svg>
                                                            </span>
                                                                                    <span onClick={() => {
                                                                                        swal({
                                                                                            title: 'هل أنت متأكد؟',
                                                                                            text: `هل أنت متأكد من أنك تريد حذف التاريخ [${data.start} - ${data.end}]`,
                                                                                            icon: 'warning',
                                                                                            buttons: {
                                                                                                cancel: {
                                                                                                    text: 'إلغاء',
                                                                                                    value: null,
                                                                                                    visible: true,
                                                                                                    className: '',
                                                                                                    closeModal: true,
                                                                                                },
                                                                                                confirm: {
                                                                                                    text: 'موافق',
                                                                                                    value: true,
                                                                                                    visible: true,
                                                                                                    className: '',
                                                                                                    closeModal: true
                                                                                                },
                                                                                            },
                                                                                            dangerMode: true,
                                                                                        }).then((willDelete) => {
                                                                                            if (willDelete) {
                                                                                                axios.delete(`/tools/dates/delete?id=${data.id}`)
                                                                                                    .then( async (res) => {
                                                                                                        if(res.status === 201 ){
                                                                                                            await swal({
                                                                                                                title: 'تم!',
                                                                                                                text: res.data.mess,
                                                                                                                icon: "success",
                                                                                                                button: false,
                                                                                                                timer: 2000,
                                                                                                            });
                                                                                                        }else {
                                                                                                            await swal({
                                                                                                                title: 'خطأ!',
                                                                                                                text: res.data.mess,
                                                                                                                icon: "error",
                                                                                                                button: false,
                                                                                                                timer: 2000,
                                                                                                            });
                                                                                                        }
                                                                                                    })
                                                                                            }
                                                                                        });
                                                                                    }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#FD8A8A"
                                                                            fillOpacity={0.5}
                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#DC3535"
                                                                            fillOpacity={0.5}
                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                        />
                                                                      </svg>
                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                    )
                                                                }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        {
                                                            data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                        }
                                                    </>
                                                : isTime
                                                    ? isEditTime
                                                        ? <>
                                                            <Close action={timesActions.isEdit} />
                                                            <FormAdd isTime={isTime} titleAdd={'تعديل الوقت'} isEdit={isEditTime} />
                                                        </>
                                                        : <>
                                                            <div className={Styles.index}>
                                                                <table className={Styles.table}>
                                                                    <thead>
                                                                    <tr>
                                                                        {
                                                                            headers.map((header, key) => <th key={key}>{header}</th>)
                                                                        }
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {
                                                                        data.docs.map((data, key) =>
                                                                                <tr key={key}>
                                                                                    <td>{data.start}</td>
                                                                                    <td>{data.end}</td>
                                                                                    <td>
                                                            <span onClick={() => {
                                                                dispatch(timesActions.isEdit(true))
                                                                dispatch(timesActions.edit({
                                                                    id: data.id,
                                                                    start: data.start,
                                                                    end: data.end,
                                                                }))
                                                            }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#fff"
                                                                            d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                        />
                                                                        <path
                                                                            fill="#000"
                                                                            d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                            opacity={0.4}
                                                                        />
                                                                      </svg>
                                                            </span>
                                                                                        <span onClick={() => {
                                                                                            swal({
                                                                                                title: 'هل أنت متأكد؟',
                                                                                                text: `هل أنت متأكد من أنك تريد حذف الوقت [${data.start} - ${data.end}]`,
                                                                                                icon: 'warning',
                                                                                                buttons: {
                                                                                                    cancel: {
                                                                                                        text: 'إلغاء',
                                                                                                        value: null,
                                                                                                        visible: true,
                                                                                                        className: '',
                                                                                                        closeModal: true,
                                                                                                    },
                                                                                                    confirm: {
                                                                                                        text: 'موافق',
                                                                                                        value: true,
                                                                                                        visible: true,
                                                                                                        className: '',
                                                                                                        closeModal: true
                                                                                                    },
                                                                                                },
                                                                                                dangerMode: true,
                                                                                            }).then((willDelete) => {
                                                                                                if (willDelete) {
                                                                                                    axios.delete(`/tools/times/delete?id=${data.id}`)
                                                                                                        .then( async (res) => {
                                                                                                            if(res.status === 201 ){
                                                                                                                await swal({
                                                                                                                    title: 'تم!',
                                                                                                                    text: res.data.mess,
                                                                                                                    icon: "success",
                                                                                                                    button: false,
                                                                                                                    timer: 2000,
                                                                                                                });
                                                                                                            }else {
                                                                                                                await swal({
                                                                                                                    title: 'خطأ!',
                                                                                                                    text: res.data.mess,
                                                                                                                    icon: "error",
                                                                                                                    button: false,
                                                                                                                    timer: 2000,
                                                                                                                });
                                                                                                            }
                                                                                                        })
                                                                                                }
                                                                                            });
                                                                                        }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#FD8A8A"
                                                                            fillOpacity={0.5}
                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#DC3535"
                                                                            fillOpacity={0.5}
                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                        />
                                                                      </svg>
                                                                    </span>
                                                                                    </td>
                                                                                </tr>
                                                                        )
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            {
                                                                data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                            }
                                                        </>
                                                    : isStudents
                                                        ? isEditStudent
                                                            ? <>
                                                                <Close action={studentsActions.isEdit} />
                                                                <FormUser repeat={3} session={session} isAddUser={true} levels={listDataStudents.levels} colleges={listDataStudents.colleges} countries={listDataStudents.countries} clubs={listDataStudents.clubs} isEdit={true} />
                                                            </>
                                                            : isShowStudent
                                                                ? <>
                                                                    <Close isShow={true} action={studentsActions.isShow} />
                                                                    <Show isStudent={true} permissionsList={listData}/>
                                                                </>
                                                                : <>
                                                                    <div className={Styles.index}>
                                                                        <table className={Styles.table}>
                                                                            <thead>
                                                                            <tr>
                                                                                {
                                                                                    headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                }
                                                                            </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                            {
                                                                                data.docs.map((data, key) =>
                                                                                    session.user.role === 'admin'
                                                                                        ? <tr key={key}>
                                                                                            <td>{data.name}</td>
                                                                                            <td>{data.username}</td>
                                                                                            <td>{data.whatsapp}</td>
                                                                                            <td>{data.club.name}</td>
                                                                                            <td>{getType(data.role)}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    permissions.editStudent.status &&
                                                                                                    <span onClick={() => {

                                                                                                        axios.get('/students/get').then(res => {
                                                                                                            setListDataStudents(res.data)
                                                                                                        });
                                                                                                        dispatch(studentsActions.isEdit(true))
                                                                                                        dispatch(studentsActions.edit({
                                                                                                            id: data._id,
                                                                                                            name: data.name,
                                                                                                            password: data.password,
                                                                                                            username: data.username,
                                                                                                            type: data.type,
                                                                                                            role: data.role,
                                                                                                            idNumber: data.idNumber,
                                                                                                            whatsapp: data.whatsapp,
                                                                                                            email: data.email,
                                                                                                            club: data.club._id,
                                                                                                            level: data.level._id,
                                                                                                            college: data.college._id,
                                                                                                            country: data.country._id,
                                                                                                        }))
                                                                                                    }}>
                                                                                                              <svg
                                                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                                                  width={24}
                                                                                                                  height={24}
                                                                                                                  fill="none"
                                                                                                              >
                                                                                                                <path
                                                                                                                    fill="#fff"
                                                                                                                    d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                                    opacity={0.4}
                                                                                                                />
                                                                                                                <path
                                                                                                                    fill="#000"
                                                                                                                    d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                                />
                                                                                                                <path
                                                                                                                    fill="#000"
                                                                                                                    d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                                    opacity={0.4}
                                                                                                                />
                                                                                                              </svg>
                                                                                                    </span>
                                                                                                }
                                                                                                {
                                                                                                    permissions.showStudent.status &&
                                                                                                    <span onClick={event => {
                                                                                                        setListData(data.permissions)
                                                                                                        dispatch(studentsActions.isShow(true))
                                                                                                        dispatch(studentsActions.show({
                                                                                                            id: data._id,
                                                                                                            name: data.name,
                                                                                                            avatar: data.avatar,
                                                                                                            username: data.username,
                                                                                                            type: data.type,
                                                                                                            role: data.role,
                                                                                                            idNumber: data.idNumber,
                                                                                                            whatsapp: data.whatsapp,
                                                                                                            email: data.email,
                                                                                                            club: data.club.name,
                                                                                                            level: data.level.name,
                                                                                                            college: data.college.name,
                                                                                                            country: data.country.name,
                                                                                                        }))
                                                                                                    }}>
                                                                                                    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" fill-rule="evenodd" clip-rule="evenodd" d="M17.737 6.046c1.707 1.318 3.16 3.249 4.205 5.663a.729.729 0 010 .572C19.854 17.111 16.137 20 12 20h-.01c-4.127 0-7.844-2.89-9.931-7.719a.728.728 0 010-.572C4.146 6.88 7.863 4 11.99 4H12c2.068 0 4.03.718 5.737 2.046zM8.097 12c0 2.133 1.747 3.87 3.903 3.87 2.146 0 3.893-1.737 3.893-3.87A3.888 3.888 0 0012 8.121c-2.156 0-3.902 1.736-3.902 3.879z" fill="#000" fill-opacity=".5"/><path d="M14.43 11.997a2.428 2.428 0 01-2.428 2.414c-1.347 0-2.44-1.086-2.44-2.414 0-.165.02-.32.05-.474h.048a1.997 1.997 0 002-1.921c.107-.019.225-.03.342-.03a2.43 2.43 0 012.429 2.425z" fill="#000" fill-opacity=".5"/></svg>
                                                                                                </span>
                                                                                                }
                                                                                                {
                                                                                                    permissions.deleteStudent.status &&
                                                                                                    <span onClick={() => {
                                                                                                        swal({
                                                                                                            title: 'هل أنت متأكد؟',
                                                                                                            text: `هل أنت متأكد من أنك تريد حذف الطالب [${data.name}]`,
                                                                                                            icon: 'warning',
                                                                                                            buttons: {
                                                                                                                cancel: {
                                                                                                                    text: 'إلغاء',
                                                                                                                    value: null,
                                                                                                                    visible: true,
                                                                                                                    className: '',
                                                                                                                    closeModal: true,
                                                                                                                },
                                                                                                                confirm: {
                                                                                                                    text: 'موافق',
                                                                                                                    value: true,
                                                                                                                    visible: true,
                                                                                                                    className: '',
                                                                                                                    closeModal: true
                                                                                                                },
                                                                                                            },
                                                                                                            dangerMode: true,
                                                                                                        }).then((willDelete) => {
                                                                                                            if (willDelete) {
                                                                                                                axios.delete(`/students/delete?id=${data._id}`)
                                                                                                                    .then( async (res) => {
                                                                                                                        if(res.status === 201 ){
                                                                                                                            await swal({
                                                                                                                                title: 'تم!',
                                                                                                                                text: res.data.mess,
                                                                                                                                icon: "success",
                                                                                                                                button: false,
                                                                                                                                timer: 2000,
                                                                                                                            });
                                                                                                                        }else {
                                                                                                                            await swal({
                                                                                                                                title: 'خطأ!',
                                                                                                                                text: res.data.mess,
                                                                                                                                icon: "error",
                                                                                                                                button: false,
                                                                                                                                timer: 2000,
                                                                                                                            });
                                                                                                                        }
                                                                                                                    })
                                                                                                            }
                                                                                                        });
                                                                                                    }}>
                                                                                                      <svg
                                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                                          width={24}
                                                                                                          height={24}
                                                                                                          fill="none"
                                                                                                      >
                                                                                                        <path
                                                                                                            fill="#FD8A8A"
                                                                                                            fillOpacity={0.5}
                                                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                            opacity={0.4}
                                                                                                        />
                                                                                                        <path
                                                                                                            fill="#DC3535"
                                                                                                            fillOpacity={0.5}
                                                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                        />
                                                                                                      </svg>
                                                                                                    </span>
                                                                                                }
                                                                                            </td>
                                                                                        </tr>
                                                                                        : data.username !== 412043463 && <tr key={key}>
                                                                                            <td>{data.name}</td>
                                                                                            <td>{data.username}</td>
                                                                                            <td>{data.whatsapp}</td>
                                                                                            <td>{data.club.name}</td>
                                                                                            <td>{getType(data.role)}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    permissions.editStudent.status &&
                                                                                                    <span onClick={() => {

                                                                                                        axios.get('/students/get').then(res => {
                                                                                                            setListDataStudents(res.data)
                                                                                                        });
                                                                                                        dispatch(studentsActions.isEdit(true))
                                                                                                        dispatch(studentsActions.edit({
                                                                                                            id: data._id,
                                                                                                            name: data.name,
                                                                                                            password: data.password,
                                                                                                            username: data.username,
                                                                                                            type: data.type,
                                                                                                            role: data.role,
                                                                                                            idNumber: data.idNumber,
                                                                                                            whatsapp: data.whatsapp,
                                                                                                            email: data.email,
                                                                                                            club: data.club._id,
                                                                                                            level: data.level._id,
                                                                                                            college: data.college._id,
                                                                                                            country: data.country._id,
                                                                                                        }))
                                                                                                    }}>
                                                                                                              <svg
                                                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                                                  width={24}
                                                                                                                  height={24}
                                                                                                                  fill="none"
                                                                                                              >
                                                                                                                <path
                                                                                                                    fill="#fff"
                                                                                                                    d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                                    opacity={0.4}
                                                                                                                />
                                                                                                                <path
                                                                                                                    fill="#000"
                                                                                                                    d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                                />
                                                                                                                <path
                                                                                                                    fill="#000"
                                                                                                                    d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                                    opacity={0.4}
                                                                                                                />
                                                                                                              </svg>
                                                                                                    </span>
                                                                                                }
                                                                                                {
                                                                                                    permissions.showStudent.status &&
                                                                                                    <span onClick={event => {
                                                                                                        setListData(data.permissions)
                                                                                                        dispatch(studentsActions.isShow(true))
                                                                                                        dispatch(studentsActions.show({
                                                                                                            id: data._id,
                                                                                                            name: data.name,
                                                                                                            avatar: data.avatar,
                                                                                                            username: data.username,
                                                                                                            type: data.type,
                                                                                                            role: data.role,
                                                                                                            idNumber: data.idNumber,
                                                                                                            whatsapp: data.whatsapp,
                                                                                                            email: data.email,
                                                                                                            club: data.club.name,
                                                                                                            level: data.level.name,
                                                                                                            college: data.college.name,
                                                                                                            country: data.country.name,
                                                                                                        }))
                                                                                                    }}>
                                                                                                    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" fill-rule="evenodd" clip-rule="evenodd" d="M17.737 6.046c1.707 1.318 3.16 3.249 4.205 5.663a.729.729 0 010 .572C19.854 17.111 16.137 20 12 20h-.01c-4.127 0-7.844-2.89-9.931-7.719a.728.728 0 010-.572C4.146 6.88 7.863 4 11.99 4H12c2.068 0 4.03.718 5.737 2.046zM8.097 12c0 2.133 1.747 3.87 3.903 3.87 2.146 0 3.893-1.737 3.893-3.87A3.888 3.888 0 0012 8.121c-2.156 0-3.902 1.736-3.902 3.879z" fill="#000" fill-opacity=".5"/><path d="M14.43 11.997a2.428 2.428 0 01-2.428 2.414c-1.347 0-2.44-1.086-2.44-2.414 0-.165.02-.32.05-.474h.048a1.997 1.997 0 002-1.921c.107-.019.225-.03.342-.03a2.43 2.43 0 012.429 2.425z" fill="#000" fill-opacity=".5"/></svg>
                                                                                                </span>
                                                                                                }
                                                                                                {
                                                                                                    permissions.deleteStudent.status &&
                                                                                                    <span onClick={() => {
                                                                                                        swal({
                                                                                                            title: 'هل أنت متأكد؟',
                                                                                                            text: `هل أنت متأكد من أنك تريد حذف الطالب [${data.name}]`,
                                                                                                            icon: 'warning',
                                                                                                            buttons: {
                                                                                                                cancel: {
                                                                                                                    text: 'إلغاء',
                                                                                                                    value: null,
                                                                                                                    visible: true,
                                                                                                                    className: '',
                                                                                                                    closeModal: true,
                                                                                                                },
                                                                                                                confirm: {
                                                                                                                    text: 'موافق',
                                                                                                                    value: true,
                                                                                                                    visible: true,
                                                                                                                    className: '',
                                                                                                                    closeModal: true
                                                                                                                },
                                                                                                            },
                                                                                                            dangerMode: true,
                                                                                                        }).then((willDelete) => {
                                                                                                            if (willDelete) {
                                                                                                                axios.delete(`/students/delete?id=${data._id}`)
                                                                                                                    .then( async (res) => {
                                                                                                                        if(res.status === 201 ){
                                                                                                                            await swal({
                                                                                                                                title: 'تم!',
                                                                                                                                text: res.data.mess,
                                                                                                                                icon: "success",
                                                                                                                                button: false,
                                                                                                                                timer: 2000,
                                                                                                                            });
                                                                                                                        }else {
                                                                                                                            await swal({
                                                                                                                                title: 'خطأ!',
                                                                                                                                text: res.data.mess,
                                                                                                                                icon: "error",
                                                                                                                                button: false,
                                                                                                                                timer: 2000,
                                                                                                                            });
                                                                                                                        }
                                                                                                                    })
                                                                                                            }
                                                                                                        });
                                                                                                    }}>
                                                                                                      <svg
                                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                                          width={24}
                                                                                                          height={24}
                                                                                                          fill="none"
                                                                                                      >
                                                                                                        <path
                                                                                                            fill="#FD8A8A"
                                                                                                            fillOpacity={0.5}
                                                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                            opacity={0.4}
                                                                                                        />
                                                                                                        <path
                                                                                                            fill="#DC3535"
                                                                                                            fillOpacity={0.5}
                                                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                        />
                                                                                                      </svg>
                                                                                                    </span>
                                                                                                }
                                                                                            </td>
                                                                                        </tr>
                                                                                )
                                                                            }
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    {
                                                                        data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                    }
                                                                </>
                                                        : isClub
                                                            ? isEditClub
                                                                ? <>
                                                                    <Close action={clubsActions.isEdit} />
                                                                    <FormClub session={session} isEdit={true} managers={listData}/>
                                                                </>
                                                                : <>
                                                                    <div className={Styles.index}>
                                                                        <table className={Styles.table}>
                                                                            <thead>
                                                                            <tr>
                                                                                {
                                                                                    headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                }
                                                                            </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                            {
                                                                                data.docs.map((data, key) =>
                                                                                        <tr key={key}>
                                                                                            <td>{data.name}</td>
                                                                                            <td>
                                                                                                <Image src={`/uploads/files/${data.avatar}`} width={100} height={100}/>
                                                                                            </td>
                                                                                            <td>{data.manager != null ? data.manager.name : '---'}</td>
                                                                                            <td>{data.administrativeCount}</td>
                                                                                            <td>{data.activitiesCount}</td>
                                                                                            <td>{data.studentsCount}</td>
                                                                                            <td>{data.postsCount}</td>
                                                                                            <td>
                                                                                                <span onClick={() => {router.push(`/clubs/management/administrative?clubId=${data._id}`)}}>
                                                                                                    <svg fill="#7c99ac" width="24px" height="24px"
                                                                                                         viewBox="-128 -128 896.00 896.00" xmlns="http://www.w3.org/2000/svg"
                                                                                                         stroke="#7c99ac"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect
                                                                                                        x="-128" y="-128" width="896.00" height="896.00" rx="448" fill="#f1f6f5"
                                                                                                        strokeWidth="0"></rect></g><g id="SVGRepo_tracerCarrier"
                                                                                                                                      stroke-linecap="round"
                                                                                                                                      stroke-linejoin="round"></g><g
                                                                                                        id="SVGRepo_iconCarrier"><path
                                                                                                        d="M610.5 341.3c2.6-14.1 2.6-28.5 0-42.6l25.8-14.9c3-1.7 4.3-5.2 3.3-8.5-6.7-21.6-18.2-41.2-33.2-57.4-2.3-2.5-6-3.1-9-1.4l-25.8 14.9c-10.9-9.3-23.4-16.5-36.9-21.3v-29.8c0-3.4-2.4-6.4-5.7-7.1-22.3-5-45-4.8-66.2 0-3.3.7-5.7 3.7-5.7 7.1v29.8c-13.5 4.8-26 12-36.9 21.3l-25.8-14.9c-2.9-1.7-6.7-1.1-9 1.4-15 16.2-26.5 35.8-33.2 57.4-1 3.3.4 6.8 3.3 8.5l25.8 14.9c-2.6 14.1-2.6 28.5 0 42.6l-25.8 14.9c-3 1.7-4.3 5.2-3.3 8.5 6.7 21.6 18.2 41.1 33.2 57.4 2.3 2.5 6 3.1 9 1.4l25.8-14.9c10.9 9.3 23.4 16.5 36.9 21.3v29.8c0 3.4 2.4 6.4 5.7 7.1 22.3 5 45 4.8 66.2 0 3.3-.7 5.7-3.7 5.7-7.1v-29.8c13.5-4.8 26-12 36.9-21.3l25.8 14.9c2.9 1.7 6.7 1.1 9-1.4 15-16.2 26.5-35.8 33.2-57.4 1-3.3-.4-6.8-3.3-8.5l-25.8-14.9zM496 368.5c-26.8 0-48.5-21.8-48.5-48.5s21.8-48.5 48.5-48.5 48.5 21.8 48.5 48.5-21.7 48.5-48.5 48.5zM96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm224 32c1.9 0 3.7-.5 5.6-.6 8.3-21.7 20.5-42.1 36.3-59.2 7.4-8 17.9-12.6 28.9-12.6 6.9 0 13.7 1.8 19.6 5.3l7.9 4.6c.8-.5 1.6-.9 2.4-1.4 7-14.6 11.2-30.8 11.2-48 0-61.9-50.1-112-112-112S208 82.1 208 144c0 61.9 50.1 112 112 112zm105.2 194.5c-2.3-1.2-4.6-2.6-6.8-3.9-8.2 4.8-15.3 9.8-27.5 9.8-10.9 0-21.4-4.6-28.9-12.6-18.3-19.8-32.3-43.9-40.2-69.6-10.7-34.5 24.9-49.7 25.8-50.3-.1-2.6-.1-5.2 0-7.8l-7.9-4.6c-3.8-2.2-7-5-9.8-8.1-3.3.2-6.5.6-9.8.6-24.6 0-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h255.4c-3.7-6-6.2-12.8-6.2-20.3v-9.2zM173.1 274.6C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></g></svg>
                                                                                                </span>
                                                                                                <span onClick={() => {router.push(`/clubs/${data.name.split(' ').join('-')}`)}}>
                                                                                                    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" fill-rule="evenodd" clip-rule="evenodd" d="M17.737 6.046c1.707 1.318 3.16 3.249 4.205 5.663a.729.729 0 010 .572C19.854 17.111 16.137 20 12 20h-.01c-4.127 0-7.844-2.89-9.931-7.719a.728.728 0 010-.572C4.146 6.88 7.863 4 11.99 4H12c2.068 0 4.03.718 5.737 2.046zM8.097 12c0 2.133 1.747 3.87 3.903 3.87 2.146 0 3.893-1.737 3.893-3.87A3.888 3.888 0 0012 8.121c-2.156 0-3.902 1.736-3.902 3.879z" fill="#000" fill-opacity=".5"/><path d="M14.43 11.997a2.428 2.428 0 01-2.428 2.414c-1.347 0-2.44-1.086-2.44-2.414 0-.165.02-.32.05-.474h.048a1.997 1.997 0 002-1.921c.107-.019.225-.03.342-.03a2.43 2.43 0 012.429 2.425z" fill="#000" fill-opacity=".5"/></svg>
                                                                                                </span>
                                                                                                {
                                                                                                    permissions.editClub.status &&
                                                                                                    <span onClick={() => {
                                                                                                        dispatch(clubsActions.isEdit(true))
                                                                                                        axios.get('/clubs/management/manager').then(res => {
                                                                                                            setListData(res.data.students)
                                                                                                        })
                                                                                                        dispatch(clubsActions.edit({
                                                                                                            id: data.id,
                                                                                                            name: data.name,
                                                                                                            avatar: data.avatar,
                                                                                                            cover: data.cover,
                                                                                                            description: data.description,
                                                                                                            goals: data.goals,
                                                                                                            values: data.values,
                                                                                                            vision: data.vision,
                                                                                                            message: data.message,
                                                                                                            whatsapp: data.whatsapp,
                                                                                                            telegram: data.telegram,
                                                                                                            manager: data.manager != null ? data.manager._id : null,
                                                                                                        }))
                                                                                                    }}>
                                                                                                          <svg
                                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                                              width={24}
                                                                                                              height={24}
                                                                                                              fill="none"
                                                                                                          >
                                                                                                            <path
                                                                                                                fill="#fff"
                                                                                                                d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                                opacity={0.4}
                                                                                                            />
                                                                                                            <path
                                                                                                                fill="#000"
                                                                                                                d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                            />
                                                                                                            <path
                                                                                                                fill="#000"
                                                                                                                d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                                opacity={0.4}
                                                                                                            />
                                                                                                          </svg>
                                                                                                </span>
                                                                                                }
                                                                                                {
                                                                                                    permissions.deleteClub.status &&
                                                                                                    <span onClick={() => {
                                                                                                        swal({
                                                                                                            title: 'هل أنت متأكد؟',
                                                                                                            text: `هل أنت متأكد من أنك تريد حذف النادي [${data.name}]`,
                                                                                                            icon: 'warning',
                                                                                                            buttons: {
                                                                                                                cancel: {
                                                                                                                    text: 'إلغاء',
                                                                                                                    value: null,
                                                                                                                    visible: true,
                                                                                                                    className: '',
                                                                                                                    closeModal: true,
                                                                                                                },
                                                                                                                confirm: {
                                                                                                                    text: 'موافق',
                                                                                                                    value: true,
                                                                                                                    visible: true,
                                                                                                                    className: '',
                                                                                                                    closeModal: true
                                                                                                                },
                                                                                                            },
                                                                                                            dangerMode: true,
                                                                                                        }).then((willDelete) => {
                                                                                                            if (willDelete) {
                                                                                                                axios.delete(`/clubs/management/delete?id=${data.id}`)
                                                                                                                    .then( async (res) => {
                                                                                                                        if(res.status === 201 ){
                                                                                                                            await swal({
                                                                                                                                title: 'تم!',
                                                                                                                                text: res.data.mess,
                                                                                                                                icon: "success",
                                                                                                                                button: false,
                                                                                                                                timer: 2000,
                                                                                                                            });
                                                                                                                        }else {
                                                                                                                            await swal({
                                                                                                                                title: 'خطأ!',
                                                                                                                                text: res.data.mess,
                                                                                                                                icon: "error",
                                                                                                                                button: false,
                                                                                                                                timer: 2000,
                                                                                                                            });
                                                                                                                        }
                                                                                                                    })
                                                                                                            }
                                                                                                        });
                                                                                                    }}>
                                                                                                      <svg
                                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                                          width={24}
                                                                                                          height={24}
                                                                                                          fill="none"
                                                                                                      >
                                                                                                        <path
                                                                                                            fill="#FD8A8A"
                                                                                                            fillOpacity={0.5}
                                                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                            opacity={0.4}
                                                                                                        />
                                                                                                        <path
                                                                                                            fill="#DC3535"
                                                                                                            fillOpacity={0.5}
                                                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                        />
                                                                                                      </svg>
                                                                                                    </span>
                                                                                                }
                                                                                            </td>
                                                                                        </tr>
                                                                                )
                                                                            }
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    {
                                                                        data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                    }
                                                                </>
                                                            : isActivity
                                                                ? isEditActivity
                                                                    ? <>
                                                                        <Close action={activitiesActions.isEdit} />
                                                                        <FormUser times={ListTimes} dates={ListDates} session={session} locations={listData.locations} types={listData.types} clubs={listData.clubs} isAddActivity={true} isEdit={true} repeat={3} />
                                                                    </>
                                                                    : isShowActivity
                                                                        ? <>
                                                                            <Close isShow={true} action={activitiesActions.isShow} />
                                                                            <Show isActivity={true}/>
                                                                        </>
                                                                        : <>
                                                                            <div className={Styles.index}>
                                                                                <table className={Styles.table}>
                                                                                    <thead>
                                                                                    <tr>
                                                                                        {
                                                                                            headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                        }
                                                                                    </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                    {
                                                                                        data.docs.map((data, key) =>
                                                                                                <tr key={key}>
                                                                                                    <td>{data.title.length >= 25 ? data.title.slice(0, 25) + '...' : data.title}</td>
                                                                                                    <td>{data.club.name}</td>
                                                                                                    <td>{data.from}</td>
                                                                                                    <td>{data.to}</td>
                                                                                                    <td>{getDate(data.date)}</td>
                                                                                                    <td>{data.date.split('T')[0]}</td>
                                                                                                    <td>{data.status}</td>
                                                                                                    <td>
                                                                                                        {
                                                                                                            session.user.role === 'admin'
                                                                                                            || session.user.role === 'coordinator'
                                                                                                            || session.user.role === 'president'
                                                                                                                ? data.isAttend
                                                                                                                    ? <span className={Styles.isAttend} onClick={ e => {
                                                                                                                        axios.post('activities/isAttend', {
                                                                                                                            activityId: data._id,
                                                                                                                            statusActivity: false
                                                                                                                        }).then(async res => {
                                                                                                                            if(res.status === 201){
                                                                                                                                await mutate()
                                                                                                                                await swal({
                                                                                                                                    title: 'تم!',
                                                                                                                                    text: res.data.mess,
                                                                                                                                    icon: "success",
                                                                                                                                    button: false,
                                                                                                                                    timer: 2000,
                                                                                                                                });
                                                                                                                            }else {
                                                                                                                                await swal({
                                                                                                                                    title: 'خطأ!',
                                                                                                                                    text: res.data.mess,
                                                                                                                                    icon: "error",
                                                                                                                                    button: false,
                                                                                                                                    timer: 2000,
                                                                                                                                });
                                                                                                                            }
                                                                                                                        })
                                                                                                                    }}>مفتوح</span>
                                                                                                                    : <span className={Styles.isAttend} onClick={ e => {
                                                                                                                        axios.post('activities/isAttend', {
                                                                                                                            activityId: data._id,
                                                                                                                            statusActivity: true
                                                                                                                        }).then(async res => {
                                                                                                                            if(res.status === 201){
                                                                                                                                await mutate()
                                                                                                                                await swal({
                                                                                                                                    title: 'تم!',
                                                                                                                                    text: res.data.mess,
                                                                                                                                    icon: "success",
                                                                                                                                    button: false,
                                                                                                                                    timer: 2000,
                                                                                                                                });
                                                                                                                            }else {
                                                                                                                                await swal({
                                                                                                                                    title: 'خطأ!',
                                                                                                                                    text: res.data.mess,
                                                                                                                                    icon: "error",
                                                                                                                                    button: false,
                                                                                                                                    timer: 2000,
                                                                                                                                });
                                                                                                                            }
                                                                                                                        })
                                                                                                                    }}>مغلق</span>
                                                                                                                : <span>{data.isAttend ? "مفتوح" : "مغلق"}</span>
                                                                                                        }
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {
                                                                                                            permissions.editActivity.status &&
                                                                                                            <span onClick={() => {
                                                                                                                axios.get('/activities/get').then(res => {
                                                                                                                    setListData(res.data)
                                                                                                                    let dates= []
                                                                                                                    let times= []
                                                                                                                    var start = new Date(res.data.dates.start);
                                                                                                                    var end = new Date(res.data.dates.end);
                                                                                                                    var newend = end.setDate(end.getDate()+1);
                                                                                                                    var end = new Date(newend);
                                                                                                                    while(start < end){
                                                                                                                        dates.push((new Date(start)).toISOString().split('T')[0]);
                                                                                                                        var newDate = start.setDate(start.getDate() + 1);
                                                                                                                        start = new Date(newDate);
                                                                                                                    }
                                                                                                                    let startTime = Number(res.data.times.start.split(':')[0])
                                                                                                                    let endTime = Number(res.data.times.end.split(':')[0])
                                                                                                                    // console.log(startTime + 1)
                                                                                                                    while (startTime <= endTime){
                                                                                                                        times.push(`${startTime}:00`)
                                                                                                                        times.push(`${startTime}:30`)
                                                                                                                        startTime += 1
                                                                                                                    }

                                                                                                                    setListDates(dates)
                                                                                                                    setListTimes(times)
                                                                                                                });
                                                                                                                dispatch(activitiesActions.isEdit(true))
                                                                                                                dispatch(activitiesActions.edit({
                                                                                                                    id: data._id,
                                                                                                                    club: data.club._id,
                                                                                                                    type: data.type._id,
                                                                                                                    clubShare: data?.clubShare?._id,
                                                                                                                    title: data.title,
                                                                                                                    presenter: data.presenter,
                                                                                                                    notes: data.notes,
                                                                                                                    status: data.status,
                                                                                                                    date: data.date.split('T')[0],
                                                                                                                    from: data.from,
                                                                                                                    isDiscourse: data.isDiscourse,
                                                                                                                    isDesign: data.isDesign,
                                                                                                                    to: data.to,
                                                                                                                    hospitality: data.hospitality,
                                                                                                                    isShare: data.isShare.toString(),
                                                                                                                    projector: data.projector,
                                                                                                                    location: data.location._id,
                                                                                                                }))
                                                                                                            }}>
                                                                                                                  <svg
                                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                                      width={24}
                                                                                                                      height={24}
                                                                                                                      fill="none"
                                                                                                                  >
                                                                                                                    <path
                                                                                                                        fill="#fff"
                                                                                                                        d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                                        opacity={0.4}
                                                                                                                    />
                                                                                                                    <path
                                                                                                                        fill="#000"
                                                                                                                        d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                                    />
                                                                                                                    <path
                                                                                                                        fill="#000"
                                                                                                                        d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                                        opacity={0.4}
                                                                                                                    />
                                                                                                                  </svg>
                                                                                                            </span>
                                                                                                        }
                                                                                                        {
                                                                                                            permissions.showActivity.status &&
                                                                                                            <span onClick={event => {
                                                                                                                dispatch(activitiesActions.isShow(true))
                                                                                                                dispatch(activitiesActions.show({
                                                                                                                    club: data.club.name,
                                                                                                                    type: data.type.name,
                                                                                                                    title: data.title,
                                                                                                                    presenter: data.presenter,
                                                                                                                    notes: data.notes,
                                                                                                                    status: data.status,
                                                                                                                    date: data.date.split('T')[0],
                                                                                                                    from: data.from,
                                                                                                                    to: data.to,
                                                                                                                    hospitality: data.hospitality == true ? 'نعم' : 'لا',
                                                                                                                    isShare: data.isShare == true ? data.clubShare != null ? `مشتركة مع ${data.clubShare.name}` : 'نعم' : 'لا',
                                                                                                                    projector: data.projector == true ? 'نعم' : 'لا',
                                                                                                                    location: data.location.name
                                                                                                                }))
                                                                                                            }}>
                                                                                                                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" fill-rule="evenodd" clip-rule="evenodd" d="M17.737 6.046c1.707 1.318 3.16 3.249 4.205 5.663a.729.729 0 010 .572C19.854 17.111 16.137 20 12 20h-.01c-4.127 0-7.844-2.89-9.931-7.719a.728.728 0 010-.572C4.146 6.88 7.863 4 11.99 4H12c2.068 0 4.03.718 5.737 2.046zM8.097 12c0 2.133 1.747 3.87 3.903 3.87 2.146 0 3.893-1.737 3.893-3.87A3.888 3.888 0 0012 8.121c-2.156 0-3.902 1.736-3.902 3.879z" fill="#000" fill-opacity=".5"/><path d="M14.43 11.997a2.428 2.428 0 01-2.428 2.414c-1.347 0-2.44-1.086-2.44-2.414 0-.165.02-.32.05-.474h.048a1.997 1.997 0 002-1.921c.107-.019.225-.03.342-.03a2.43 2.43 0 012.429 2.425z" fill="#000" fill-opacity=".5"/></svg>
                                                                                                            </span>
                                                                                                        }
                                                                                                        {
                                                                                                            permissions.deleteActivity.status &&
                                                                                                            <span onClick={() => {
                                                                                                                swal({
                                                                                                                    title: 'هل أنت متأكد؟',
                                                                                                                    text: `هل أنت متأكد من أنك تريد حذف الفعالية [${data.title}]`,
                                                                                                                    icon: 'warning',
                                                                                                                    buttons: {
                                                                                                                        cancel: {
                                                                                                                            text: 'إلغاء',
                                                                                                                            value: null,
                                                                                                                            visible: true,
                                                                                                                            className: '',
                                                                                                                            closeModal: true,
                                                                                                                        },
                                                                                                                        confirm: {
                                                                                                                            text: 'موافق',
                                                                                                                            value: true,
                                                                                                                            visible: true,
                                                                                                                            className: '',
                                                                                                                            closeModal: true
                                                                                                                        },
                                                                                                                    },
                                                                                                                    dangerMode: true,
                                                                                                                }).then((willDelete) => {
                                                                                                                    if (willDelete) {
                                                                                                                        axios.delete(`/activities/delete?id=${data._id}`)
                                                                                                                            .then( async (res) => {
                                                                                                                                if(res.status === 201 ){
                                                                                                                                    await swal({
                                                                                                                                        title: 'تم!',
                                                                                                                                        text: res.data.mess,
                                                                                                                                        icon: "success",
                                                                                                                                        button: false,
                                                                                                                                        timer: 2000,
                                                                                                                                    });
                                                                                                                                }else {
                                                                                                                                    await swal({
                                                                                                                                        title: 'خطأ!',
                                                                                                                                        text: res.data.mess,
                                                                                                                                        icon: "error",
                                                                                                                                        button: false,
                                                                                                                                        timer: 2000,
                                                                                                                                    });
                                                                                                                                }
                                                                                                                            })
                                                                                                                    }
                                                                                                                });
                                                                                                            }}>
                                                                                                              <svg
                                                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                                                  width={24}
                                                                                                                  height={24}
                                                                                                                  fill="none"
                                                                                                              >
                                                                                                                <path
                                                                                                                    fill="#FD8A8A"
                                                                                                                    fillOpacity={0.5}
                                                                                                                    d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                                    opacity={0.4}
                                                                                                                />
                                                                                                                <path
                                                                                                                    fill="#DC3535"
                                                                                                                    fillOpacity={0.5}
                                                                                                                    d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                                />
                                                                                                              </svg>
                                                                                                            </span>
                                                                                                        }
                                                                                                    </td>
                                                                                                </tr>
                                                                                        )
                                                                                    }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                            {
                                                                                isPaginate && data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                            }
                                                                        </>
                                                                :  isYear
                                                                    ? isEditYear
                                                                        ? <>
                                                                            <Close action={yearsActions.isEdit} />
                                                                            <FormAdd isYear={isYear} titleAdd={'تعديل السنة'} isEdit={isEditYear} />
                                                                        </>
                                                                        : <>
                                                                            <div className={Styles.index}>
                                                                                <table className={Styles.table}>
                                                                                    <thead>
                                                                                    <tr>
                                                                                        {
                                                                                            headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                        }
                                                                                    </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                    {
                                                                                        data.docs.map((data, key) =>
                                                                                                <tr key={key}>
                                                                                                    <td>{data.nameH}</td>
                                                                                                    <td>{data.nameM}</td>
                                                                                                    <td>
                                                                                    <span onClick={() => {
                                                                                        dispatch(yearsActions.isEdit(true))
                                                                                        dispatch(yearsActions.edit({
                                                                                            id: data.id,
                                                                                            nameH: data.nameH,
                                                                                            nameM: data.nameM,
                                                                                        }))
                                                                                    }}>
                                                                                              <svg
                                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                                  width={24}
                                                                                                  height={24}
                                                                                                  fill="none"
                                                                                              >
                                                                                                <path
                                                                                                    fill="#fff"
                                                                                                    d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                    opacity={0.4}
                                                                                                />
                                                                                                <path
                                                                                                    fill="#000"
                                                                                                    d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                />
                                                                                                <path
                                                                                                    fill="#000"
                                                                                                    d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                    opacity={0.4}
                                                                                                />
                                                                                              </svg>
                                                                                    </span>
                                                                                                        <span onClick={() => {
                                                                                                            swal({
                                                                                                                title: 'هل أنت متأكد؟',
                                                                                                                text: `هل أنت متأكد من أنك تريد حذف السنة [${data.nameH}]`,
                                                                                                                icon: 'warning',
                                                                                                                buttons: {
                                                                                                                    cancel: {
                                                                                                                        text: 'إلغاء',
                                                                                                                        value: null,
                                                                                                                        visible: true,
                                                                                                                        className: '',
                                                                                                                        closeModal: true,
                                                                                                                    },
                                                                                                                    confirm: {
                                                                                                                        text: 'موافق',
                                                                                                                        value: true,
                                                                                                                        visible: true,
                                                                                                                        className: '',
                                                                                                                        closeModal: true
                                                                                                                    },
                                                                                                                },
                                                                                                                dangerMode: true,
                                                                                                            }).then((willDelete) => {
                                                                                                                if (willDelete) {
                                                                                                                    axios.delete(`/tools/years/delete?id=${data._id}`)
                                                                                                                        .then( async (res) => {
                                                                                                                            if(res.status === 201 ){
                                                                                                                                await swal({
                                                                                                                                    title: 'تم!',
                                                                                                                                    text: res.data.mess,
                                                                                                                                    icon: "success",
                                                                                                                                    button: false,
                                                                                                                                    timer: 2000,
                                                                                                                                });
                                                                                                                            }else {
                                                                                                                                await swal({
                                                                                                                                    title: 'خطأ!',
                                                                                                                                    text: res.data.mess,
                                                                                                                                    icon: "error",
                                                                                                                                    button: false,
                                                                                                                                    timer: 2000,
                                                                                                                                });
                                                                                                                            }
                                                                                                                        })
                                                                                                                }
                                                                                                            });
                                                                                                        }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#FD8A8A"
                                                                            fillOpacity={0.5}
                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#DC3535"
                                                                            fillOpacity={0.5}
                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                        />
                                                                      </svg>
                                                                    </span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                        )
                                                                                    }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                            {
                                                                                data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                            }
                                                                        </>
                                                                    : isPost
                                                                        ? isEditPost
                                                                            ? <>
                                                                                <Close action={postsActions.isEdit} />
                                                                                <FormUser session={session} clubs={listData.clubs} isAddPosts={true} isEdit={true} />
                                                                            </>
                                                                            : isShowPost
                                                                                ? <>
                                                                                    <Close isShow={true} action={postsActions.isShow} />
                                                                                    <Show isPost={true}/>
                                                                                </>
                                                                                : <>
                                                                                    <div className={Styles.index}>
                                                                                        <table className={Styles.table}>
                                                                                            <thead>
                                                                                            <tr>
                                                                                                {
                                                                                                    headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                                }
                                                                                            </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                            {
                                                                                                data.docs.map((data, key) =>
                                                                                                        <tr key={key}>
                                                                                                            <td>{data.title.length >= 25 ? data.title.slice(0, 25) + '...' : data.title}</td>
                                                                                                            <td>{data.user.name}</td>
                                                                                                            <td>{data.club.name}</td>
                                                                                                            <td>{data.createdAt.split('T')[0]}</td>
                                                                                                            <td>
                                                                                                                {
                                                                                                                    permissions.editPost.status &&
                                                                                                                    <span onClick={() => {
                                                                                                                        axios.get('/posts/get').then(res => {
                                                                                                                            setListData(res.data)
                                                                                                                        });
                                                                                                                        dispatch(postsActions.isEdit(true))
                                                                                                                        dispatch(postsActions.edit({
                                                                                                                            id: data._id,
                                                                                                                            title: data.title,
                                                                                                                            club: data.club._id,
                                                                                                                            user: data.user._id,
                                                                                                                            body: data.body,
                                                                                                                            image: data.image,
                                                                                                                        }))
                                                                                                                    }}>
                                                                                                                          <svg
                                                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                                                              width={24}
                                                                                                                              height={24}
                                                                                                                              fill="none"
                                                                                                                          >
                                                                                                                            <path
                                                                                                                                fill="#fff"
                                                                                                                                d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                                                opacity={0.4}
                                                                                                                            />
                                                                                                                            <path
                                                                                                                                fill="#000"
                                                                                                                                d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                                            />
                                                                                                                            <path
                                                                                                                                fill="#000"
                                                                                                                                d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                                                opacity={0.4}
                                                                                                                            />
                                                                                                                          </svg>
                                                                                                                    </span>
                                                                                                                }
                                                                                                                {
                                                                                                                    permissions.showPost.status &&
                                                                                                                    <span onClick={event => {
                                                                                                                            dispatch(postsActions.isShow(true))
                                                                                                                            dispatch(postsActions.show({
                                                                                                                                id: data._id,
                                                                                                                                title: data.title,
                                                                                                                                club: data.club.name,
                                                                                                                                user: {
                                                                                                                                    name: data.user.name,
                                                                                                                                    avatar: data.user.avatar
                                                                                                                                },
                                                                                                                                body: data.body,
                                                                                                                                createdAt: data.createdAt.split('T')[0],
                                                                                                                                image: data.image,
                                                                                                                            }))
                                                                                                                        }}>
                                                                                                                        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" fill-rule="evenodd" clip-rule="evenodd" d="M17.737 6.046c1.707 1.318 3.16 3.249 4.205 5.663a.729.729 0 010 .572C19.854 17.111 16.137 20 12 20h-.01c-4.127 0-7.844-2.89-9.931-7.719a.728.728 0 010-.572C4.146 6.88 7.863 4 11.99 4H12c2.068 0 4.03.718 5.737 2.046zM8.097 12c0 2.133 1.747 3.87 3.903 3.87 2.146 0 3.893-1.737 3.893-3.87A3.888 3.888 0 0012 8.121c-2.156 0-3.902 1.736-3.902 3.879z" fill="#000" fill-opacity=".5"/><path d="M14.43 11.997a2.428 2.428 0 01-2.428 2.414c-1.347 0-2.44-1.086-2.44-2.414 0-.165.02-.32.05-.474h.048a1.997 1.997 0 002-1.921c.107-.019.225-.03.342-.03a2.43 2.43 0 012.429 2.425z" fill="#000" fill-opacity=".5"/></svg>
                                                                                                                    </span>
                                                                                                                }
                                                                                                                {
                                                                                                                    permissions.deletePost.status &&
                                                                                                                    <span onClick={() => {
                                                                                                                        swal({
                                                                                                                            title: 'هل أنت متأكد؟',
                                                                                                                            text: `هل أنت متأكد من أنك تريد حذف المنشور [${data.title}]`,
                                                                                                                            icon: 'warning',
                                                                                                                            buttons: {
                                                                                                                                cancel: {
                                                                                                                                    text: 'إلغاء',
                                                                                                                                    value: null,
                                                                                                                                    visible: true,
                                                                                                                                    className: '',
                                                                                                                                    closeModal: true,
                                                                                                                                },
                                                                                                                                confirm: {
                                                                                                                                    text: 'موافق',
                                                                                                                                    value: true,
                                                                                                                                    visible: true,
                                                                                                                                    className: '',
                                                                                                                                    closeModal: true
                                                                                                                                },
                                                                                                                            },
                                                                                                                            dangerMode: true,
                                                                                                                        }).then((willDelete) => {
                                                                                                                            if (willDelete) {
                                                                                                                                axios.delete(`/posts/delete?id=${data._id}`)
                                                                                                                                    .then( async (res) => {
                                                                                                                                        if(res.status === 201 ){
                                                                                                                                            await swal({
                                                                                                                                                title: 'تم!',
                                                                                                                                                text: res.data.mess,
                                                                                                                                                icon: "success",
                                                                                                                                                button: false,
                                                                                                                                                timer: 2000,
                                                                                                                                            });
                                                                                                                                        }else {
                                                                                                                                            await swal({
                                                                                                                                                title: 'خطأ!',
                                                                                                                                                text: res.data.mess,
                                                                                                                                                icon: "error",
                                                                                                                                                button: false,
                                                                                                                                                timer: 2000,
                                                                                                                                            });
                                                                                                                                        }
                                                                                                                                    })
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }}>
                                                                                                                  <svg
                                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                                      width={24}
                                                                                                                      height={24}
                                                                                                                      fill="none"
                                                                                                                  >
                                                                                                                    <path
                                                                                                                        fill="#FD8A8A"
                                                                                                                        fillOpacity={0.5}
                                                                                                                        d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                                        opacity={0.4}
                                                                                                                    />
                                                                                                                    <path
                                                                                                                        fill="#DC3535"
                                                                                                                        fillOpacity={0.5}
                                                                                                                        d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                                    />
                                                                                                                  </svg>
                                                                                                                </span>
                                                                                                                }
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                )
                                                                                            }
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                    {
                                                                                        isPaginate && data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                                    }
                                                                                </>
                                                                        : isContact
                                                                            ? isEditContact
                                                                                ? <>
                                                                                    <Close action={contactsActions.isEdit} />
                                                                                    <FormUser session={session} clubs={listData.clubs} isAddContact={true} isEdit={true} />
                                                                                </>
                                                                                : isShowContact
                                                                                    ? <>
                                                                                        <Close isShow={true} action={contactsActions.isShow} />
                                                                                        <Show session={session} isContact={true}/>
                                                                                    </>
                                                                                    : <>
                                                                                        <div className={Styles.index}>
                                                                                            <table className={Styles.table}>
                                                                                                <thead>
                                                                                                <tr>
                                                                                                    {
                                                                                                        headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                                    }
                                                                                                </tr>
                                                                                                </thead>
                                                                                                <tbody>
                                                                                                {
                                                                                                    data.docs.map((data, key) =>
                                                                                                            <tr key={key}>
                                                                                                                <td>{data.title.length >= 25 ? data.title.slice(0, 25) + '...' : data.title}</td>
                                                                                                                <td>{data.user.name}</td>
                                                                                                                <td>{data.type}</td>
                                                                                                                <td>{data.club.name}</td>
                                                                                                                <td>{getStatusContact(data.status)}</td>
                                                                                                                <td>
                                                                                                                    {
                                                                                                                        permissions.editContact.status &&
                                                                                                                        <span onClick={() => {
                                                                                                                            axios.get('/contacts/get').then(res => {
                                                                                                                                setListData(res.data)
                                                                                                                            });
                                                                                                                            dispatch(contactsActions.isEdit(true))
                                                                                                                            dispatch(contactsActions.edit({
                                                                                                                                id: data._id,
                                                                                                                                title: data.title,
                                                                                                                                club: data.club._id,
                                                                                                                                user: data.user._id,
                                                                                                                                body: data.body,
                                                                                                                                image: data.image,
                                                                                                                                type: data.type,
                                                                                                                                status: data.status,
                                                                                                                            }))
                                                                                                                        }}>
                                                                                                                              <svg
                                                                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                                                                  width={24}
                                                                                                                                  height={24}
                                                                                                                                  fill="none"
                                                                                                                              >
                                                                                                                                <path
                                                                                                                                    fill="#fff"
                                                                                                                                    d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                                                    opacity={0.4}
                                                                                                                                />
                                                                                                                                <path
                                                                                                                                    fill="#000"
                                                                                                                                    d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                                                />
                                                                                                                                <path
                                                                                                                                    fill="#000"
                                                                                                                                    d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                                                    opacity={0.4}
                                                                                                                                />
                                                                                                                              </svg>
                                                                                                                    </span>
                                                                                                                    }
                                                                                                                    {
                                                                                                                        permissions.showContact.status &&
                                                                                                                        <span onClick={event => {
                                                                                                                            dispatch(contactsActions.isShow(true))
                                                                                                                            dispatch(contactsActions.show({
                                                                                                                                id: data._id,
                                                                                                                                title: data.title,
                                                                                                                                club_id: data.club._id,
                                                                                                                                club: data.club.name,
                                                                                                                                user_id: data.user._id,
                                                                                                                                user: {
                                                                                                                                    name: data.user.name,
                                                                                                                                    avatar: data.user.avatar
                                                                                                                                },
                                                                                                                                body: data.body,
                                                                                                                                image: data.image,
                                                                                                                                type: data.type,
                                                                                                                                status: data.status,
                                                                                                                                createdAt: data.createdAt.split('T')[0],
                                                                                                                            }))
                                                                                                                        }}>
                                                                                                                        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" fill-rule="evenodd" clip-rule="evenodd" d="M17.737 6.046c1.707 1.318 3.16 3.249 4.205 5.663a.729.729 0 010 .572C19.854 17.111 16.137 20 12 20h-.01c-4.127 0-7.844-2.89-9.931-7.719a.728.728 0 010-.572C4.146 6.88 7.863 4 11.99 4H12c2.068 0 4.03.718 5.737 2.046zM8.097 12c0 2.133 1.747 3.87 3.903 3.87 2.146 0 3.893-1.737 3.893-3.87A3.888 3.888 0 0012 8.121c-2.156 0-3.902 1.736-3.902 3.879z" fill="#000" fill-opacity=".5"/><path d="M14.43 11.997a2.428 2.428 0 01-2.428 2.414c-1.347 0-2.44-1.086-2.44-2.414 0-.165.02-.32.05-.474h.048a1.997 1.997 0 002-1.921c.107-.019.225-.03.342-.03a2.43 2.43 0 012.429 2.425z" fill="#000" fill-opacity=".5"/></svg>
                                                                                                                    </span>
                                                                                                                    }
                                                                                                                    {
                                                                                                                        permissions.deleteContact.status &&
                                                                                                                        <span onClick={() => {
                                                                                                                            swal({
                                                                                                                                title: 'هل أنت متأكد؟',
                                                                                                                                text: `هل أنت متأكد من أنك تريد حذف الطلب [${data.title}]`,
                                                                                                                                icon: 'warning',
                                                                                                                                buttons: {
                                                                                                                                    cancel: {
                                                                                                                                        text: 'إلغاء',
                                                                                                                                        value: null,
                                                                                                                                        visible: true,
                                                                                                                                        className: '',
                                                                                                                                        closeModal: true,
                                                                                                                                    },
                                                                                                                                    confirm: {
                                                                                                                                        text: 'موافق',
                                                                                                                                        value: true,
                                                                                                                                        visible: true,
                                                                                                                                        className: '',
                                                                                                                                        closeModal: true
                                                                                                                                    },
                                                                                                                                },
                                                                                                                                dangerMode: true,
                                                                                                                            }).then((willDelete) => {
                                                                                                                                if (willDelete) {
                                                                                                                                    axios.delete(`/contacts/delete?id=${data._id}`)
                                                                                                                                        .then( async (res) => {
                                                                                                                                            if(res.status === 201 ){
                                                                                                                                                await swal({
                                                                                                                                                    title: 'تم!',
                                                                                                                                                    text: res.data.mess,
                                                                                                                                                    icon: "success",
                                                                                                                                                    button: false,
                                                                                                                                                    timer: 2000,
                                                                                                                                                });
                                                                                                                                            }else {
                                                                                                                                                await swal({
                                                                                                                                                    title: 'خطأ!',
                                                                                                                                                    text: res.data.mess,
                                                                                                                                                    icon: "error",
                                                                                                                                                    button: false,
                                                                                                                                                    timer: 2000,
                                                                                                                                                });
                                                                                                                                            }
                                                                                                                                        })
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }}>
                                                                                                                      <svg
                                                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                                                          width={24}
                                                                                                                          height={24}
                                                                                                                          fill="none"
                                                                                                                      >
                                                                                                                        <path
                                                                                                                            fill="#FD8A8A"
                                                                                                                            fillOpacity={0.5}
                                                                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                                            opacity={0.4}
                                                                                                                        />
                                                                                                                        <path
                                                                                                                            fill="#DC3535"
                                                                                                                            fillOpacity={0.5}
                                                                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                                        />
                                                                                                                      </svg>
                                                                                                                    </span>
                                                                                                                    }
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                    )
                                                                                                }
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                        {
                                                                                            isPaginate && data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                                        }
                                                                                    </>
                                                                            : isAwardAndActivity
                                                                                ? isShowAwardsAndActivities
                                                                                        ? <>
                                                                                            <Close isShow={true} action={awardsAndActivitiesActions.isShow} />
                                                                                            <Show isAward={true}/>
                                                                                        </>
                                                                                        : <>
                                                                                            <div className={Styles.index}>
                                                                                                <table className={Styles.table}>
                                                                                                    <thead>
                                                                                                    <tr>
                                                                                                        {
                                                                                                            headers.map((header, key) => header !== "null" && <th key={key}>{header}</th>)
                                                                                                        }
                                                                                                    </tr>
                                                                                                    </thead>
                                                                                                    <tbody>
                                                                                                    {
                                                                                                        data.docs.map((data, key) =>
                                                                                                                <tr key={key}>
                                                                                                                    <td>{!isShowUser ? data.user.name : data.awardAndActivityId.activityId.title.length >= 15 ? data.awardAndActivityId.activityId.title.slice(0, 15) + "..." : data.awardAndActivityId.activityId.title}</td>
                                                                                                                    <td>{data.user.username}</td>
                                                                                                                    <td>{data.user.country.name}</td>
                                                                                                                    <td>{awardClubName == null ? data.awardAndActivityId.activityId.club.name : awardClubName}</td>
                                                                                                                    <td>{data.award.name}</td>
                                                                                                                    <td>{data.coordinator.name}</td>
                                                                                                                    <td>
                                                                                                                        {
                                                                                                                            !isAllAwards
                                                                                                                                ? session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                                                                                                                                    ? data.status === "استلم"
                                                                                                                                        ? <span className={Styles.isAttend} onClick={ e => {
                                                                                                                                            axios.post('awards/show/isReceived', {
                                                                                                                                                awardId: data._id,
                                                                                                                                                statusAward: false
                                                                                                                                            }).then(async res => {
                                                                                                                                                if(res.status === 201){
                                                                                                                                                    await mutate()
                                                                                                                                                    await swal({
                                                                                                                                                        title: 'تم!',
                                                                                                                                                        text: res.data.mess,
                                                                                                                                                        icon: "success",
                                                                                                                                                        button: false,
                                                                                                                                                        timer: 2000,
                                                                                                                                                    });
                                                                                                                                                }else {
                                                                                                                                                    await swal({
                                                                                                                                                        title: 'خطأ!',
                                                                                                                                                        text: res.data.mess,
                                                                                                                                                        icon: "error",
                                                                                                                                                        button: false,
                                                                                                                                                        timer: 2000,
                                                                                                                                                    });
                                                                                                                                                }
                                                                                                                                            })
                                                                                                                                        }}>استلم</span>
                                                                                                                                        : <span className={Styles.isAttend} onClick={ e => {
                                                                                                                                            axios.post('awards/show/isReceived', {
                                                                                                                                                awardId: data._id,
                                                                                                                                                statusAward: true
                                                                                                                                            }).then(async res => {
                                                                                                                                                if(res.status === 201){
                                                                                                                                                    await mutate()
                                                                                                                                                    await swal({
                                                                                                                                                        title: 'تم!',
                                                                                                                                                        text: res.data.mess,
                                                                                                                                                        icon: "success",
                                                                                                                                                        button: false,
                                                                                                                                                        timer: 2000,
                                                                                                                                                    });
                                                                                                                                                }else {
                                                                                                                                                    await swal({
                                                                                                                                                        title: 'خطأ!',
                                                                                                                                                        text: res.data.mess,
                                                                                                                                                        icon: "error",
                                                                                                                                                        button: false,
                                                                                                                                                        timer: 2000,
                                                                                                                                                    });
                                                                                                                                                }
                                                                                                                                            })
                                                                                                                                        }}>لم يستلم</span>
                                                                                                                                    : data.status
                                                                                                                                : data.status
                                                                                                                        }
                                                                                                                    </td>
                                                                                                                    {
                                                                                                                        session.user.permissions.deleteAward.status || session.user.permissions.showAward.status
                                                                                                                            ? !isAllAwards
                                                                                                                                ? <td>
                                                                                                                                    {
                                                                                                                                        permissions.showAward.status
                                                                                                                                            ? !isShowUser &&
                                                                                                                                                <span onClick={event => {
                                                                                                                                                            router.push(`/awards/${router.query.awardId}/student?studentId=${data.user._id}&name=${data.user.name}`)
                                                                                                                                                        }}>
                                                                                                                                                    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" fill-rule="evenodd" clip-rule="evenodd" d="M17.737 6.046c1.707 1.318 3.16 3.249 4.205 5.663a.729.729 0 010 .572C19.854 17.111 16.137 20 12 20h-.01c-4.127 0-7.844-2.89-9.931-7.719a.728.728 0 010-.572C4.146 6.88 7.863 4 11.99 4H12c2.068 0 4.03.718 5.737 2.046zM8.097 12c0 2.133 1.747 3.87 3.903 3.87 2.146 0 3.893-1.737 3.893-3.87A3.888 3.888 0 0012 8.121c-2.156 0-3.902 1.736-3.902 3.879z" fill="#000" fill-opacity=".5"/><path d="M14.43 11.997a2.428 2.428 0 01-2.428 2.414c-1.347 0-2.44-1.086-2.44-2.414 0-.165.02-.32.05-.474h.048a1.997 1.997 0 002-1.921c.107-.019.225-.03.342-.03a2.43 2.43 0 012.429 2.425z" fill="#000" fill-opacity=".5"/></svg>
                                                                                                                                                </span>
                                                                                                                                            : null
                                                                                                                                    }
                                                                                                                                    {
                                                                                                                                        permissions.deleteAward.status
                                                                                                                                            ?
                                                                                                                                            <span onClick={() => {
                                                                                                                                                swal({
                                                                                                                                                    title: 'هل أنت متأكد؟',
                                                                                                                                                    text: `هل أنت متأكد من أنك تريد حذف جائزة الطالب [${data.user.name}]`,
                                                                                                                                                    icon: 'warning',
                                                                                                                                                    buttons: {
                                                                                                                                                        cancel: {
                                                                                                                                                            text: 'إلغاء',
                                                                                                                                                            value: null,
                                                                                                                                                            visible: true,
                                                                                                                                                            className: '',
                                                                                                                                                            closeModal: true,
                                                                                                                                                        },
                                                                                                                                                        confirm: {
                                                                                                                                                            text: 'موافق',
                                                                                                                                                            value: true,
                                                                                                                                                            visible: true,
                                                                                                                                                            className: '',
                                                                                                                                                            closeModal: true
                                                                                                                                                        },
                                                                                                                                                    },
                                                                                                                                                    dangerMode: true,
                                                                                                                                                }).then((willDelete) => {
                                                                                                                                                    if (willDelete) {
                                                                                                                                                        axios.delete(`/awards/show/delete?id=${data._id}`)
                                                                                                                                                            .then( async (res) => {
                                                                                                                                                                if(res.status === 201 ){
                                                                                                                                                                    await swal({
                                                                                                                                                                        title: 'تم!',
                                                                                                                                                                        text: res.data.mess,
                                                                                                                                                                        icon: "success",
                                                                                                                                                                        button: false,
                                                                                                                                                                        timer: 2000,
                                                                                                                                                                    });
                                                                                                                                                                }else {
                                                                                                                                                                    await swal({
                                                                                                                                                                        title: 'خطأ!',
                                                                                                                                                                        text: res.data.mess,
                                                                                                                                                                        icon: "error",
                                                                                                                                                                        button: false,
                                                                                                                                                                        timer: 2000,
                                                                                                                                                                    });
                                                                                                                                                                }
                                                                                                                                                            })
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                            }}>
                                                                                                                                                  <svg
                                                                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                      width={24}
                                                                                                                                                      height={24}
                                                                                                                                                      fill="none"
                                                                                                                                                  >
                                                                                                                                                    <path
                                                                                                                                                        fill="#FD8A8A"
                                                                                                                                                        fillOpacity={0.5}
                                                                                                                                                        d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                                                                        opacity={0.4}
                                                                                                                                                    />
                                                                                                                                                    <path
                                                                                                                                                        fill="#DC3535"
                                                                                                                                                        fillOpacity={0.5}
                                                                                                                                                        d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                                                                    />
                                                                                                                                                  </svg>
                                                                                                                                                </span>
                                                                                                                                            : null
                                                                                                                                    }
                                                                                                                                </td>
                                                                                                                                : null
                                                                                                                            : null
                                                                                                                    }
                                                                                                                </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </div>
                                                                                            {
                                                                                                isPaginate && data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                                            }
                                                                                        </>
                                                                                : isReview
                                                                                    ? isEditReview
                                                                                        ? <>
                                                                                            <Close action={reviewsActions.isEdit} />
                                                                                            <Form isEdit={true} session={session}/>
                                                                                        </>
                                                                                        : isShowReview
                                                                                            ? <>
                                                                                                <Close isShow={true} action={reviewsActions.isShow} />
                                                                                                <Show isReview={true}/>
                                                                                            </>
                                                                                            : <>
                                                                                                <div className={Styles.index}>
                                                                                                    <table className={Styles.table}>
                                                                                                        <thead>
                                                                                                        <tr>
                                                                                                            {
                                                                                                                headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                                            }
                                                                                                        </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                        {
                                                                                                            data.docs.map((data, key) =>
                                                                                                                    <tr key={key}>
                                                                                                                        <td>{data.user.name.length > 20 ? data.user.name.slice(0, 19) + "..." : data.user.name}</td>
                                                                                                                        <td>{data.activity.title.length > 20 ? data.activity.title.slice(0, 19) + "..." : data.activity.title}</td>
                                                                                                                        <td>{data.activity.club.name}</td>
                                                                                                                        <td>{data.benefit}</td>
                                                                                                                        <td>{data.lecturer}</td>
                                                                                                                        <td>{data.attended}</td>
                                                                                                                        <td>{data.createdAt.split('T')[0]}</td>
                                                                                                                        <td>
                                                                                                                            {
                                                                                                                                permissions.editAttend.status &&
                                                                                                                                session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials'
                                                                                                                                        ? session.user.id !== data.user._id
                                                                                                                                            ? null
                                                                                                                                            : <span onClick={() => {
                                                                                                                                            dispatch(reviewsActions.isEdit(true))
                                                                                                                                            dispatch(reviewsActions.edit({
                                                                                                                                                id: data._id,
                                                                                                                                                user: data.user._id,
                                                                                                                                                activity: data.activity._id,
                                                                                                                                                benefit: data.benefit,
                                                                                                                                                lecturer: data.lecturer,
                                                                                                                                                attended: data.attended,
                                                                                                                                                suggestions: data.suggestions,
                                                                                                                                                utility: data.utility,
                                                                                                                                            }))
                                                                                                                                        }}>
                                                                                                                                              <svg
                                                                                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                  width={24}
                                                                                                                                                  height={24}
                                                                                                                                                  fill="none"
                                                                                                                                              >
                                                                                                                                                <path
                                                                                                                                                    fill="#fff"
                                                                                                                                                    d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                                                                    opacity={0.4}
                                                                                                                                                />
                                                                                                                                                <path
                                                                                                                                                    fill="#000"
                                                                                                                                                    d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                                                                />
                                                                                                                                                <path
                                                                                                                                                    fill="#000"
                                                                                                                                                    d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                                                                    opacity={0.4}
                                                                                                                                                />
                                                                                                                                              </svg>
                                                                                                                                        </span>
                                                                                                                                        : <span onClick={() => {
                                                                                                                                        dispatch(reviewsActions.isEdit(true))
                                                                                                                                        dispatch(reviewsActions.edit({
                                                                                                                                            id: data._id,
                                                                                                                                            user: data.user._id,
                                                                                                                                            activity: data.activity._id,
                                                                                                                                            benefit: data.benefit,
                                                                                                                                            lecturer: data.lecturer,
                                                                                                                                            attended: data.attended,
                                                                                                                                            suggestions: data.suggestions,
                                                                                                                                            utility: data.utility,
                                                                                                                                        }))
                                                                                                                                    }}>
                                                                                                                                              <svg
                                                                                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                  width={24}
                                                                                                                                                  height={24}
                                                                                                                                                  fill="none"
                                                                                                                                              >
                                                                                                                                                <path
                                                                                                                                                    fill="#fff"
                                                                                                                                                    d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                                                                    opacity={0.4}
                                                                                                                                                />
                                                                                                                                                <path
                                                                                                                                                    fill="#000"
                                                                                                                                                    d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                                                                />
                                                                                                                                                <path
                                                                                                                                                    fill="#000"
                                                                                                                                                    d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                                                                    opacity={0.4}
                                                                                                                                                />
                                                                                                                                              </svg>
                                                                                                                                        </span>
                                                                                                                            }
                                                                                                                            {
                                                                                                                                permissions.showAttend.status &&
                                                                                                                                <span onClick={event => {
                                                                                                                                    dispatch(reviewsActions.isShow(true))
                                                                                                                                    dispatch(reviewsActions.show({
                                                                                                                                        id: data._id,
                                                                                                                                        user: data.user.name,
                                                                                                                                        activity: data.activity.title,
                                                                                                                                        club: data.activity.club.name,
                                                                                                                                        benefit: data.benefit,
                                                                                                                                        lecturer: data.lecturer,
                                                                                                                                        attended: data.attended,
                                                                                                                                        suggestions: data.suggestions,
                                                                                                                                        utility: data.utility,
                                                                                                                                        createdAt: data.createdAt.split('T')[0],
                                                                                                                                    }))
                                                                                                                                }}>
                                                                                                                                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" fill-rule="evenodd" clip-rule="evenodd" d="M17.737 6.046c1.707 1.318 3.16 3.249 4.205 5.663a.729.729 0 010 .572C19.854 17.111 16.137 20 12 20h-.01c-4.127 0-7.844-2.89-9.931-7.719a.728.728 0 010-.572C4.146 6.88 7.863 4 11.99 4H12c2.068 0 4.03.718 5.737 2.046zM8.097 12c0 2.133 1.747 3.87 3.903 3.87 2.146 0 3.893-1.737 3.893-3.87A3.888 3.888 0 0012 8.121c-2.156 0-3.902 1.736-3.902 3.879z" fill="#000" fill-opacity=".5"/><path d="M14.43 11.997a2.428 2.428 0 01-2.428 2.414c-1.347 0-2.44-1.086-2.44-2.414 0-.165.02-.32.05-.474h.048a1.997 1.997 0 002-1.921c.107-.019.225-.03.342-.03a2.43 2.43 0 012.429 2.425z" fill="#000" fill-opacity=".5"/></svg>
                                                                                                                            </span>
                                                                                                                            }
                                                                                                                            {
                                                                                                                                permissions.deleteAttend.status &&
                                                                                                                                <span onClick={() => {
                                                                                                                                    swal({
                                                                                                                                        title: 'هل أنت متأكد؟',
                                                                                                                                        text: `هل أنت متأكد من أنك تريد حذف تقييم [${data.user.name}]`,
                                                                                                                                        icon: 'warning',
                                                                                                                                        buttons: {
                                                                                                                                            cancel: {
                                                                                                                                                text: 'إلغاء',
                                                                                                                                                value: null,
                                                                                                                                                visible: true,
                                                                                                                                                className: '',
                                                                                                                                                closeModal: true,
                                                                                                                                            },
                                                                                                                                            confirm: {
                                                                                                                                                text: 'موافق',
                                                                                                                                                value: true,
                                                                                                                                                visible: true,
                                                                                                                                                className: '',
                                                                                                                                                closeModal: true
                                                                                                                                            },
                                                                                                                                        },
                                                                                                                                        dangerMode: true,
                                                                                                                                    }).then((willDelete) => {
                                                                                                                                        if (willDelete) {
                                                                                                                                            axios.delete(`/attendees/delete?id=${data._id}`)
                                                                                                                                                .then( async (res) => {
                                                                                                                                                    if(res.status === 201 ){
                                                                                                                                                        await swal({
                                                                                                                                                            title: 'تم!',
                                                                                                                                                            text: res.data.mess,
                                                                                                                                                            icon: "success",
                                                                                                                                                            button: false,
                                                                                                                                                            timer: 2000,
                                                                                                                                                        });
                                                                                                                                                    }else {
                                                                                                                                                        await swal({
                                                                                                                                                            title: 'خطأ!',
                                                                                                                                                            text: res.data.mess,
                                                                                                                                                            icon: "error",
                                                                                                                                                            button: false,
                                                                                                                                                            timer: 2000,
                                                                                                                                                        });
                                                                                                                                                    }
                                                                                                                                                })
                                                                                                                                        }
                                                                                                                                    });
                                                                                                                                }}>
                                                                                                                              <svg
                                                                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                                                                  width={24}
                                                                                                                                  height={24}
                                                                                                                                  fill="none"
                                                                                                                              >
                                                                                                                                <path
                                                                                                                                    fill="#FD8A8A"
                                                                                                                                    fillOpacity={0.5}
                                                                                                                                    d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                                                    opacity={0.4}
                                                                                                                                />
                                                                                                                                <path
                                                                                                                                    fill="#DC3535"
                                                                                                                                    fillOpacity={0.5}
                                                                                                                                    d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                                                />
                                                                                                                              </svg>
                                                                                                                            </span>
                                                                                                                            }
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </div>
                                                                                                {
                                                                                                    isPaginate && data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                                                }
                                                                                            </>
                                                                                    : isAdministrativeClub
                                                                                        ? <>
                                                                                            <div className={Styles.index}>
                                                                                                <table className={Styles.table}>
                                                                                                    <thead>
                                                                                                    <tr>
                                                                                                        {
                                                                                                            headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                                        }
                                                                                                    </tr>
                                                                                                    </thead>
                                                                                                    <tbody>
                                                                                                    {
                                                                                                        data.docs.map((data, key) =>
                                                                                                                <tr key={key}>
                                                                                                                    <td>{data.user.name}</td>
                                                                                                                    {
                                                                                                                        data.user.avatar == null
                                                                                                                            ? <td>---</td>
                                                                                                                            : <td>
                                                                                                                                <Image src={`/uploads/files/${data.user.avatar}`} width={100} height={100}/>
                                                                                                                            </td>
                                                                                                                    }
                                                                                                                    <td>{data.user.username}</td>
                                                                                                                    <td>{data.user.country.name}</td>
                                                                                                                    <td>{data.administrative.name}</td>
                                                                                                                    <td>{getType(data.user.role)}</td>
                                                                                                                    <td>
                                                                                                                        <span onClick={() => {
                                                                                                                            swal({
                                                                                                                                title: 'هل أنت متأكد؟',
                                                                                                                                text: `هل أنت متأكد من أنك تريد حذف الإداري [${data.user.name}] من الوظيفة [${data.administrative.name}]`,
                                                                                                                                icon: 'warning',
                                                                                                                                buttons: {
                                                                                                                                    cancel: {
                                                                                                                                        text: 'إلغاء',
                                                                                                                                        value: null,
                                                                                                                                        visible: true,
                                                                                                                                        className: '',
                                                                                                                                        closeModal: true,
                                                                                                                                    },
                                                                                                                                    confirm: {
                                                                                                                                        text: 'موافق',
                                                                                                                                        value: true,
                                                                                                                                        visible: true,
                                                                                                                                        className: '',
                                                                                                                                        closeModal: true
                                                                                                                                    },
                                                                                                                                },
                                                                                                                                dangerMode: true,
                                                                                                                            }).then((willDelete) => {
                                                                                                                                if (willDelete) {
                                                                                                                                    axios.delete(`/clubs/management/administrative/delete?id=${data.id}&isDeputy=false`)
                                                                                                                                        .then( async (res) => {
                                                                                                                                            if(res.status === 201 ){
                                                                                                                                                await swal({
                                                                                                                                                    title: 'تم!',
                                                                                                                                                    text: res.data.mess,
                                                                                                                                                    icon: "success",
                                                                                                                                                    button: false,
                                                                                                                                                    timer: 2000,
                                                                                                                                                });
                                                                                                                                            }else {
                                                                                                                                                await swal({
                                                                                                                                                    title: 'خطأ!',
                                                                                                                                                    text: res.data.mess,
                                                                                                                                                    icon: "error",
                                                                                                                                                    button: false,
                                                                                                                                                    timer: 2000,
                                                                                                                                                });
                                                                                                                                            }
                                                                                                                                        })
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }}>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width={24}
                                                                          height={24}
                                                                          fill="none"
                                                                      >
                                                                        <path
                                                                            fill="#FD8A8A"
                                                                            fillOpacity={0.5}
                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                            opacity={0.4}
                                                                        />
                                                                        <path
                                                                            fill="#DC3535"
                                                                            fillOpacity={0.5}
                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                        />
                                                                      </svg>
                                                                    </span>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    {
                                                                                                        data.docs.map((data, key) =>
                                                                                                                data.deputy != null &&
                                                                                                                <tr key={key}>
                                                                                                                    <td>{data.deputy.name}</td>
                                                                                                                    {
                                                                                                                        data.deputy.avatar == null
                                                                                                                            ? <td>---</td>
                                                                                                                            : <td><Image src={`/uploads/files/${data.user.avatar}`} width={100} height={100}/></td>
                                                                                                                    }
                                                                                                                    <td>{data.deputy.username}</td>
                                                                                                                    <td>{data.deputy.country.name}</td>
                                                                                                                    <td>{data.administrative.name}</td>
                                                                                                                    <td>{getType(data.deputy.role)}</td>
                                                                                                                    <td>
                                                                                                                        <span onClick={() => {
                                                                                                                            swal({
                                                                                                                                title: 'هل أنت متأكد؟',
                                                                                                                                text: `هل أنت متأكد من أنك تريد حذف النائب [${data.deputy.name}] من الوظيفة [${data.administrative.name}]`,
                                                                                                                                icon: 'warning',
                                                                                                                                buttons: {
                                                                                                                                    cancel: {
                                                                                                                                        text: 'إلغاء',
                                                                                                                                        value: null,
                                                                                                                                        visible: true,
                                                                                                                                        className: '',
                                                                                                                                        closeModal: true,
                                                                                                                                    },
                                                                                                                                    confirm: {
                                                                                                                                        text: 'موافق',
                                                                                                                                        value: true,
                                                                                                                                        visible: true,
                                                                                                                                        className: '',
                                                                                                                                        closeModal: true
                                                                                                                                    },
                                                                                                                                },
                                                                                                                                dangerMode: true,
                                                                                                                            }).then((willDelete) => {
                                                                                                                                if (willDelete) {
                                                                                                                                    axios.delete(`/clubs/management/administrative/delete?id=${data.id}&isDeputy=true`)
                                                                                                                                        .then( async (res) => {
                                                                                                                                            if(res.status === 201 ){
                                                                                                                                                await swal({
                                                                                                                                                    title: 'تم!',
                                                                                                                                                    text: res.data.mess,
                                                                                                                                                    icon: "success",
                                                                                                                                                    button: false,
                                                                                                                                                    timer: 2000,
                                                                                                                                                });
                                                                                                                                            }else {
                                                                                                                                                await swal({
                                                                                                                                                    title: 'خطأ!',
                                                                                                                                                    text: res.data.mess,
                                                                                                                                                    icon: "error",
                                                                                                                                                    button: false,
                                                                                                                                                    timer: 2000,
                                                                                                                                                });
                                                                                                                                            }
                                                                                                                                        })
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }}>
                                                                                                                          <svg
                                                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                                                              width={24}
                                                                                                                              height={24}
                                                                                                                              fill="none"
                                                                                                                          >
                                                                                                                            <path
                                                                                                                                fill="#FD8A8A"
                                                                                                                                fillOpacity={0.5}
                                                                                                                                d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                                                opacity={0.4}
                                                                                                                            />
                                                                                                                            <path
                                                                                                                                fill="#DC3535"
                                                                                                                                fillOpacity={0.5}
                                                                                                                                d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                                            />
                                                                                                                          </svg>
                                                                                                                        </span>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </div>
                                                                                            {
                                                                                                data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                                            }
                                                                                        </>
                                                                                        : isComment
                                                                                            ? <>
                                                                                                <div className={Styles.index}>
                                                                                                    <table className={Styles.table}>
                                                                                                        <thead>
                                                                                                        <tr>
                                                                                                            {
                                                                                                                headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                                            }
                                                                                                        </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                        {
                                                                                                            data.docs.map((data, key) =>
                                                                                                                <tr key={key}>
                                                                                                                    <td>{data.user.name}</td>
                                                                                                                    <td>{data.post.title.length >= 25 ? data.post.title.slice(0, 25) + '...' : data.post.title}</td>
                                                                                                                    <td>{data.user.club.name}</td>
                                                                                                                    <td>{data.createdAt.split('T')[0]}</td>
                                                                                                                    <td>{data.isPublished == false ? "مخفي" : "منشور"}</td>
                                                                                                                    <td>
                                                                                                                        {
                                                                                                                            data.isPublished == false
                                                                                                                                ? permissions.editComment.status &&
                                                                                                                                    <span onClick={() => {
                                                                                                                                        swal({
                                                                                                                                            title: 'هل أنت متأكد؟',
                                                                                                                                            text: `هل أنت متأكد من أنك تريد تغيير حالة تعليق [${data.user.name}] من مخفي إلى منشور؟ `,
                                                                                                                                            icon: 'warning',
                                                                                                                                            buttons: {
                                                                                                                                                cancel: {
                                                                                                                                                    text: 'إلغاء',
                                                                                                                                                    value: null,
                                                                                                                                                    visible: true,
                                                                                                                                                    className: '',
                                                                                                                                                    closeModal: true,
                                                                                                                                                },
                                                                                                                                                confirm: {
                                                                                                                                                    text: 'موافق',
                                                                                                                                                    value: true,
                                                                                                                                                    visible: true,
                                                                                                                                                    className: '',
                                                                                                                                                    closeModal: true
                                                                                                                                                },
                                                                                                                                            },
                                                                                                                                            dangerMode: true,
                                                                                                                                        }).then((willDelete) => {
                                                                                                                                            if (willDelete) {
                                                                                                                                                axios.put('/posts/comments/published', {
                                                                                                                                                    status: true,
                                                                                                                                                    commentId: data._id
                                                                                                                                                }).then(async res => {
                                                                                                                                                    if(res.status === 201){
                                                                                                                                                        await mutate()
                                                                                                                                                        await swal({
                                                                                                                                                            title: 'تم!',
                                                                                                                                                            text: res.data.mess,
                                                                                                                                                            icon: "success",
                                                                                                                                                            button: false,
                                                                                                                                                            timer: 2000,
                                                                                                                                                        });
                                                                                                                                                    }else {
                                                                                                                                                        await mutate()
                                                                                                                                                        await swal({
                                                                                                                                                            title: 'خطأ!',
                                                                                                                                                            text: res.data.mess,
                                                                                                                                                            icon: "error",
                                                                                                                                                            button: false,
                                                                                                                                                            timer: 2000,
                                                                                                                                                        });
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                            }
                                                                                                                                        });
                                                                                                                                    }}>
                                                                                                                                        <FontAwesomeIcon style={{
                                                                                                                                            fontSize: "24px",
                                                                                                                                            color: "green",
                                                                                                                                        }} icon={faCheck} />
                                                                                                                                    </span>
                                                                                                                                : permissions.editComment.status &&
                                                                                                                                    <span onClick={() => {
                                                                                                                                        swal({
                                                                                                                                            title: 'هل أنت متأكد؟',
                                                                                                                                            text: `هل أنت متأكد من أنك تريد تغيير حالة تعليق [${data.user.name}] من منشور إلى مخفي؟ `,
                                                                                                                                            icon: 'warning',
                                                                                                                                            buttons: {
                                                                                                                                                cancel: {
                                                                                                                                                    text: 'إلغاء',
                                                                                                                                                    value: null,
                                                                                                                                                    visible: true,
                                                                                                                                                    className: '',
                                                                                                                                                    closeModal: true,
                                                                                                                                                },
                                                                                                                                                confirm: {
                                                                                                                                                    text: 'موافق',
                                                                                                                                                    value: true,
                                                                                                                                                    visible: true,
                                                                                                                                                    className: '',
                                                                                                                                                    closeModal: true
                                                                                                                                                },
                                                                                                                                            },
                                                                                                                                            dangerMode: true,
                                                                                                                                        }).then((willDelete) => {
                                                                                                                                            if (willDelete) {
                                                                                                                                                axios.put('/posts/comments/published', {
                                                                                                                                                    status: false,
                                                                                                                                                    commentId: data._id
                                                                                                                                                }).then(async res => {
                                                                                                                                                    if(res.status === 201){
                                                                                                                                                        await mutate()
                                                                                                                                                        await swal({
                                                                                                                                                            title: 'تم!',
                                                                                                                                                            text: res.data.mess,
                                                                                                                                                            icon: "success",
                                                                                                                                                            button: false,
                                                                                                                                                            timer: 2000,
                                                                                                                                                        });
                                                                                                                                                    }else {
                                                                                                                                                        await mutate()
                                                                                                                                                        await swal({
                                                                                                                                                            title: 'خطأ!',
                                                                                                                                                            text: res.data.mess,
                                                                                                                                                            icon: "error",
                                                                                                                                                            button: false,
                                                                                                                                                            timer: 2000,
                                                                                                                                                        });
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                            }
                                                                                                                                        });
                                                                                                                                        }}>
                                                                                                                                        <FontAwesomeIcon style={{
                                                                                                                                            fontSize: "24px",
                                                                                                                                            color: "#e69695",
                                                                                                                                        }} icon={faBan} />
                                                                                                                                    </span>
                                                                                                                        }
                                                                                                                        {
                                                                                                                            permissions.deleteComment.status &&
                                                                                                                            <span onClick={() => {
                                                                                                                                swal({
                                                                                                                                    title: 'هل أنت متأكد؟',
                                                                                                                                    text: `هل أنت متأكد من أنك تريد حذف تعليق [${data.user.name}]`,
                                                                                                                                    icon: 'warning',
                                                                                                                                    buttons: {
                                                                                                                                        cancel: {
                                                                                                                                            text: 'إلغاء',
                                                                                                                                            value: null,
                                                                                                                                            visible: true,
                                                                                                                                            className: '',
                                                                                                                                            closeModal: true,
                                                                                                                                        },
                                                                                                                                        confirm: {
                                                                                                                                            text: 'موافق',
                                                                                                                                            value: true,
                                                                                                                                            visible: true,
                                                                                                                                            className: '',
                                                                                                                                            closeModal: true
                                                                                                                                        },
                                                                                                                                    },
                                                                                                                                    dangerMode: true,
                                                                                                                                }).then((willDelete) => {
                                                                                                                                    if (willDelete) {
                                                                                                                                        axios.delete(`/posts/comments/delete?id=${data._id}`)
                                                                                                                                            .then( async (res) => {
                                                                                                                                                if(res.status === 201 ){
                                                                                                                                                    await mutate()
                                                                                                                                                    await swal({
                                                                                                                                                        title: 'تم!',
                                                                                                                                                        text: res.data.mess,
                                                                                                                                                        icon: "success",
                                                                                                                                                        button: false,
                                                                                                                                                        timer: 2000,
                                                                                                                                                    });
                                                                                                                                                }else {
                                                                                                                                                    await mutate()
                                                                                                                                                    await swal({
                                                                                                                                                        title: 'خطأ!',
                                                                                                                                                        text: res.data.mess,
                                                                                                                                                        icon: "error",
                                                                                                                                                        button: false,
                                                                                                                                                        timer: 2000,
                                                                                                                                                    });
                                                                                                                                                }
                                                                                                                                            })
                                                                                                                                    }
                                                                                                                                });
                                                                                                                            }}>
                                                                                                                  <svg
                                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                                      width={24}
                                                                                                                      height={24}
                                                                                                                      fill="none"
                                                                                                                  >
                                                                                                                    <path
                                                                                                                        fill="#FD8A8A"
                                                                                                                        fillOpacity={0.5}
                                                                                                                        d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                                        opacity={0.4}
                                                                                                                    />
                                                                                                                    <path
                                                                                                                        fill="#DC3535"
                                                                                                                        fillOpacity={0.5}
                                                                                                                        d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                                    />
                                                                                                                  </svg>
                                                                                                                </span>
                                                                                                                        }
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </div>
                                                                                                {
                                                                                                    isPaginate && data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                                                }
                                                                                            </>
                                                                                            : isReport
                                                                                                ? isEditReport
                                                                                                    ? <>
                                                                                                        <Close action={reportsActions.isEdit} />
                                                                                                        <FormUser session={session} clubs={listData.clubs} activityLists={listData.clubs} isAddReports={true} isEdit={true} />
                                                                                                    </>
                                                                                                    : isShowReport
                                                                                                        ? <>
                                                                                                            <Close isShow={true} action={reportsActions.isShow} />
                                                                                                            <Show isReport={true}/>
                                                                                                        </>
                                                                                                        : <>
                                                                                                            <div className={Styles.index}>
                                                                                                                <table className={Styles.table}>
                                                                                                                    <thead>
                                                                                                                    <tr>
                                                                                                                        {
                                                                                                                            headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                                                        }
                                                                                                                    </tr>
                                                                                                                    </thead>
                                                                                                                    <tbody>
                                                                                                                    {
                                                                                                                        data.docs.map((data, key) =>
                                                                                                                                <tr key={key}>
                                                                                                                                    <td>{data.activity.title.length >= 25 ? data.activity.title.slice(0, 25) + '...' : data.activity.title}</td>
                                                                                                                                    <td>{data.club.name}</td>
                                                                                                                                    <td>{data.numbers}</td>
                                                                                                                                    <td>{data.activity.location.name}</td>
                                                                                                                                    <td>{data.createdAt.split('T')[0]}</td>
                                                                                                                                    <td>{data.activity.status}</td>
                                                                                                                                    <td>
                                                                                                                                        {
                                                                                                                                            permissions.editReport.status &&
                                                                                                                                            <span onClick={() => {
                                                                                                                                                axios.get('/reports/get').then(res => {
                                                                                                                                                    setListData(res.data)
                                                                                                                                                });
                                                                                                                                                dispatch(reportsActions.isEdit(true))
                                                                                                                                                dispatch(reportsActions.edit({
                                                                                                                                                    id: data._id,
                                                                                                                                                    summary: data.summary,
                                                                                                                                                    notes: data.notes,
                                                                                                                                                    numbers: data.numbers,
                                                                                                                                                    images: data.images,
                                                                                                                                                    club: data.club._id,
                                                                                                                                                    activity: data.activity._id,
                                                                                                                                                    user: data.user._id,
                                                                                                                                                }))
                                                                                                                                            }}>
                                                                                                                          <svg
                                                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                                                              width={24}
                                                                                                                              height={24}
                                                                                                                              fill="none"
                                                                                                                          >
                                                                                                                            <path
                                                                                                                                fill="#fff"
                                                                                                                                d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                                                opacity={0.4}
                                                                                                                            />
                                                                                                                            <path
                                                                                                                                fill="#000"
                                                                                                                                d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                                            />
                                                                                                                            <path
                                                                                                                                fill="#000"
                                                                                                                                d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                                                opacity={0.4}
                                                                                                                            />
                                                                                                                          </svg>
                                                                                                                    </span>
                                                                                                                                        }
                                                                                                                                        {
                                                                                                                                            permissions.showReport.status &&
                                                                                                                                            <span onClick={event => {
                                                                                                                                                dispatch(reportsActions.isShow(true))
                                                                                                                                                dispatch(reportsActions.show({
                                                                                                                                                    summary: data.summary,
                                                                                                                                                    notes: data.notes,
                                                                                                                                                    numbers: data.numbers,
                                                                                                                                                    images: data.images,
                                                                                                                                                    club: data.club.name,
                                                                                                                                                    activity: data.activity.title,
                                                                                                                                                    user: {
                                                                                                                                                        name: data.user.name,
                                                                                                                                                        avatar: data.user.avatar
                                                                                                                                                    },
                                                                                                                                                    createdAt: data.createdAt.split('T')[0],
                                                                                                                                                }))
                                                                                                                                            }}>
                                                                                                                        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" fill-rule="evenodd" clip-rule="evenodd" d="M17.737 6.046c1.707 1.318 3.16 3.249 4.205 5.663a.729.729 0 010 .572C19.854 17.111 16.137 20 12 20h-.01c-4.127 0-7.844-2.89-9.931-7.719a.728.728 0 010-.572C4.146 6.88 7.863 4 11.99 4H12c2.068 0 4.03.718 5.737 2.046zM8.097 12c0 2.133 1.747 3.87 3.903 3.87 2.146 0 3.893-1.737 3.893-3.87A3.888 3.888 0 0012 8.121c-2.156 0-3.902 1.736-3.902 3.879z" fill="#000" fill-opacity=".5"/><path d="M14.43 11.997a2.428 2.428 0 01-2.428 2.414c-1.347 0-2.44-1.086-2.44-2.414 0-.165.02-.32.05-.474h.048a1.997 1.997 0 002-1.921c.107-.019.225-.03.342-.03a2.43 2.43 0 012.429 2.425z" fill="#000" fill-opacity=".5"/></svg>
                                                                                                                    </span>
                                                                                                                                        }
                                                                                                                                        {
                                                                                                                                            permissions.deleteReport.status &&
                                                                                                                                            <span onClick={() => {
                                                                                                                                                swal({
                                                                                                                                                    title: 'هل أنت متأكد؟',
                                                                                                                                                    text: `هل أنت متأكد من أنك تريد حذف تقرير فعالية [${data.activity.title}]`,
                                                                                                                                                    icon: 'warning',
                                                                                                                                                    buttons: {
                                                                                                                                                        cancel: {
                                                                                                                                                            text: 'إلغاء',
                                                                                                                                                            value: null,
                                                                                                                                                            visible: true,
                                                                                                                                                            className: '',
                                                                                                                                                            closeModal: true,
                                                                                                                                                        },
                                                                                                                                                        confirm: {
                                                                                                                                                            text: 'موافق',
                                                                                                                                                            value: true,
                                                                                                                                                            visible: true,
                                                                                                                                                            className: '',
                                                                                                                                                            closeModal: true
                                                                                                                                                        },
                                                                                                                                                    },
                                                                                                                                                    dangerMode: true,
                                                                                                                                                }).then((willDelete) => {
                                                                                                                                                    if (willDelete) {
                                                                                                                                                        axios.delete(`/reports/delete?id=${data._id}`)
                                                                                                                                                            .then( async (res) => {
                                                                                                                                                                if(res.status === 201 ){
                                                                                                                                                                    await swal({
                                                                                                                                                                        title: 'تم!',
                                                                                                                                                                        text: res.data.mess,
                                                                                                                                                                        icon: "success",
                                                                                                                                                                        button: false,
                                                                                                                                                                        timer: 2000,
                                                                                                                                                                    });
                                                                                                                                                                }else {
                                                                                                                                                                    await swal({
                                                                                                                                                                        title: 'خطأ!',
                                                                                                                                                                        text: res.data.mess,
                                                                                                                                                                        icon: "error",
                                                                                                                                                                        button: false,
                                                                                                                                                                        timer: 2000,
                                                                                                                                                                    });
                                                                                                                                                                }
                                                                                                                                                            })
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                            }}>
                                                                                                                  <svg
                                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                                      width={24}
                                                                                                                      height={24}
                                                                                                                      fill="none"
                                                                                                                  >
                                                                                                                    <path
                                                                                                                        fill="#FD8A8A"
                                                                                                                        fillOpacity={0.5}
                                                                                                                        d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                                        opacity={0.4}
                                                                                                                    />
                                                                                                                    <path
                                                                                                                        fill="#DC3535"
                                                                                                                        fillOpacity={0.5}
                                                                                                                        d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                                    />
                                                                                                                  </svg>
                                                                                                                </span>
                                                                                                                                        }
                                                                                                                                    </td>
                                                                                                                                </tr>
                                                                                                                        )
                                                                                                                    }
                                                                                                                    </tbody>
                                                                                                                </table>
                                                                                                            </div>
                                                                                                            {
                                                                                                                isPaginate && data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                                                            }
                                                                                                        </>
                                                                                                : isToDay
                                                                                                    ? <div className={Styles.index}>
                                                                                                        <table className={Styles.table}>
                                                                                                            <thead>
                                                                                                            <tr>
                                                                                                                {
                                                                                                                    headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                                                }
                                                                                                            </tr>
                                                                                                            </thead>
                                                                                                            <tbody>
                                                                                                            {
                                                                                                                data.docs.map((data, key) =>
                                                                                                                        <tr key={key}>
                                                                                                                            <td>{data.title.length >= 25 ? data.title.slice(0, 25) + '...' : data.title}</td>
                                                                                                                            <td>{data.club.name}</td>
                                                                                                                            <td>{data.from}</td>
                                                                                                                            <td>{data.to}</td>
                                                                                                                            <td>{getDate(data.date)}</td>
                                                                                                                            <td>{data.date.split('T')[0]}</td>
                                                                                                                        </tr>
                                                                                                                )
                                                                                                            }
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </div>
                                                                                                    : isDesign
                                                                                                        ? isEditDesign
                                                                                                            ? <>
                                                                                                                <Close action={designsActions.isEdit} />
                                                                                                                <FormUser session={session} isAddDesign={true} isEdit={true} />
                                                                                                            </>
                                                                                                            : <>
                                                                                                                <div className={Styles.index}>
                                                                                                                    <table className={Styles.table}>
                                                                                                                        <thead>
                                                                                                                        <tr>
                                                                                                                            {
                                                                                                                                headers.map((header, key) => header !== null && <th key={key}>{header}</th>)
                                                                                                                            }
                                                                                                                        </tr>
                                                                                                                        </thead>
                                                                                                                        <tbody>
                                                                                                                        {
                                                                                                                            data.docs.map((data, key) =>
                                                                                                                                    <tr key={key}>
                                                                                                                                        <td>{data.activity.title.length >= 25 ? data.activity.title.slice(0, 25) + '...' : data.activity.title}</td>
                                                                                                                                        <td>{data.club.name}</td>
                                                                                                                                        <td>{data.activity.from}</td>
                                                                                                                                        <td>{data.activity.to}</td>
                                                                                                                                        <td>{data.activity.type.name}</td>
                                                                                                                                        <td>{getDate(data.activity.date)}</td>
                                                                                                                                        <td>{data.activity.date.split('T')[0]}</td>
                                                                                                                                        <td>{data.activity.status}</td>
                                                                                                                                        <td>{getStatusDesign(data.status)}</td>
                                                                                                                                        {
                                                                                                                                            permissions.editDesign.status || permissions.deleteDesign.status
                                                                                                                                                ? <td>
                                                                                                                                                    {
                                                                                                                                                        permissions.editDesign.status &&
                                                                                                                                                        <span onClick={() => {
                                                                                                                                                            dispatch(designsActions.isEdit(true))
                                                                                                                                                            dispatch(designsActions.edit({
                                                                                                                                                                id: data._id,
                                                                                                                                                                club: data.club._id,
                                                                                                                                                                activity: data.activity._id,
                                                                                                                                                                status: data.status,
                                                                                                                                                                notes: data.notes,
                                                                                                                                                            }))
                                                                                                                                                        }}>
                                                                                                                                                      <svg
                                                                                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                          width={24}
                                                                                                                                                          height={24}
                                                                                                                                                          fill="none"
                                                                                                                                                      >
                                                                                                                                                        <path
                                                                                                                                                            fill="#fff"
                                                                                                                                                            d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                                                                            opacity={0.4}
                                                                                                                                                        />
                                                                                                                                                        <path
                                                                                                                                                            fill="#000"
                                                                                                                                                            d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                                                                        />
                                                                                                                                                        <path
                                                                                                                                                            fill="#000"
                                                                                                                                                            d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                                                                            opacity={0.4}
                                                                                                                                                        />
                                                                                                                                                      </svg>
                                                                                                                                            </span>
                                                                                                                                                    }
                                                                                                                                                    {
                                                                                                                                                        permissions.deleteDesign.status &&
                                                                                                                                                        <span onClick={() => {
                                                                                                                                                            swal({
                                                                                                                                                                title: 'هل أنت متأكد؟',
                                                                                                                                                                text: `هل أنت متأكد من أنك تريد حذف تصميم الفعالية [${data.activity.title}]`,
                                                                                                                                                                icon: 'warning',
                                                                                                                                                                buttons: {
                                                                                                                                                                    cancel: {
                                                                                                                                                                        text: 'إلغاء',
                                                                                                                                                                        value: null,
                                                                                                                                                                        visible: true,
                                                                                                                                                                        className: '',
                                                                                                                                                                        closeModal: true,
                                                                                                                                                                    },
                                                                                                                                                                    confirm: {
                                                                                                                                                                        text: 'موافق',
                                                                                                                                                                        value: true,
                                                                                                                                                                        visible: true,
                                                                                                                                                                        className: '',
                                                                                                                                                                        closeModal: true
                                                                                                                                                                    },
                                                                                                                                                                },
                                                                                                                                                                dangerMode: true,
                                                                                                                                                            }).then((willDelete) => {
                                                                                                                                                                if (willDelete) {
                                                                                                                                                                    axios.delete(`/designs/delete?id=${data._id}`)
                                                                                                                                                                        .then( async (res) => {
                                                                                                                                                                            if(res.status === 201 ){
                                                                                                                                                                                await swal({
                                                                                                                                                                                    title: 'تم!',
                                                                                                                                                                                    text: res.data.mess,
                                                                                                                                                                                    icon: "success",
                                                                                                                                                                                    button: false,
                                                                                                                                                                                    timer: 2000,
                                                                                                                                                                                });
                                                                                                                                                                            }else {
                                                                                                                                                                                await swal({
                                                                                                                                                                                    title: 'خطأ!',
                                                                                                                                                                                    text: res.data.mess,
                                                                                                                                                                                    icon: "error",
                                                                                                                                                                                    button: false,
                                                                                                                                                                                    timer: 2000,
                                                                                                                                                                                });
                                                                                                                                                                            }
                                                                                                                                                                        })
                                                                                                                                                                }
                                                                                                                                                            });
                                                                                                                                                        }}>
                                                                                                                                              <svg
                                                                                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                  width={24}
                                                                                                                                                  height={24}
                                                                                                                                                  fill="none"
                                                                                                                                              >
                                                                                                                                                <path
                                                                                                                                                    fill="#FD8A8A"
                                                                                                                                                    fillOpacity={0.5}
                                                                                                                                                    d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                                                                    opacity={0.4}
                                                                                                                                                />
                                                                                                                                                <path
                                                                                                                                                    fill="#DC3535"
                                                                                                                                                    fillOpacity={0.5}
                                                                                                                                                    d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                                                                />
                                                                                                                                              </svg>
                                                                                                                                            </span>
                                                                                                                                                    }
                                                                                                                                                </td>
                                                                                                                                                : null
                                                                                                                                        }
                                                                                                                                    </tr>
                                                                                                                            )
                                                                                                                        }
                                                                                                                        </tbody>
                                                                                                                    </table>
                                                                                                                </div>
                                                                                                                {
                                                                                                                    isPaginate && data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                                                                }
                                                                                                            </>
                                                                                                        : isDiscourse
                                                                                                            ? isEditDiscourse
                                                                                                                ? <>
                                                                                                                    <Close action={discoursesActions.isEdit} />
                                                                                                                    <FormUser session={session} isAddDiscourses={true} isEdit={true} />
                                                                                                                </>
                                                                                                                : isShowDiscourse
                                                                                                                    ? <>
                                                                                                                        <Close isShow={true} action={discoursesActions.isShow} />
                                                                                                                        <Show isDiscourse={true}/>
                                                                                                                    </>
                                                                                                                    : <>
                                                                                                                        <div className={Styles.index}>
                                                                                                                            <table className={Styles.table}>
                                                                                                                                <thead>
                                                                                                                                <tr>
                                                                                                                                    {
                                                                                                                                        headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                                                                    }
                                                                                                                                </tr>
                                                                                                                                </thead>
                                                                                                                                <tbody>
                                                                                                                                {
                                                                                                                                    data.docs.map((data, key) =>
                                                                                                                                            <tr key={key}>
                                                                                                                                                <td>{data.activity.title.length >= 25 ? data.activity.title.slice(0, 25) + '...' : data.activity.title}</td>
                                                                                                                                                <td>{data.club.name}</td>
                                                                                                                                                <td>{data.side}</td>
                                                                                                                                                <td>{getDate(data.activity.date)}</td>
                                                                                                                                                <td>{data.activity.date.split('T')[0]}</td>
                                                                                                                                                <td>{data.activity.status}</td>
                                                                                                                                                <td>{getStatusDiscourse(data.status)}</td>
                                                                                                                                                <td>
                                                                                                                                                    {
                                                                                                                                                        permissions.editDiscourse.status &&
                                                                                                                                                        <span onClick={() => {
                                                                                                                                                            dispatch(discoursesActions.isEdit(true))
                                                                                                                                                            dispatch(discoursesActions.edit({
                                                                                                                                                                id: data._id,
                                                                                                                                                                club: data.club._id,
                                                                                                                                                                activity: data.activity._id,
                                                                                                                                                                status: data.status,
                                                                                                                                                                name: data.name,
                                                                                                                                                                numbers: data.numbers,
                                                                                                                                                                side: data.side,
                                                                                                                                                                surname: data.surname,
                                                                                                                                                                notes: data.notes,
                                                                                                                                                            }))
                                                                                                                                                        }}>
                                                                                                                                                          <svg
                                                                                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                              width={24}
                                                                                                                                                              height={24}
                                                                                                                                                              fill="none"
                                                                                                                                                          >
                                                                                                                                                            <path
                                                                                                                                                                fill="#fff"
                                                                                                                                                                d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                                                                                opacity={0.4}
                                                                                                                                                            />
                                                                                                                                                            <path
                                                                                                                                                                fill="#000"
                                                                                                                                                                d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                                                                            />
                                                                                                                                                            <path
                                                                                                                                                                fill="#000"
                                                                                                                                                                d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                                                                                opacity={0.4}
                                                                                                                                                            />
                                                                                                                                                          </svg>
                                                                                                                                                </span>
                                                                                                                                                    }
                                                                                                                                                    {
                                                                                                                                                        permissions.showDiscourse.status &&
                                                                                                                                                        <span onClick={event => {
                                                                                                                                                            dispatch(discoursesActions.isShow(true))
                                                                                                                                                            dispatch(discoursesActions.show({
                                                                                                                                                                club: data.club.name,
                                                                                                                                                                type: data.activity.type.name,
                                                                                                                                                                title: data.activity.title,
                                                                                                                                                                presenter: data.activity.presenter,
                                                                                                                                                                notesActivity: data.activity.notes,
                                                                                                                                                                status: data.status,
                                                                                                                                                                name: data.name,
                                                                                                                                                                numbers: data.numbers,
                                                                                                                                                                side: data.side,
                                                                                                                                                                surname: data.surname,
                                                                                                                                                                notes: data.notes,
                                                                                                                                                                statusActivity: data.activity.status,
                                                                                                                                                                date: data.activity.date.split('T')[0],
                                                                                                                                                                from: data.activity.from,
                                                                                                                                                                to: data.activity.to,
                                                                                                                                                                hospitality: data.activity.hospitality == true ? 'نعم' : 'لا',
                                                                                                                                                                isShare: data.activity.isShare == true ? 'نعم' : 'لا',
                                                                                                                                                                projector: data.activity.projector == true ? 'نعم' : 'لا',
                                                                                                                                                                location: data.activity.location.name
                                                                                                                                                            }))
                                                                                                                                                        }}>
                                                                                                                                                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" fill-rule="evenodd" clip-rule="evenodd" d="M17.737 6.046c1.707 1.318 3.16 3.249 4.205 5.663a.729.729 0 010 .572C19.854 17.111 16.137 20 12 20h-.01c-4.127 0-7.844-2.89-9.931-7.719a.728.728 0 010-.572C4.146 6.88 7.863 4 11.99 4H12c2.068 0 4.03.718 5.737 2.046zM8.097 12c0 2.133 1.747 3.87 3.903 3.87 2.146 0 3.893-1.737 3.893-3.87A3.888 3.888 0 0012 8.121c-2.156 0-3.902 1.736-3.902 3.879z" fill="#000" fill-opacity=".5"/><path d="M14.43 11.997a2.428 2.428 0 01-2.428 2.414c-1.347 0-2.44-1.086-2.44-2.414 0-.165.02-.32.05-.474h.048a1.997 1.997 0 002-1.921c.107-.019.225-.03.342-.03a2.43 2.43 0 012.429 2.425z" fill="#000" fill-opacity=".5"/></svg>
                                                                                                                                                        </span>
                                                                                                                                                    }
                                                                                                                                                    {
                                                                                                                                                        permissions.deleteDiscourse.status &&
                                                                                                                                                        <span onClick={() => {
                                                                                                                                                            swal({
                                                                                                                                                                title: 'هل أنت متأكد؟',
                                                                                                                                                                text: `هل أنت متأكد من أنك تريد حذف خطاب الفعالية [${data.activity.title}]`,
                                                                                                                                                                icon: 'warning',
                                                                                                                                                                buttons: {
                                                                                                                                                                    cancel: {
                                                                                                                                                                        text: 'إلغاء',
                                                                                                                                                                        value: null,
                                                                                                                                                                        visible: true,
                                                                                                                                                                        className: '',
                                                                                                                                                                        closeModal: true,
                                                                                                                                                                    },
                                                                                                                                                                    confirm: {
                                                                                                                                                                        text: 'موافق',
                                                                                                                                                                        value: true,
                                                                                                                                                                        visible: true,
                                                                                                                                                                        className: '',
                                                                                                                                                                        closeModal: true
                                                                                                                                                                    },
                                                                                                                                                                },
                                                                                                                                                                dangerMode: true,
                                                                                                                                                            }).then((willDelete) => {
                                                                                                                                                                if (willDelete) {
                                                                                                                                                                    axios.delete(`/discourses/delete?id=${data._id}`)
                                                                                                                                                                        .then( async (res) => {
                                                                                                                                                                            if(res.status === 201 ){
                                                                                                                                                                                await swal({
                                                                                                                                                                                    title: 'تم!',
                                                                                                                                                                                    text: res.data.mess,
                                                                                                                                                                                    icon: "success",
                                                                                                                                                                                    button: false,
                                                                                                                                                                                    timer: 2000,
                                                                                                                                                                                });
                                                                                                                                                                            }else {
                                                                                                                                                                                await swal({
                                                                                                                                                                                    title: 'خطأ!',
                                                                                                                                                                                    text: res.data.mess,
                                                                                                                                                                                    icon: "error",
                                                                                                                                                                                    button: false,
                                                                                                                                                                                    timer: 2000,
                                                                                                                                                                                });
                                                                                                                                                                            }
                                                                                                                                                                        })
                                                                                                                                                                }
                                                                                                                                                            });
                                                                                                                                                        }}>
                                                                                                                                                      <svg
                                                                                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                          width={24}
                                                                                                                                                          height={24}
                                                                                                                                                          fill="none"
                                                                                                                                                      >
                                                                                                                                                        <path
                                                                                                                                                            fill="#FD8A8A"
                                                                                                                                                            fillOpacity={0.5}
                                                                                                                                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                                                                            opacity={0.4}
                                                                                                                                                        />
                                                                                                                                                        <path
                                                                                                                                                            fill="#DC3535"
                                                                                                                                                            fillOpacity={0.5}
                                                                                                                                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                                                                        />
                                                                                                                                                      </svg>
                                                                                                                                                    </span>
                                                                                                                                                    }
                                                                                                                                                </td>
                                                                                                                                            </tr>
                                                                                                                                    )
                                                                                                                                }
                                                                                                                                </tbody>
                                                                                                                            </table>
                                                                                                                        </div>
                                                                                                                        {
                                                                                                                            isPaginate && data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                                                                        }
                                                                                                                    </>
                                                                                                            : isCertificate
                                                                                                                ? isShowCertificate
                                                                                                                    ? <>
                                                                                                                        <Close isShow={true} action={certificatesAndActivitiesActions.isShow} />
                                                                                                                        <Show isCertificate={true}/>
                                                                                                                    </>
                                                                                                                    : <>
                                                                                                                        <div className={Styles.index}>
                                                                                                                            <table className={Styles.table}>
                                                                                                                                <thead>
                                                                                                                                <tr>
                                                                                                                                    {
                                                                                                                                        headers.map((header, key) => header !== "null" && <th key={key}>{header}</th>)
                                                                                                                                    }
                                                                                                                                </tr>
                                                                                                                                </thead>
                                                                                                                                <tbody>
                                                                                                                                {
                                                                                                                                    data.docs.map((data, key) =>
                                                                                                                                            <tr key={key}>
                                                                                                                                                <td>{!isShowUser ? data.user.name : data.certificateActivityId.activityId.title.length >= 15 ? data.certificateActivityId.activityId.title.slice(0, 15) + "..." : data.certificateActivityId.activityId.title}</td>
                                                                                                                                                <td>{data.user.username}</td>
                                                                                                                                                <td>{data.user.country.name}</td>
                                                                                                                                                <td>{awardClubName == null ? data.certificateActivityId.activityId.club.name : awardClubName}</td>
                                                                                                                                                {
                                                                                                                                                    permissions.downloadCertificate.status
                                                                                                                                                        ? <td>
                                                                                                                                                            {
                                                                                                                                                                permissions.downloadCertificate.status
                                                                                                                                                                    ? <a href={`/uploads/files/${data.image}`} download>
                                                                                                                                                                        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" d="M18.809 9.021c-.452 0-1.05-.01-1.794-.01-1.816 0-3.31-1.503-3.31-3.336V2.459A.456.456 0 0013.253 2H7.964C5.496 2 3.5 4.026 3.5 6.509v10.775C3.5 19.889 5.591 22 8.17 22h7.876c2.46 0 4.454-2.013 4.454-4.498V9.471a.454.454 0 00-.453-.458c-.423.003-.93.008-1.238.008z" fill="#000" fill-opacity=".5"></path><path opacity=".4" d="M16.084 2.567a.477.477 0 00-.82.334v2.637c0 1.106.91 2.016 2.015 2.016.698.008 1.666.01 2.488.008a.477.477 0 00.343-.808l-4.026-4.187z" fill="#000" fill-opacity=".5"></path><path d="M15.105 12.709a.745.745 0 00-1.054.002l-1.589 1.597V9.48a.746.746 0 00-1.49 0v4.827l-1.59-1.597a.744.744 0 10-1.056 1.05l2.863 2.877h.001a.745.745 0 001.053 0h.002l2.862-2.876a.744.744 0 00-.002-1.053z" fill="#000" fill-opacity=".5"></path></svg>
                                                                                                                                                                    </a>
                                                                                                                                                                    : null
                                                                                                                                                            }
                                                                                                                                                            {
                                                                                                                                                                isFull
                                                                                                                                                                    ? null
                                                                                                                                                                    : <>
                                                                                                                                                                        {
                                                                                                                                                                            permissions.showCertificate.status
                                                                                                                                                                                ? !isShowUser &&
                                                                                                                                                                                <span onClick={event => {
                                                                                                                                                                                    router.push(`/certificates/${router.query.certificateId}/student?studentId=${data.user._id}&name=${data.user.name}`)
                                                                                                                                                                                }}>
                                                                                                                                                                                    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" fill-rule="evenodd" clip-rule="evenodd" d="M17.737 6.046c1.707 1.318 3.16 3.249 4.205 5.663a.729.729 0 010 .572C19.854 17.111 16.137 20 12 20h-.01c-4.127 0-7.844-2.89-9.931-7.719a.728.728 0 010-.572C4.146 6.88 7.863 4 11.99 4H12c2.068 0 4.03.718 5.737 2.046zM8.097 12c0 2.133 1.747 3.87 3.903 3.87 2.146 0 3.893-1.737 3.893-3.87A3.888 3.888 0 0012 8.121c-2.156 0-3.902 1.736-3.902 3.879z" fill="#000" fill-opacity=".5"/><path d="M14.43 11.997a2.428 2.428 0 01-2.428 2.414c-1.347 0-2.44-1.086-2.44-2.414 0-.165.02-.32.05-.474h.048a1.997 1.997 0 002-1.921c.107-.019.225-.03.342-.03a2.43 2.43 0 012.429 2.425z" fill="#000" fill-opacity=".5"/></svg>
                                                                                                                                                                                </span>
                                                                                                                                                                                : null
                                                                                                                                                                        }
                                                                                                                                                                        {
                                                                                                                                                                            permissions.deleteCertificate.status
                                                                                                                                                                                ?
                                                                                                                                                                                <span onClick={() => {
                                                                                                                                                                                    swal({
                                                                                                                                                                                        title: 'هل أنت متأكد؟',
                                                                                                                                                                                        text: `هل أنت متأكد من أنك تريد حذف شهادة الطالب [${data.user.name}]`,
                                                                                                                                                                                        icon: 'warning',
                                                                                                                                                                                        buttons: {
                                                                                                                                                                                            cancel: {
                                                                                                                                                                                                text: 'إلغاء',
                                                                                                                                                                                                value: null,
                                                                                                                                                                                                visible: true,
                                                                                                                                                                                                className: '',
                                                                                                                                                                                                closeModal: true,
                                                                                                                                                                                            },
                                                                                                                                                                                            confirm: {
                                                                                                                                                                                                text: 'موافق',
                                                                                                                                                                                                value: true,
                                                                                                                                                                                                visible: true,
                                                                                                                                                                                                className: '',
                                                                                                                                                                                                closeModal: true
                                                                                                                                                                                            },
                                                                                                                                                                                        },
                                                                                                                                                                                        dangerMode: true,
                                                                                                                                                                                    }).then((willDelete) => {
                                                                                                                                                                                        if (willDelete) {
                                                                                                                                                                                            axios.delete(`/certificates/show/delete?id=${data._id}`)
                                                                                                                                                                                                .then( async (res) => {
                                                                                                                                                                                                    if(res.status === 201 ){
                                                                                                                                                                                                        await swal({
                                                                                                                                                                                                            title: 'تم!',
                                                                                                                                                                                                            text: res.data.mess,
                                                                                                                                                                                                            icon: "success",
                                                                                                                                                                                                            button: false,
                                                                                                                                                                                                            timer: 2000,
                                                                                                                                                                                                        });
                                                                                                                                                                                                    }else {
                                                                                                                                                                                                        await swal({
                                                                                                                                                                                                            title: 'خطأ!',
                                                                                                                                                                                                            text: res.data.mess,
                                                                                                                                                                                                            icon: "error",
                                                                                                                                                                                                            button: false,
                                                                                                                                                                                                            timer: 2000,
                                                                                                                                                                                                        });
                                                                                                                                                                                                    }
                                                                                                                                                                                                })
                                                                                                                                                                                        }
                                                                                                                                                                                    });
                                                                                                                                                                                }}>
                                                                                                                                                                                          <svg
                                                                                                                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                                                              width={24}
                                                                                                                                                                                              height={24}
                                                                                                                                                                                              fill="none"
                                                                                                                                                                                          >
                                                                                                                                                                                            <path
                                                                                                                                                                                                fill="#FD8A8A"
                                                                                                                                                                                                fillOpacity={0.5}
                                                                                                                                                                                                d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                                                                                                                opacity={0.4}
                                                                                                                                                                                            />
                                                                                                                                                                                            <path
                                                                                                                                                                                                fill="#DC3535"
                                                                                                                                                                                                fillOpacity={0.5}
                                                                                                                                                                                                d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                                                                                                            />
                                                                                                                                                                                          </svg>
                                                                                                                                                                                        </span>
                                                                                                                                                                                : null
                                                                                                                                                                        }
                                                                                                                                                                    </>
                                                                                                                                                            }
                                                                                                                                                        </td>
                                                                                                                                                        : null
                                                                                                                                                }
                                                                                                                                            </tr>
                                                                                                                                    )
                                                                                                                                }
                                                                                                                                </tbody>
                                                                                                                            </table>
                                                                                                                        </div>
                                                                                                                        {
                                                                                                                            isPaginate && data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                                                                        }
                                                                                                                    </>
                                                                                                                : isResults
                                                                                                                    ? isEditResult
                                                                                                                        ? <>
                                                                                                                            <Close action={resultsActions.isEdit} />
                                                                                                                            <FormAdd isResult={true} clubs={listData.clubs} yearsLis={listData.years} isEdit={true} />
                                                                                                                        </>
                                                                                                                        : <>
                                                                                                                            <div className={Styles.index}>
                                                                                                                                <table className={Styles.table}>
                                                                                                                                    <thead>
                                                                                                                                    <tr>
                                                                                                                                        {
                                                                                                                                            headers.map((header, key) => <th key={key}>{header}</th>)
                                                                                                                                        }
                                                                                                                                    </tr>
                                                                                                                                    </thead>
                                                                                                                                    <tbody>
                                                                                                                                    {
                                                                                                                                        data.docs.map((data, key) =>
                                                                                                                                                <tr key={key}>
                                                                                                                                                    <td>{data.number}</td>
                                                                                                                                                    <td>{data.club.name}</td>
                                                                                                                                                    <td>
                                                                                                                                                        <Image src={`/uploads/files/${data.club.avatar}`} alt={'avatar of club'} width={100} height={100}/>
                                                                                                                                                    </td>
                                                                                                                                                    <td>{data.name}</td>
                                                                                                                                                    <td>{data.result}</td>
                                                                                                                                                    <td>{data.year.nameH} - {data.year.nameM}</td>
                                                                                                                                                    <td>
                                                                                                                                                        {
                                                                                                                                                            isAll
                                                                                                                                                                ? <span onClick={() => {router.push(`/clubs/${data.club.name.split(' ').join('-')}`)}}>
                                                                                                                                                                    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" fill-rule="evenodd" clip-rule="evenodd" d="M17.737 6.046c1.707 1.318 3.16 3.249 4.205 5.663a.729.729 0 010 .572C19.854 17.111 16.137 20 12 20h-.01c-4.127 0-7.844-2.89-9.931-7.719a.728.728 0 010-.572C4.146 6.88 7.863 4 11.99 4H12c2.068 0 4.03.718 5.737 2.046zM8.097 12c0 2.133 1.747 3.87 3.903 3.87 2.146 0 3.893-1.737 3.893-3.87A3.888 3.888 0 0012 8.121c-2.156 0-3.902 1.736-3.902 3.879z" fill="#000" fill-opacity=".5"/><path d="M14.43 11.997a2.428 2.428 0 01-2.428 2.414c-1.347 0-2.44-1.086-2.44-2.414 0-.165.02-.32.05-.474h.048a1.997 1.997 0 002-1.921c.107-.019.225-.03.342-.03a2.43 2.43 0 012.429 2.425z" fill="#000" fill-opacity=".5"/></svg>
                                                                                                                                                                </span>
                                                                                                                                                                : <>
                                                                                                                                                                    <span onClick={() => {
                                                                                                                                                                        axios.get(`/tools/results/get`).then(res => {
                                                                                                                                                                            setListData({
                                                                                                                                                                                clubs: res.data.clubs,
                                                                                                                                                                                years: res.data.years
                                                                                                                                                                            })
                                                                                                                                                                        })
                                                                                                                                                                        dispatch(resultsActions.isEdit(true))
                                                                                                                                                                        dispatch(resultsActions.edit({
                                                                                                                                                                            id: data._id,
                                                                                                                                                                            number: data.number,
                                                                                                                                                                            name: data.name,
                                                                                                                                                                            result: data.result,
                                                                                                                                                                            year: data.year._id,
                                                                                                                                                                            club: data.club._id,
                                                                                                                                                                        }))
                                                                                                                                                                    }}>
                                                                                                                                                                          <svg
                                                                                                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                                              width={24}
                                                                                                                                                                              height={24}
                                                                                                                                                                              fill="none"
                                                                                                                                                                          >
                                                                                                                                                                            <path
                                                                                                                                                                                fill="#fff"
                                                                                                                                                                                d="M19.993 18.953h-5.695c-.555 0-1.007.46-1.007 1.024 0 .565.452 1.023 1.007 1.023h5.695c.555 0 1.007-.458 1.007-1.023s-.452-1.024-1.007-1.024z"
                                                                                                                                                                                opacity={0.4}
                                                                                                                                                                            />
                                                                                                                                                                            <path
                                                                                                                                                                                fill="#000"
                                                                                                                                                                                d="m10.309 6.904 5.396 4.36a.31.31 0 0 1 .05.429L9.36 20.028a2.1 2.1 0 0 1-1.63.817l-3.492.043a.398.398 0 0 1-.392-.312l-.793-3.45c-.138-.635 0-1.29.402-1.795l6.429-8.376a.3.3 0 0 1 .426-.051z"
                                                                                                                                                                            />
                                                                                                                                                                            <path
                                                                                                                                                                                fill="#000"
                                                                                                                                                                                d="m18.12 8.665-1.04 1.299a.298.298 0 0 1-.423.048c-1.265-1.023-4.503-3.65-5.401-4.377a.308.308 0 0 1-.043-.432l1.003-1.246c.91-1.172 2.497-1.28 3.777-.258l1.471 1.172c.604.473 1.006 1.096 1.143 1.752.16.721-.01 1.43-.486 2.042z"
                                                                                                                                                                                opacity={0.4}
                                                                                                                                                                            />
                                                                                                                                                                          </svg>
                                                                                                                                                                    </span>
                                                                                                                                                                    <span onClick={() => {
                                                                                                                                                                        swal({
                                                                                                                                                                            title: 'هل أنت متأكد؟',
                                                                                                                                                                            text: `هل أنت متأكد من أنك تريد حذف نتيجة النادي [${data.club.name}]`,
                                                                                                                                                                            icon: 'warning',
                                                                                                                                                                            buttons: {
                                                                                                                                                                                cancel: {
                                                                                                                                                                                    text: 'إلغاء',
                                                                                                                                                                                    value: null,
                                                                                                                                                                                    visible: true,
                                                                                                                                                                                    className: '',
                                                                                                                                                                                    closeModal: true,
                                                                                                                                                                                },
                                                                                                                                                                                confirm: {
                                                                                                                                                                                    text: 'موافق',
                                                                                                                                                                                    value: true,
                                                                                                                                                                                    visible: true,
                                                                                                                                                                                    className: '',
                                                                                                                                                                                    closeModal: true
                                                                                                                                                                                },
                                                                                                                                                                            },
                                                                                                                                                                            dangerMode: true,
                                                                                                                                                                        }).then((willDelete) => {
                                                                                                                                                                            if (willDelete) {
                                                                                                                                                                                axios.delete(`/tools/results/delete?id=${data._id}`)
                                                                                                                                                                                    .then( async (res) => {
                                                                                                                                                                                        if(res.status === 201 ){
                                                                                                                                                                                            await swal({
                                                                                                                                                                                                title: 'تم!',
                                                                                                                                                                                                text: res.data.mess,
                                                                                                                                                                                                icon: "success",
                                                                                                                                                                                                button: false,
                                                                                                                                                                                                timer: 2000,
                                                                                                                                                                                            });
                                                                                                                                                                                        }else {
                                                                                                                                                                                            await swal({
                                                                                                                                                                                                title: 'خطأ!',
                                                                                                                                                                                                text: res.data.mess,
                                                                                                                                                                                                icon: "error",
                                                                                                                                                                                                button: false,
                                                                                                                                                                                                timer: 2000,
                                                                                                                                                                                            });
                                                                                                                                                                                        }
                                                                                                                                                                                    })
                                                                                                                                                                            }
                                                                                                                                                                        });
                                                                                                                                                                    }}>
                                                                                                                                                          <svg
                                                                                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                              width={24}
                                                                                                                                                              height={24}
                                                                                                                                                              fill="none"
                                                                                                                                                          >
                                                                                                                                                            <path
                                                                                                                                                                fill="#FD8A8A"
                                                                                                                                                                fillOpacity={0.5}
                                                                                                                                                                d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                                                                                                                                                opacity={0.4}
                                                                                                                                                            />
                                                                                                                                                            <path
                                                                                                                                                                fill="#DC3535"
                                                                                                                                                                fillOpacity={0.5}
                                                                                                                                                                d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                                                                                                                                            />
                                                                                                                                                          </svg>
                                                                                                                                                        </span>
                                                                                                                                                                </>
                                                                                                                                                        }
                                                                                                                                                    </td>
                                                                                                                                                </tr>
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                            {
                                                                                                                                data.totalPages > 1 && <Pagination page={data.page} hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} nextPage={data.nextPage} prevPage={data.prevPage} />
                                                                                                                            }
                                                                                                                        </>
                                                                                                                    : null




            }
        </div>
    )
}
