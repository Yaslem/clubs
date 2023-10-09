import Styles from "../styles/FormUser.module.css";
import {useRouter} from "next/router";
import {useState} from "react";
import axios from "axios";
import {signIn, signOut} from "next-auth/react";
import swal from "sweetalert";
import {useDispatch, useSelector} from "react-redux";
import * as XLSX from "xlsx";
import {profilesActions} from "../redux/slices/profilesSlice";
import useDeviceSize from "../components/useDeviceSize";

export default (
    {
        session = [],
        isEdit = false,
        repeat = null,
        isAddUser = false,
        userId = false,
        isProfile = false,
        isAddAttend = false,
        isAddDesign = false,
        isAddDiscourses = false,
        isRegister = false,
        isEditPassword = false,
        isEditPasswordFromShow = false,
        isAddContact = false,
        isAddActivity = false,
        isAddPosts = false,
        isAddReports = false,
        countries = [],
        levels = [],
        activityLists = [],
        locations = [],
        dates = [],
        times = [],
        types = [],
        colleges = [],
        clubs = [],
    }) => {
    // router
    const router = useRouter()
    const dispatch = useDispatch()
 const [width, height] = useDeviceSize();
    // notes
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState()
    const isFile = useSelector(state => state.isFile.isFile)
    const [activitiesList, setActivitiesList] = useState([])

    // items
    const activities = useSelector(state => state.activities.edit)
    const posts = useSelector(state => state.posts.edit)
    const students = useSelector(state => state.students.edit)
    const reports = useSelector(state => state.reports.edit)
    const contacts = useSelector(state => state.contacts.edit)
    const designs = useSelector(state => state.designs.edit)
    const discourses = useSelector(state => state.discourses.edit)

    // fields users
    const [usersFile, setUsersFile] = useState('')
    const [name, setName] = useState(isAddUser && isEdit ? students.name : isProfile ? session.user.name : '')
    const [activity, setActivity] = useState(isAddReports && isEdit ? reports.activity : isAddDesign && isEdit ? designs.activity : '')
    const [summary, setSummary] = useState(isAddReports && isEdit ? reports.summary : '')
    const [numbers, setNumbers] = useState(isAddReports && isEdit ? reports.numbers : isAddDiscourses && isEdit ? discourses.numbers : '')
    const [images, setImages] = useState(isAddReports && isEdit ? reports.images : '')
    const [imagesChange, setImagesChange] = useState(false)
    const user = isAddPosts && isEdit ? posts.user : isAddContact && isEdit ? contacts.user : isAddReports && isEdit ? reports.user : isRegister ? null : session.user.id
    const [idCard, setIdCard] = useState(isAddUser && isEdit ? students.idNumber : isProfile ? session.user.idNumber : '')
    const [club, setClub] = useState(isAddActivity && isEdit ? activities.club : isAddUser && isEdit ? students.club : isAddPosts && isEdit ? posts.club : isAddContact && isEdit ? contacts.club : isAddReports && isEdit ? reports.club : isProfile ? session.user.club._id : isAddDesign && isEdit ? designs.club : '')
    const [email, setEmail] = useState(isAddUser && isEdit ? students.email : isProfile ? session.user.email : '')
    const [college, setCollege] = useState(isAddUser && isEdit ? students.college : isProfile ? session.user.college._id : '')
    const [level, setLevel] = useState(isAddUser && isEdit ? students.level : isProfile ? session.user.level._id : '')
    const [country, setCountry] = useState(isAddUser && isEdit ? students.country : isProfile ? session.user.country._id : '')
    const [whatsApp, setWhatsApp] = useState(isAddUser && isEdit ? students.whatsapp : isProfile ? session.user.whatsapp : '')
    const [type, setType] = useState(isAddActivity && isEdit ? activities.type : isAddUser && isEdit ? students.type : isAddContact && isEdit ? contacts.type : isProfile ? session.user.type : '')
    const [role, setRole] = useState(isAddUser && isEdit ? students.role : isProfile ? session.user.role : '')
    const [username, setUsername] = useState(isAddUser && isEdit ? students.username : isProfile ? session.user.username : '')
    const [password, setPassword] = useState('')
    const [passwordOld, setPasswordOld] = useState('')
    const [passwordConfirmation, setConfirmPassword] = useState('')

    // fields activities
    const [activitiesFile, setActivitiesFile] = useState('')
    const [postsFile, setPostsFile] = useState('')
    const [contactsFile, setContactsFile] = useState('')
    const [reportsFile, setReportsFile] = useState('')
    const [attendeesFile, setAttendeesFile] = useState('')
    const [title, setTitle] = useState(isAddActivity && isEdit ? activities.title : isAddPosts && isEdit ? posts.title : isAddContact && isEdit ? contacts.title : '')
    const [body, setBody] = useState(isAddPosts && isEdit ? posts.body : isAddContact && isEdit ? contacts.body : '')
    const [image, setImage] = useState(isAddContact && isEdit ? contacts.image : '')
    const [presenter, setPresenter] = useState(isAddActivity && isEdit ? activities.presenter : isAddDiscourses && isEdit ? discourses.name : '')
    const [side, setSide] = useState(isAddDiscourses && isEdit ? discourses.side : '')
    const [surname, setSurname] = useState(isAddDiscourses && isEdit ? discourses.surname : '')
    const [notes, setNotes] = useState(isAddActivity && isEdit ? activities.notes != "null" ? activities.notes : '' : isAddReports && isEdit ? reports.notes : isAddDesign && isEdit ? designs.notes : isAddDiscourses && isEdit ? discourses.notes : '')
    const [status, setStatus] = useState(isAddActivity && isEdit ? activities.status : isAddContact && isEdit ? contacts.status : isAddDesign && isEdit ? designs.status : isAddDiscourses && isEdit ? discourses.status : '')
    const [clubShare, setClubShare] = useState(isAddActivity && isEdit ? activities.clubShare : '')
    const [date, setDate] = useState(isAddActivity && isEdit ? activities.date : '')
    const [isDiscourse, setIsDiscourse] = useState(isAddActivity && isEdit ? activities.isDiscourse : '')
    const [isDesign, setIsDesign] = useState(isAddActivity && isEdit ? activities.isDesign : '')
    const [from, setFrom] = useState(isAddActivity && isEdit ? activities.from : '')
    const [to, setTo] = useState(isAddActivity && isEdit ? activities.to : '')
    const [hospitality, setHospitality] = useState(isAddActivity && isEdit ? activities.hospitality : '')
    const [isShare, setIsShare] = useState(isAddActivity && isEdit ? activities.isShare : '')
    const [projector, setProjector] = useState(isAddActivity && isEdit ? activities.projector : '')
    const [location, setLocation] = useState(isAddActivity && isEdit ? activities.location : '')

    // validation users
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [errorIdCard, setErrorIdCard] = useState('')
    const [errorClub, setErrorClub] = useState('')
    const [errorClubShare, setErrorClubShare] = useState('')
    const [errorRole, setErrorRole] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const [errorCollege, setErrorCollege] = useState('')
    const [errorLevel, setErrorLevel] = useState('')
    const [errorCountry, setErrorCountry] = useState('')
    const [errorWhatsApp, setErrorWhatsApp] = useState('')
    const [errorType, setErrorType] = useState('')
    const [errorName, setErrorName] = useState('')
    const [errorUsersFile, setErrorUsersFile] = useState('')
    const [errorUsername, setErrorUsername] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [errorPasswordOld, setErrorPasswordOld] = useState('')
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('')

    // validation Activities
    const [errorFile, setErrorFile] = useState('')
    const [errorActivityId, setErrorActivityId] = useState('')
    const [errorTitle, setErrorTitle] = useState('')
    const [errorUser, setErrorUser] = useState('')
    const [errorBody, setErrorBody] = useState('')
    const [errorSummary, setErrorSummary] = useState('')
    const [errorImage, setErrorImage] = useState('')
    const [errorNumber, setErrorNumber] = useState('')
    const [errorPresenter, setErrorPresenter] = useState('')
    const [errorSide, setErrorSide] = useState('')
    const [errorSurname, setErrorSurname] = useState('')
    const [errorNotes, setErrorNotes] = useState('')
    const [errorStatus, setErrorStatus] = useState('')
    const [errorDate, setErrorDate] = useState('')
    const [errorFrom, setErrorFrom] = useState('')
    const [errorTo, setErrorTo] = useState('')
    const [errorIsDiscourse, setErrorIsDiscourse] = useState('')
    const [errorIsDesign, setErrorIsDesign] = useState('')
    const [errorIsAttend, setErrorIsAttend] = useState('')
    const [errorHospitality, setErrorHospitality] = useState('')
    const [errorIsShare, setErrorIsShare] = useState('')
    const [errorProjector, setErrorProjector] = useState('')
    const [errorLocation, setErrorLocation] = useState('')

    function importExcel(eventFile) {
        setDone(false)
        const file = eventFile.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const bstr = event.target.result;
            const workBook = XLSX.read(bstr, { type: 'binary', cellText: false, cellDates: true });
            const workSheetName = workBook.SheetNames[0];
            const workSheet = workBook.Sheets[workSheetName];
            const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' });
            const headers = fileData[0];
            const heads = headers.map(head => ({ title: head, field: head }));
            fileData.splice(0, 1);
            convertToJson(headers, fileData);
        }
        reader.readAsBinaryString(file);
    }
    const convertToJson = async (headers, data) => {
        const rows = [];
        data.forEach(async row => {
            let rowData = {};
            row.forEach(async (element, index) => {
                rowData[headers[index]] = element;
            })
            if(isAddUser){
                rows.push({
                    id: rowData.id?.trim(),
                    name: rowData.name?.trim(),
                    username: rowData.username?.trim(),
                    password: rowData.password?.trim(),
                    role: rowData.role?.trim(),
                    idNumber: rowData.idNumber?.trim(),
                    whatsapp: rowData.whatsapp?.trim(),
                    type: rowData.type?.trim(),
                    email: rowData.email?.trim(),
                    club: rowData.club?.trim(),
                    level: rowData.level?.trim(),
                    college: rowData.college?.trim(),
                    country: rowData.country?.trim(),
                    createdAt: rowData.createdAt?.trim(),
                });
            }else if(isAddActivity){
                rows.push({
                    activityId: rowData.activityId?.trim(),
                    title: rowData.title?.trim(),
                    presenter: rowData.presenter?.trim(),
                    notes: rowData.notes?.trim(),
                    status: rowData.status?.trim(),
                    date: rowData.date?.trim(),
                    from: rowData.from?.trim(),
                    to: rowData.to?.trim(),
                    isAttend: rowData.isAttend?.toLowerCase().trim(),
                    hospitality: rowData.hospitality?.toLowerCase().trim(),
                    isShare: rowData.isShare?.toLowerCase().trim(),
                    projector: rowData.projector?.toLowerCase().trim(),
                    location: rowData.location?.trim(),
                    club: rowData.club?.trim(),
                    type: rowData.type?.trim(),
                    createdAt : rowData.createdAt?.trim(),
                    updatedAt : rowData.updatedAt?.trim(),
                });
            }else if(isAddPosts){
                rows.push({
                    postId: rowData.postId?.trim(),
                    title: rowData.title?.trim(),
                    body: rowData.body?.trim(),
                    image: rowData.image?.trim(),
                    user: rowData.user?.trim(),
                    club: rowData.club?.trim(),
                    createdAt : rowData.createdAt?.trim(),
                });
            }else if(isAddReports){
                rows.push({
                    reportId: rowData.reportId?.trim(),
                    summary: rowData.summary?.trim(),
                    notes: rowData.notes?.trim(),
                    numbers: rowData.numbers?.trim(),
                    images: rowData.images?.trim(),
                    club: rowData.club?.trim(),
                    activity: rowData.activity?.trim(),
                    user: rowData.user?.trim(),
                    createdAt : rowData.createdAt,
                });
            }else if(isAddAttend){
                rows.push({
                    attendId: rowData.attendId?.trim(),
                    benefit: rowData.benefit?.trim(),
                    lecturer: rowData.lecturer?.trim(),
                    attended: rowData.attended?.trim(),
                    suggestions: rowData.suggestions?.trim(),
                    utility: rowData.utility?.trim(),
                    activity: rowData.activity?.trim(),
                    user: rowData.user?.trim(),
                    createdAt: rowData.createdAt?.trim(),
                });
            }else if(isAddContact){
                rows.push({
                    contactId: rowData.contactId?.trim(),
                    title: rowData.title?.trim(),
                    body: rowData.body?.trim(),
                    image: rowData.image?.trim(),
                    status: rowData.status?.trim(),
                    club: rowData.club?.trim(),
                    type: rowData.type?.trim(),
                    user: rowData.user?.trim(),
                    createdAt: rowData.createdAt?.trim(),
                });
            }
        })
        if(isAddUser) setUsersFile(rows);
        if(isAddActivity) setActivitiesFile(rows);
        if(isAddPosts) setPostsFile(rows);
        if(isAddReports) setReportsFile(rows);
        if(isAddAttend) setAttendeesFile(rows);
        if(isAddContact) setContactsFile(rows);
        setDone(true)
    }
    const handlerSubmit =  (e) => {
        e.preventDefault()
        setLoading(true)
        if(name.length === 0){
            setErrorName('الاسم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        if(isAddUser == true){
            if(idCard.length === 0){
                setErrorIdCard('الهوية مطلوبة.')
                setLoading(false)
                return false
            }else {
                setErrorIdCard('')
                setLoading(false)
            }
            if(club.length === 0){
                setErrorClub('النادي مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorClub('')
                setLoading(false)
            }
            if(college.length === 0){
                setErrorCollege('الكلية مطلوبة.')
                setLoading(false)
                return false
            }else {
                setErrorCollege('')
                setLoading(false)
            }
            if(level.length === 0){
                setErrorLevel('المستوى مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorLevel('')
                setLoading(false)
            }
            if(country.length === 0){
                setErrorCountry('الدولة مطلوبة.')
                setLoading(false)
                return false
            }else {
                setErrorCountry('')
                setLoading(false)
            }
            if(whatsApp.length === 0){
                setErrorWhatsApp('رقم الواتساب مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorWhatsApp('')
                setLoading(false)
            }
            if(type.length === 0){
                setErrorType('النوع مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorType('')
                setLoading(false)
            }
        }else {
            if(username.length == 0) {
                setErrorUsername('الرقم الجامعي مطلوب.')
                setLoading(false)
                return false
            }else if(username.length < 9) {
                setErrorUsername('الرقم الجامعي يجب أن يكون أطول من 8 أرقام.')
                setLoading(false)
                return false
            }else if(username.length > 9) {
                setErrorUsername('الرقم الجامعي يجب أن يكون أصغر من 10 أرقام.')
                setLoading(false)
                return false
            }else {
                setErrorUsername('')
                setLoading(false)
            }
            if(password.length == 0){
                setErrorPassword('كلمة المرور مطلوبة.')
                setLoading(false)
                return false
            }else if(password.length < 8){
                setErrorPassword('كلمة المرور يجب أن تكون أطول من 8 أحرف.')
                setLoading(false)
                return false
            }else {
                setErrorPassword('')
                setLoading(false)
            }
            if(passwordConfirmation.length == 0){
                setErrorConfirmPassword('تأكيد كلمة المرور مطلوب.')
                setLoading(false)
                return false
            }else if(passwordConfirmation != password){
                setErrorConfirmPassword('كلمات المرور غير متطابقة.')
                setLoading(false)
                return false
            }else {
                setErrorConfirmPassword('')
                setLoading(false)
            }
        }
        setLoading(true)
        if(isEdit){

        }else {
            axios.post(`/auth/register`, {name: name, username: username, password: password, passwordConfirmation: passwordConfirmation})
                .then( async (res) => {
                    if(res.status === 201){
                        setLoading(false)
                        setSuccess('تم إنشاء حسابك بنحاح.')
                        setError('')
                        await signIn("Credentials",{
                            redirect: false,
                            username: username,
                            password: password,
                            callbackUrl: process.env.BASE_URL
                        })
                        router.push('/')
                    }
                }).catch(err => {
                setLoading(false)
                setSuccess('')
                setError(err.response.data.error)
            })
        }
    }
    const handlerSubmitAddUser =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(name.length === 0){
            setErrorName('الاسم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        if(username.length == 0) {
            setErrorUsername('الرقم الجامعي مطلوب.')
            setLoading(false)
            return false
        }else if(username.length < 9) {
            setErrorUsername('الرقم الجامعي يجب أن يكون أطول من 8 أرقام.')
            setLoading(false)
            return false
        }else if(username.length > 9) {
            setErrorUsername('الرقم الجامعي يجب أن يكون أصغر من 10 أرقام.')
            setLoading(false)
            return false
        }else {
            setErrorUsername('')
            setLoading(false)
        }
        if(idCard.length === 0){
            setErrorIdCard('الهوية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorIdCard('')
            setLoading(false)
        }
        if(email.length === 0){
            setErrorEmail('البريد الإلكتروني مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorEmail('')
            setLoading(false)
        }
        if(whatsApp.length === 0){
            setErrorWhatsApp('رقم الواتساب مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorWhatsApp('')
            setLoading(false)
        }
        if(country.length === 0){
            setErrorCountry('الدولة مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorCountry('')
            setLoading(false)
        }
        if(college.length === 0){
            setErrorCollege('الكلية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorCollege('')
            setLoading(false)
        }
        if(level.length === 0){
            setErrorLevel('المستوى مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorLevel('')
            setLoading(false)
        }
        if(session.user.role === "admin" || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager'){
            if(role.length === 0){
                setErrorRole('الرتبة مطلوبة.')
                setLoading(false)
                return false
            }else {
                setErrorRole('')
                setLoading(false)
            }
        }
        if(club.length === 0){
            setErrorClub('النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        if(type.length === 0){
            setErrorType('النوع مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorType('')
            setLoading(false)
        }
        if(password.length == 0){
            setErrorPassword('كلمة المرور مطلوبة.')
            setLoading(false)
            return false
        }else if(password.length < 8){
            setErrorPassword('كلمة المرور يجب أن تكون أطول من 8 أحرف.')
            setLoading(false)
            return false
        }else {
            setErrorPassword('')
            setLoading(false)
        }
        if(passwordConfirmation.length == 0){
            setErrorConfirmPassword('تأكيد كلمة المرور مطلوب.')
            setLoading(false)
            return false
        }else if(passwordConfirmation != password){
            setErrorConfirmPassword('كلمات المرور غير متطابقة.')
            setLoading(false)
            return false
        }else {
            setErrorConfirmPassword('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/students/add`, {
            name: name,
            username: username,
            email: email,
            idNumber: idCard,
            country: country,
            level: level,
            college: college,
            type: type,
            role: session.user.role === "admin"
            || session.user.role === 'president'
            || session.user.role === 'coordinator'
            || session.user.role === 'manager' ? role : 'student',
            club: club,
            whatsapp: whatsApp,
            password: password,
            passwordConfirmation: passwordConfirmation,
            isFile: false
        }).then( async (res) => {
                if(res.status === 201){
                    await swal({
                        title: 'تم!',
                        text: res.data.mess,
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                    setSuccess(res.data.mess)
                    setError('')
                    await delay(3000);
                    setSuccess('')
                    e.target.reset()
                }else {
                    await swal({
                        title: 'خطأ!',
                        text: res.data.mess,
                        icon: "error",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                    setSuccess('')
                    setError(res.data.mess)
                    if(res.data.mess.includes('الجامعي')){
                        setErrorUsername(res.data.mess)
                    }else if(res.data.mess.includes('البريد')){
                        setErrorIdCard(res.data.mess)
                    }else if(res.data.mess.includes('الهوية')){
                        setErrorEmail(res.data.mess)
                    }
                    await delay(3000);
                    setError('')
                }
            }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitRegister =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(name.length === 0){
            setErrorName('الاسم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        if(username.length == 0) {
            setErrorUsername('الرقم الجامعي مطلوب.')
            setLoading(false)
            return false
        }else if(username.length < 9) {
            setErrorUsername('الرقم الجامعي يجب أن يكون أطول من 8 أرقام.')
            setLoading(false)
            return false
        }else if(username.length > 9) {
            setErrorUsername('الرقم الجامعي يجب أن يكون أصغر من 10 أرقام.')
            setLoading(false)
            return false
        }else {
            setErrorUsername('')
            setLoading(false)
        }
        if(idCard.length === 0){
            setErrorIdCard('الهوية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorIdCard('')
            setLoading(false)
        }
        if(email.length === 0){
            setErrorEmail('البريد الإلكتروني مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorEmail('')
            setLoading(false)
        }
        if(whatsApp.length === 0){
            setErrorWhatsApp('رقم الواتساب مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorWhatsApp('')
            setLoading(false)
        }
        if(country.length === 0){
            setErrorCountry('الدولة مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorCountry('')
            setLoading(false)
        }
        if(college.length === 0){
            setErrorCollege('الكلية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorCollege('')
            setLoading(false)
        }
        if(level.length === 0){
            setErrorLevel('المستوى مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorLevel('')
            setLoading(false)
        }
        if(club.length === 0){
            setErrorClub('النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        if(password.length == 0){
            setErrorPassword('كلمة المرور مطلوبة.')
            setLoading(false)
            return false
        }else if(password.length < 8){
            setErrorPassword('كلمة المرور يجب أن تكون أطول من 8 أحرف.')
            setLoading(false)
            return false
        }else {
            setErrorPassword('')
            setLoading(false)
        }
        if(passwordConfirmation.length == 0){
            setErrorConfirmPassword('تأكيد كلمة المرور مطلوب.')
            setLoading(false)
            return false
        }else if(passwordConfirmation != password){
            setErrorConfirmPassword('كلمات المرور غير متطابقة.')
            setLoading(false)
            return false
        }else {
            setErrorConfirmPassword('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/auth/register`, {
            name: name,
            username: username,
            email: email,
            idNumber: idCard,
            country: country,
            level: level,
            college: college,
            club: club,
            whatsapp: whatsApp,
            password: password,
            passwordConfirmation: passwordConfirmation,
        }).then( async (res) => {
                if(res.status === 201){
                    await swal({
                        title: 'تم!',
                        text: res.data.mess,
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                    setSuccess(res.data.mess)
                    setError('')
                    await delay(3000);
                    setSuccess('')
                    e.target.reset()
                    await signIn("Credentials",{
                        redirect: false,
                        username: username,
                        password: password,
                        callbackUrl: process.env.BASE_URL
                    })
                    router.push('/')
                }else {
                    await swal({
                        title: 'خطأ!',
                        text: res.data.mess,
                        icon: "error",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                    setSuccess('')
                    setError(res.data.mess)
                    if(res.data.mess.includes('الجامعي')){
                        setErrorUsername(res.data.mess)
                    }else if(res.data.mess.includes('البريد')){
                        setErrorIdCard(res.data.mess)
                    }else if(res.data.mess.includes('الهوية')){
                        setErrorEmail(res.data.mess)
                    }
                    await delay(300000);
                    setError('')
                }
            }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitProfile =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(name.length === 0){
            setErrorName('الاسم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        if(email.length === 0){
            setErrorEmail('البريد الإلكتروني مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorEmail('')
            setLoading(false)
        }
        if(whatsApp.length === 0){
            setErrorWhatsApp('رقم الواتساب مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorWhatsApp('')
            setLoading(false)
        }
        if(country.length === 0){
            setErrorCountry('الدولة مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorCountry('')
            setLoading(false)
        }
        if(college.length === 0){
            setErrorCollege('الكلية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorCollege('')
            setLoading(false)
        }
        if(level.length === 0){
            setErrorLevel('المستوى مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorLevel('')
            setLoading(false)
        }
        setLoading(true)
        axios.put(`/profiles/edit`, {
            id: session.user.id,
            name: name,
            email: email,
            country: country,
            level: level,
            college: college,
            whatsapp: whatsApp,
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess('')
                setError(res.data.mess)
                await delay(3000);
                setError('')
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            // setError(err.response.data.error)
        })
    }
    const handlerSubmitEditPassword =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(isEditPassword){
            if(passwordOld.length == 0){
                setErrorPasswordOld('كلمة المرور القديمة مطلوبة.')
                setLoading(false)
                return false
            }else {
                setErrorPasswordOld('')
                setLoading(false)
            }
        }
        if(password.length == 0){
            setErrorPassword('كلمة المرور الجديدة مطلوبة.')
            setLoading(false)
            return false
        }else if(password.length < 8){
            setErrorPassword('كلمة المرور الجديدة يجب أن تكون أطول من 8 أحرف.')
            setLoading(false)
            return false
        }else {
            setErrorPassword('')
            setLoading(false)
        }
        if(passwordConfirmation.length == 0){
            setErrorConfirmPassword('تأكيد كلمة المرور الجديدة مطلوب.')
            setLoading(false)
            return false
        }else if(passwordConfirmation != password){
            setErrorConfirmPassword('كلمات المرور الجديدة غير متطابقة.')
            setLoading(false)
            return false
        }else {
            setErrorConfirmPassword('')
            setLoading(false)
        }
        setLoading(true)
        axios.put(`/${isEditPassword ? "profiles" : "students"}/setPassword`, {
            id: isEditPassword ? session.user.id : userId,
            passwordOld: passwordOld,
            password: password,
            passwordConfirmation: passwordConfirmation,
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(2000);
                setSuccess('')
                e.target.reset()
                if(isEditPassword){
                    await signOut()
                }else {
                    dispatch(profilesActions.isEditPassword(false))
                }
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess('')
                setError(res.data.mess)
                await delay(3000);
                setError('')
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitEditUser =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(name.length === 0){
            setErrorName('الاسم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        if(username.length == 0) {
            setErrorUsername('الرقم الجامعي مطلوب.')
            setLoading(false)
            return false
        }else if(username.length < 9) {
            setErrorUsername('الرقم الجامعي يجب أن يكون أطول من 8 أرقام.')
            setLoading(false)
            return false
        }else if(username.length > 9) {
            setErrorUsername('الرقم الجامعي يجب أن يكون أصغر من 10 أرقام.')
            setLoading(false)
            return false
        }else {
            setErrorUsername('')
            setLoading(false)
        }
        if(idCard.length === 0){
            setErrorIdCard('الهوية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorIdCard('')
            setLoading(false)
        }
        if(email.length === 0){
            setErrorEmail('البريد الإلكتروني مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorEmail('')
            setLoading(false)
        }
        if(whatsApp.length === 0){
            setErrorWhatsApp('رقم الواتساب مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorWhatsApp('')
            setLoading(false)
        }
        if(country.length === 0){
            setErrorCountry('الدولة مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorCountry('')
            setLoading(false)
        }
        if(college.length === 0){
            setErrorCollege('الكلية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorCollege('')
            setLoading(false)
        }
        if(level.length === 0){
            setErrorLevel('المستوى مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorLevel('')
            setLoading(false)
        }
        if(session.user.role === "admin" || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager'){
            if(role.length === 0){
                setErrorRole('الرتبة مطلوبة.')
                setLoading(false)
                return false
            }else {
                setErrorRole('')
                setLoading(false)
            }
        }
        if(club.length === 0){
            setErrorClub('النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        if(type.length === 0){
            setErrorType('النوع مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorType('')
            setLoading(false)
        }
        setLoading(true)
        axios.put(`/students/edit`, {
            id: students.id,
            name: name,
            username: username,
            email: email,
            idNumber: idCard,
            country: country,
            level: level,
            college: college,
            type: type,
            role: session.user.role === "admin"
            || session.user.role === 'president'
            || session.user.role === 'coordinator'
            || session.user.role === 'manager' ? role : 'student',
            club: club,
            whatsapp: whatsApp,
            isFile: false
        }).then( async (res) => {
                if(res.status === 201){
                    await swal({
                        title: 'تم!',
                        text: res.data.mess,
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                    setSuccess(res.data.mess)
                    setError('')
                    await delay(3000);
                    setSuccess('')
                }else {
                    await swal({
                        title: 'خطأ!',
                        text: res.data.mess,
                        icon: "error",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                    setSuccess("")
                    setError(res.data.mess)
                    await delay(3000);
                    setError("")
                }
            }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitAddActivity =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(title.length === 0){
            setErrorTitle('عنوان الفعالية مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorTitle('')
            setLoading(false)
        }
        if(presenter.length == 0) {
            setErrorPresenter('اسم المقدم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorPresenter('')
            setLoading(false)
        }
        if(date.length === 0){
            setErrorDate('التاريخ مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorDate('')
            setLoading(false)
        }
        if(from.length === 0){
            setErrorFrom('بداية الفعالية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorFrom('')
            setLoading(false)
        }
        if(to.length === 0){
            setErrorTo('نهاية الفعالية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorTo('')
            setLoading(false)
        }
        if(location.length === 0){
            setErrorLocation('مكان الفعالية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorLocation('')
            setLoading(false)
        }
        if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
            if(club.length === 0){
                setErrorClub('النادي مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorClub('')
                setLoading(false)
            }
        }
        if(type.length === 0){
            setErrorType('نوع الفعالية مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorType('')
            setLoading(false)
        }
        if(hospitality.length === 0){
            setErrorHospitality('رجاء حدد حالة الضيافة.')
            setLoading(false)
            return false
        }else {
            setErrorHospitality('')
            setLoading(false)
        }
        if(projector.length === 0){
            setErrorProjector('رجاء حدد حالة البروجكتور.')
            setLoading(false)
            return false
        }else {
            setErrorProjector('')
            setLoading(false)
        }
        if(isShare.length === 0){
            setErrorIsShare('رجاء حدد حالة الاشتراك.')
            setLoading(false)
            return false
        }else {
            setErrorIsShare('')
            setLoading(false)
        }
        if(isShare === "true"){
            if(clubShare.length === 0){
                setErrorClubShare('رجاء حدد النادي الذي تشترك معه..')
                setLoading(false)
                return false
            }else {
                setErrorClubShare('')
                setLoading(false)
            }
        }
        if(isDiscourse.length === 0){
            setErrorIsDiscourse('رجاء حدد حالة الخطاب.')
            setLoading(false)
            return false
        }else {
            setErrorIsDiscourse('')
            setLoading(false)
        }
        if(isDesign === 0){
            setErrorIsDesign('رجاء حدد حالة التصميم.')
            setLoading(false)
            return false
        }else {
            setErrorIsDesign('')
            setLoading(false)
        }
        if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
            if(status.length == 0){
                setErrorStatus('رجاء حدد حالة الفعالية.')
                setLoading(false)
                return false
            }else {
                setErrorStatus('')
                setLoading(false)
            }
        }
        setLoading(true)
        axios.post(`/activities/add`, {
            title: title.trim(),
            presenter: presenter.trim(),
            notes: notes.trim(),
            status: session.user.role === "admin"
            || session.user.role === 'president'
            || session.user.role === 'coordinator' ? status.trim() : 'تم الطلب',
            date: date.trim(),
            from: from.trim(),
            to: to.trim(),
            hospitality: hospitality,
            isShare: isShare,
            isDiscourse: isDiscourse,
            isDesign: isDesign,
            clubShare: clubShare,
            projector: projector,
            location: location.trim(),
            club: session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                ? club.trim()
                : session.user.club._id,
            type: type.trim(),
            isFile: false
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitEditPost =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(title.length == 0){
            setErrorTitle('عنوان المنشور مطلوب.')
            setLoading(false)
            console.log(typeof image)
            return false
        }else {
            setErrorTitle('')
            setLoading(false)
        }
        if(user.length == 0) {
            setErrorUser('اسم الكاتب مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorUser('')
            setLoading(false)
        }
        if(body.length == 0){
            setErrorBody('محتوى المنشور مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorBody('')
            setLoading(false)
        }
        if(club.length == 0){
            setErrorClub('النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        setLoading(true)
        if(typeof image == 'object'){
            axios.post(`/posts/addFile`, {
                id: posts.id,
                title: title.trim(),
                user: user.trim(),
                body: body.trim(),
                image: image,
                club: club.trim(),
            }).then( async (res) => {
                if(res.status === 201){
                    await swal({
                        title: 'تم!',
                        text: res.data.mess,
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                    setSuccess(res.data.mess)
                    setError('')
                    await delay(3000);
                    setSuccess('')
                    e.target.reset()
                }else {
                    await swal({
                        title: 'خطأ!',
                        text: res.data.mess,
                        icon: "error",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                    setSuccess("")
                    setError(res.data.mess)
                    await delay(3000);
                    setError('')
                }
            }).catch(err => {
                setLoading(false)
                setSuccess('')
                setError(err.response.data.error)
            })
        }else {
            axios.put(`/posts/edit`, {
                id: posts.id,
                title: title.trim(),
                user: user.trim(),
                body: body.trim(),
                club: club.trim(),
                isFile: false
            }).then( async (res) => {
                if(res.status === 201){
                    await swal({
                        title: 'تم!',
                        text: res.data.mess,
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                    setSuccess(res.data.mess)
                    setError('')
                    await delay(3000);
                    setSuccess('')
                }else {
                    await swal({
                        title: 'خطأ!',
                        text: res.data.mess,
                        icon: "error",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                    setSuccess("")
                    setError(res.data.mess)
                    await delay(3000);
                    setError('')
                }
            }).catch(err => {
                setLoading(false)
                setSuccess('')
                setError(err.response.data.error)
            })
        }
    }
    const handlerSubmitAddPost =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(title.length == 0){
            setErrorTitle('عنوان المنشور مطلوب.')
            setLoading(false)
            console.log(user)
            return false
        }else {
            setErrorTitle('')
            setLoading(false)
        }
        if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
            if(club.length == 0){
                setErrorClub('النادي مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorClub('')
                setLoading(false)
            }
        }
        if(body.length == 0){
            setErrorBody('محتوى المنشور مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorBody('')
            setLoading(false)
        }
        setLoading(true)
        const formData = new FormData();
        formData.append('title', title.trim(),);
        formData.append('user', session.user.id);
        formData.append('body', body.trim());
        formData.append('image', image);
        formData.append('club', club.trim());
        formData.append('isEdit', false);
        axios.post(`/posts/add`, formData).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess('')
                setError(res.data.mess)
                await delay(3000);
                setError('')
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitAddContact =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(title.length == 0){
            setErrorTitle('عنوان الطلب مطلوب.')
            setLoading(false)
            console.log(user)
            return false
        }else {
            setErrorTitle('')
            setLoading(false)
        }
        if(user.length == 0) {
            setErrorUser('اسم مقدم الطلب مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorUser('')
            setLoading(false)
        }
        if(type.length == 0){
            setErrorType('نوع الطلب مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorType('')
            setLoading(false)
        }
        if(club.length == 0){
            setErrorClub('النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        if(body.length == 0){
            setErrorBody('محتوى الطلب مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorBody('')
            setLoading(false)
        }
        if(session.user.role === "admin" || session.user.role === 'president' || session.user.role === 'coordinator'){
            if(status.length == 0){
                setErrorStatus('حالة الطلب مطلوبة.')
                setLoading(false)
                return false
            }else {
                setErrorStatus('')
                setLoading(false)
            }
        }
        setLoading(true)
        const formData = new FormData();
        formData.append('title', title.trim(),);
        formData.append('user', user.trim());
        formData.append('body', body.trim());
        formData.append('image', image);
        formData.append('type', type);
        formData.append('status', session.user.role === "admin" || session.user.role === 'president' || session.user.role === 'coordinator' ? status : "pending",);
        formData.append('club', club.trim());
        formData.append('isEdit', false);
        axios.post(`/contacts/add`, formData).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitAddReport =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(club.length == 0){
            setErrorClub('النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        if(user.length == 0) {
            setErrorUser('اسم مقدم التقرير مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorUser('')
            setLoading(false)
        }
        if(activity.length == 0){
            setErrorTitle('عنوان فعالية التقرير مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorTitle('')
            setLoading(false)
        }
        if(numbers.length == 0){
            setErrorNumber('عدد الحضور مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorNumber('')
            setLoading(false)
        }
        if(images.length == 0){
            setErrorImage('صور التقرير مطلوبة.')
            setLoading(false)
            return false
        }else if(images.length < 4){
            setErrorImage('صور التقرير يجب أن تكون أكثر من 4 صور.')
            setLoading(false)
            return false
        }else if(images.length > 4){
            setErrorImage('صور التقرير يجب أن لا تتجاوز 4 صور.')
            setLoading(false)
            return false
        }else {
            setErrorImage('')
            setLoading(false)
        }
        if(summary.length == 0){
            setErrorSummary('ملخص التقرير مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorSummary('')
            setLoading(false)
        }
        setLoading(true)
        const formData = new FormData();
        formData.append('summary', summary.trim(),);
        formData.append('notes', notes.trim());
        formData.append('numbers', numbers.trim());
        formData.append('imagesOne', images[0]);
        formData.append('imagesTwo', images[1]);
        formData.append('imagesThree', images[2]);
        formData.append('imagesFour', images[3]);
        formData.append('club', club.trim());
        formData.append('activity', activity);
        formData.append('user', user.trim());
        formData.append('isEdit', false);
        axios.post(`/reports/add`, formData).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitAddDesign =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(club.length == 0){
            setErrorClub('النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        if(activity.length == 0){
            setErrorTitle('عنوان فعالية التصميم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorTitle('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/designs/add`, {
            notes: notes.trim(),
            club: club.trim(),
            activity: activity.trim(),
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitEditDesign =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(club.length == 0){
            setErrorClub('النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        if(activity.length == 0){
            setErrorTitle('عنوان فعالية التصميم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorTitle('')
            setLoading(false)
        }
        setLoading(true)
        axios.put(`/designs/edit`, {
            id: designs.id.trim(),
            notes: notes.trim(),
            status: status.trim(),
            club: club.trim(),
            activity: activity.trim(),
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }

    const handlerSubmitAddDiscourses =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(club.length == 0){
            setErrorClub('النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        if(activity.length == 0){
            setErrorTitle('عنوان فعالية الخطاب مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorTitle('')
            setLoading(false)
        }
        if(presenter.length == 0){
            setErrorPresenter('اسم المقدم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorPresenter('')
            setLoading(false)
        }
        if(surname.length == 0){
            setErrorSurname('رتبة المقدم مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorSurname('')
            setLoading(false)
        }
        if(side.length == 0){
            setErrorSide('جهة المقدم مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorSide('')
            setLoading(false)
        }
        if(numbers.length == 0){
            setErrorNumber('عدد الحضور المتوقع مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorNumber('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/discourses/add`, {
            notes: notes.trim(),
            name: presenter.trim(),
            side: side.trim(),
            numbers: numbers.trim(),
            surname: surname.trim(),
            club: club.trim(),
            activity: activity.trim(),
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitEditDiscourses =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(presenter.length == 0){
            setErrorPresenter('اسم المقدم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorPresenter('')
            setLoading(false)
        }
        if(surname.length == 0){
            setErrorSurname('رتبة المقدم مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorSurname('')
            setLoading(false)
        }
        if(side.length == 0){
            setErrorSide('جهة المقدم مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorSide('')
            setLoading(false)
        }
        if(numbers.length == 0){
            setErrorNumber('عدد الحضور المتوقع مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorNumber('')
            setLoading(false)
        }
        if(status.length == 0){
            setErrorStatus('حالة الخطاب مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorNumber('')
            setLoading(false)
        }
        setLoading(true)
        axios.put(`/discourses/edit`, {
            id: discourses.id.trim(),
            notes: notes.trim(),
            name: presenter.trim(),
            side: side.trim(),
            numbers: numbers.toString().trim(),
            surname: surname.trim(),
            status: status.trim(),
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitEditReport =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(club.length == 0){
            setErrorClub('النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        if(user.length == 0) {
            setErrorUser('اسم مقدم التقرير مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorUser('')
            setLoading(false)
        }
        if(activity.length == 0){
            setErrorTitle('عنوان فعالية التقرير مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorTitle('')
            setLoading(false)
        }
        if(numbers.length == 0){
            setErrorNumber('عدد الحضور مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorNumber('')
            setLoading(false)
        }
        if(imagesChange){
            if(images.length == 0){
                setErrorImage('صور التقرير مطلوبة.')
                setLoading(false)
                return false
            }else if(images.length < 4){
                setErrorImage('صور التقرير يجب أن تكون أكثر من 4 صور.')
                setLoading(false)
                return false
            }else if(images.length > 4){
                setErrorImage('صور التقرير يجب أن لا تتجاوز 4 صور.')
                setLoading(false)
                return false
            }else {
                setErrorImage('')
                setLoading(false)
            }
        }
        if(summary.length == 0){
            setErrorSummary('ملخص التقرير مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorSummary('')
            setLoading(false)
        }
        setLoading(true)
        const formData = new FormData();
        formData.append('reportId', reports.id.trim());
        formData.append('summary', summary.trim());
        formData.append('notes', notes.trim());
        formData.append('numbers', numbers.trim());
        if(imagesChange){
            formData.append('imagesOne', images[0]);
            formData.append('imagesTwo', images[1]);
            formData.append('imagesThree', images[2]);
            formData.append('imagesFour', images[3]);
        }
        formData.append('club', club.trim());
        formData.append('activity', activity);
        formData.append('user', user.trim());
        formData.append('isEdit', true);
        axios.post(`/reports/add`, formData).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitEditContact =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(title.length == 0){
            setErrorTitle('عنوان الطلب مطلوب.')
            setLoading(false)
            console.log(user)
            return false
        }else {
            setErrorTitle('')
            setLoading(false)
        }
        if(user.length == 0) {
            setErrorUser('اسم مقدم الطلب مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorUser('')
            setLoading(false)
        }
        if(club.length == 0){
            setErrorClub('النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        if(body.length == 0){
            setErrorBody('محتوى الطلب مطلوب.')
            console.log(typeof image)
            setLoading(false)
            return false
        }else {
            setErrorBody('')
            setLoading(false)
        }
        if(type.length == 0){
            setErrorType('نوع الطلب مطلوب.')
            console.log(typeof image)
            setLoading(false)
            return false
        }else {
            setErrorType('')
            setLoading(false)
        }
        if(session.user.role === "admin" || session.user.role === 'president' || session.user.role === 'coordinator'){
            if(status.length == 0){
                setErrorStatus('حالة الطلب مطلوبة.')
                console.log(typeof image)
                setLoading(false)
                return false
            }else {
                setErrorStatus('')
                setLoading(false)
            }
        }
        setLoading(true)
        axios.put(`/contacts/edit`, {
            id: contacts.id,
            title: title.trim(),
            user: user.trim(),
            body: body.trim(),
            image: image,
            type: type.trim(),
            status: session.user.role === "admin" || session.user.role === 'president' || session.user.role === 'coordinator' ? status : contacts.status,
            club: club.trim(),
            isFile: false
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitEditActivity =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(title.length === 0){
            setErrorTitle('عنوان الفعالية مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorTitle('')
            setLoading(false)
        }
        if(presenter.length == 0) {
            setErrorPresenter('اسم المقدم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorPresenter('')
            setLoading(false)
        }
        if(date.length === 0){
            setErrorDate('التاريخ مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorDate('')
            setLoading(false)
        }
        if(from.length === 0){
            setErrorFrom('بداية الفعالية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorFrom('')
            setLoading(false)
        }
        if(to.length === 0){
            setErrorTo('نهاية الفعالية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorTo('')
            setLoading(false)
        }
        if(location.length === 0){
            setErrorLocation('مكان الفعالية مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorLocation('')
            setLoading(false)
        }
        if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
            if(club.length === 0){
                setErrorClub('النادي مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorClub('')
                setLoading(false)
            }
        }
        if(type.length === 0){
            setErrorType('نوع الفعالية مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorType('')
            setLoading(false)
        }
        if(hospitality.length === 0){
            setErrorHospitality('رجاء حدد حالة الضيافة.')
            setLoading(false)
            return false
        }else {
            setErrorHospitality('')
            setLoading(false)
        }
        if(projector.length === 0){
            setErrorProjector('رجاء حدد حالة البروجكتور.')
            setLoading(false)
            return false
        }else {
            setErrorProjector('')
            setLoading(false)
        }
        if(isShare.length === 0){
            setErrorIsShare('رجاء حدد حالة الاشتراك.')
            setLoading(false)
            return false
        }else {
            setErrorIsShare('')
            setLoading(false)
        }
        if(isShare === "true"){
            if(clubShare.length === 0){
                setErrorClubShare('رجاء حدد النادي الذي تشترك معه..')
                setLoading(false)
                return false
            }else {
                setErrorClubShare('')
                setLoading(false)
            }
        }
        if(isDiscourse.length === 0){
            setErrorIsDiscourse('رجاء حدد حالة الخطاب.')
            setLoading(false)
            return false
        }else {
            setErrorIsDiscourse('')
            setLoading(false)
        }
        if(isDesign === 0){
            setErrorIsDesign('رجاء حدد حالة التصميم.')
            setLoading(false)
            return false
        }else {
            setErrorIsDesign('')
            setLoading(false)
        }
        if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
            if(status.length == 0){
                setErrorStatus('رجاء حدد حالة الفعالية.')
                setLoading(false)
                return false
            }else {
                setErrorStatus('')
                setLoading(false)
            }
        }
        setLoading(true)
        axios.post(`/activities/edit`, {
            id: activities.id,
            title: title.trim(),
            presenter: presenter.trim(),
            notes: notes.trim(),
            status: session.user.role === "admin"
            || session.user.role === 'president'
            || session.user.role === 'coordinator' ? status.trim() : activities.status,
            date: date.trim(),
            from: from.trim(),
            to: to.trim(),
            hospitality: hospitality,
            isShare: isShare,
            isDiscourse: isDiscourse,
            isDesign: isDesign,
            clubShare: clubShare,
            projector: projector,
            location: location,
            club: session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                    ? club.trim()
                    : session.user.club._id,
            type: type.trim(),
            isFile: false
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError('')
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitAddUserFile =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(usersFile.length === 0){
            setErrorFile('ملف اكسل مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorFile('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/students/add`, {
            users: usersFile,
            isFile: true
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError('')
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitAddPostFile =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(postsFile.length === 0){
            setErrorFile('ملف اكسل مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorFile('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/posts/addFile`, {
            posts: postsFile,
            isFile: true
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError('')
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitAddContactFile =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(contactsFile.length === 0){
            setErrorFile('ملف اكسل مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorFile('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/contacts/addFile`, {
            contacts: contactsFile,
            isFile: true
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError('')
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitAddReportFile =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(reportsFile.length === 0){
            setErrorFile('ملف اكسل مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorFile('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/reports/addFile`, {
            reports: reportsFile,
            isFile: true
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError('')
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitAddAttendeesFile =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(attendeesFile.length === 0){
            setErrorFile('ملف اكسل مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorFile('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/attendees/add`, {
            attendees: attendeesFile,
            isFile: true
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError('')
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handlerSubmitAddActivityFile =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(activitiesFile.length === 0){
            setErrorFile('ملف اكسل مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorFile('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/activities/add`, {
            activities: activitiesFile,
            isFile: true
        }).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
                await delay(3000);
                setSuccess('')
                e.target.reset()
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError('')
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    return (
        <section className={Styles.user}>
            <form onSubmit={
                isAddUser
                    ? isFile
                        ? handlerSubmitAddUserFile
                        : isEdit
                            ? handlerSubmitEditUser
                            : handlerSubmitAddUser
                    : isAddActivity
                        ? isFile
                            ? handlerSubmitAddActivityFile
                            : isEdit
                                ? handlerSubmitEditActivity
                                : handlerSubmitAddActivity
                        : isAddPosts
                            ? isFile
                                ? handlerSubmitAddPostFile
                                : isEdit
                                    ? handlerSubmitEditPost
                                    : handlerSubmitAddPost
                            : isAddContact
                                ? isFile
                                    ? handlerSubmitAddContactFile
                                    : isEdit
                                        ? handlerSubmitEditContact
                                        : handlerSubmitAddContact
                                : isAddReports
                                    ? isFile
                                        ? handlerSubmitAddReportFile
                                        : isEdit
                                            ? handlerSubmitEditReport
                                            : handlerSubmitAddReport
                                    : isProfile
                                        ? handlerSubmitProfile
                                        : isEditPassword || isEditPasswordFromShow
                                            ? handlerSubmitEditPassword
                                            : isRegister
                                                ? handlerSubmitRegister
                                                : isAddAttend
                                                    ? handlerSubmitAddAttendeesFile
                                                    : isAddDesign
                                                        ? isEdit
                                                            ? handlerSubmitEditDesign
                                                            : handlerSubmitAddDesign
                                                        : isAddDiscourses
                                                            ? isEdit
                                                                ? handlerSubmitEditDiscourses
                                                                : handlerSubmitAddDiscourses
                                                            : null
            } encType={'multipart/form-data'}>
                <div>
                    {
                        isRegister && !isEdit && !isFile &&
                        <>
                            <div>
                                <label>الاسم الكامل</label>
                                <input
                                    placeholder={'اكتب اسمك كاملا'}
                                    type={'text'}
                                    onChange={e => {
                                        setName(e.target.value)
                                    }}
                                />
                                {
                                    errorName.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorName}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الرقم الجامعي</label>
                                <input
                                    placeholder={'اكتب رقمك الجامعي'}
                                    type={'number'}
                                    onChange={e => {
                                        setUsername(e.target.value)
                                    }}
                                />
                                {
                                    errorUsername.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorUsername}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الهوية</label>
                                <input
                                    placeholder={'اكتب رقم هويتك'}
                                    type={'number'}
                                    onChange={e => {
                                        setIdCard(e.target.value)
                                    }}
                                />
                                {
                                    errorIdCard.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorIdCard}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>البريد الإلكتروني</label>
                                <input style={{
                                    textAlign: 'left'
                                }}
                                       placeholder={'اكتب بريدك الإلكتروني'}
                                       type={'email'}
                                       onChange={e => {
                                           setEmail(e.target.value)
                                       }}
                                />
                                {
                                    errorEmail.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorEmail}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>رقم الواتساب</label>
                                <input
                                    placeholder={'أكَد رقمك للواتساب'}
                                    type={'number'}
                                    onChange={e => {
                                        setWhatsApp(e.target.value)
                                    }}
                                />
                                {
                                    errorWhatsApp.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorWhatsApp}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الدولة</label>
                                <select onChange={e => setCountry(e.target.value)}>
                                    <option value={''}>اختر الدولة</option>
                                    {
                                        countries.map(country => country.name != "---" && <option value={country._id}>{country.name}</option>)
                                    }
                                </select>
                                {
                                    errorCountry.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorCountry}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الكلية</label>
                                <select onChange={e => setCollege(e.target.value)}>
                                    <option value={''}>اختر الكلية</option>
                                    {
                                        colleges.map(college => college.name != "---" && <option value={college._id}>{college.name}</option>)
                                    }
                                </select>
                                {
                                    errorCollege.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorCollege}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>المستوى</label>
                                <select onChange={e => setLevel(e.target.value)}>
                                    <option value={''}>اختر المستوى</option>
                                    {
                                        levels.map(level => level.name != "---" && level.name != "التاسع" && level.name != "الثاني عشر" && level.name != "الحادي عشر" && level.name != "العاشر" && <option value={level._id}>{level.name}</option>)
                                    }
                                </select>
                                {
                                    errorLevel.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorLevel}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>النادي</label>
                                <select onChange={e => setClub(e.target.value)}>
                                    <option value={''}>اختر النادي</option>
                                    {
                                        clubs.map(club => club.name != "---" && club.name != "فريق الإدارة" && <option value={club._id}>{club.name}</option>)
                                    }
                                </select>
                                {
                                    errorClub.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorClub}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>كلمة المرور</label>
                                <input
                                    placeholder={'اكتب كلمة مرور حسابك'}
                                    type={'password'}
                                    onChange={e => {
                                        setPassword(e.target.value)
                                    }}
                                />
                                {
                                    errorPassword.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorPassword}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>تأكيد كلمة المرور</label>
                                <input
                                    placeholder={'أكَد كلمة مرور حسابك'}
                                    type={'password'}
                                    onChange={e => {
                                        setConfirmPassword(e.target.value)
                                    }}
                                />
                                {
                                    errorConfirmPassword.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorConfirmPassword}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isAddUser && !isEdit && !isFile &&
                        <>
                            <div>
                                <label>الاسم الكامل</label>
                                <input
                                    placeholder={'اكتب اسمك كاملا'}
                                    type={'text'}
                                    onChange={e => {
                                        setName(e.target.value)
                                    }}
                                />
                                {
                                    errorName.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorName}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الرقم الجامعي</label>
                                <input
                                    placeholder={'اكتب رقمك الجامعي'}
                                    type={'number'}
                                    onChange={e => {
                                        setUsername(e.target.value)
                                    }}
                                />
                                {
                                    errorUsername.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorUsername}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الهوية</label>
                                <input
                                    placeholder={'اكتب رقم هويتك'}
                                    type={'number'}
                                    onChange={e => {
                                        setIdCard(e.target.value)
                                    }}
                                />
                                {
                                    errorIdCard.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorIdCard}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>البريد الإلكتروني</label>
                                <input style={{
                                    textAlign: 'left'
                                }}
                                    placeholder={'اكتب بريدك الإلكتروني'}
                                    type={'email'}
                                    onChange={e => {
                                        setEmail(e.target.value)
                                    }}
                                />
                                {
                                    errorEmail.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorEmail}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>رقم الواتساب</label>
                                <input
                                    placeholder={'أكَد رقمك للواتساب'}
                                    type={'number'}
                                    onChange={e => {
                                        setWhatsApp(e.target.value)
                                    }}
                                />
                                {
                                    errorWhatsApp.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorWhatsApp}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الدولة</label>
                                <select onChange={e => setCountry(e.target.value)}>
                                    <option value={''}>اختر الدولة</option>
                                    {
                                        countries.map(country => country.name != "---" && <option value={country._id}>{country.name}</option>)
                                    }
                                </select>
                                {
                                    errorCountry.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorCountry}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الكلية</label>
                                <select onChange={e => setCollege(e.target.value)}>
                                    <option value={''}>اختر الكلية</option>
                                    {
                                        colleges.map(college => college.name != "---" && <option value={college._id}>{college.name}</option>)
                                    }
                                </select>
                                {
                                    errorCollege.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorCollege}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>المستوى</label>
                                <select onChange={e => setLevel(e.target.value)}>
                                    <option value={''}>اختر المستوى</option>
                                    {
                                        levels.map(level => level.name != "---" && level.name != "التاسع" && level.name != "الثاني عشر" && level.name != "الحادي عشر" && level.name != "العاشر" && <option value={level._id}>{level.name}</option>)
                                    }
                                </select>
                                {
                                    errorLevel.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorLevel}</span>
                                    </div>
                                }
                            </div>
                            {
                                (session.user.role === 'admin'
                                    || session.user.role === 'coordinator'
                                    || session.user.role === 'president'
                                    || session.user.role === 'manager')
                                && session.user.permissions.addStudent.status
                                    ? <div>
                                        <label>الرتبة</label>
                                        <select onChange={e => setRole(e.target.value)}>
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
                                        {
                                            errorRole.length > 0 &&
                                            <div className={Styles.error}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    fill="#E06469"
                                                    stroke="#E06469"
                                                    className="cf-icon-svg"
                                                    viewBox="-1.7 0 20.4 20.4"
                                                >
                                                    <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                </svg>
                                                <span>{errorRole}</span>
                                            </div>
                                        }
                                        </div>
                                    : null
                            }
                            {
                                session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                                    ? <div>
                                        <label>النادي</label>
                                        <select onChange={e => setClub(e.target.value)}>
                                            <option value={''}>اختر النادي</option>
                                            {
                                                session.user.role === 'admin'
                                                    ? clubs.map(club => club.name != "---" && <option value={club._id}>{club.name}</option>)
                                                    : clubs.map(club => club.name != "---" && club.name != "فريق الإدارة" && <option value={club._id}>{club.name}</option>)
                                            }
                                        </select>
                                        {
                                            errorClub.length > 0 &&
                                            <div className={Styles.error}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    fill="#E06469"
                                                    stroke="#E06469"
                                                    className="cf-icon-svg"
                                                    viewBox="-1.7 0 20.4 20.4"
                                                >
                                                    <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                </svg>
                                                <span>{errorClub}</span>
                                            </div>
                                        }
                                    </div>
                                    : null
                            }
                            <div>
                                <label>نوع العضوية</label>
                                <select onChange={e => setType(e.target.value)}>
                                    <option value={''}>اختر نوع عضوية المستخدم</option>
                                    <option value={'basic'}>أساسي</option>
                                    <option value={'subsidiary'}>فرعي</option>
                                </select>
                                {
                                    errorType.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorType}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>كلمة المرور</label>
                                <input
                                    placeholder={'اكتب كلمة مرور حسابك'}
                                    type={'password'}
                                    onChange={e => {
                                        setPassword(e.target.value)
                                    }}
                                />
                                {
                                    errorPassword.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorPassword}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>تأكيد كلمة المرور</label>
                                <input
                                    placeholder={'أكَد كلمة مرور حسابك'}
                                    type={'password'}
                                    onChange={e => {
                                        setConfirmPassword(e.target.value)
                                    }}
                                />
                                {
                                    errorConfirmPassword.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorConfirmPassword}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isAddUser && !isFile && isEdit &&
                        <>
                            <div>
                                <label>الاسم الكامل</label>
                                <input
                                    placeholder={'اكتب اسمك كاملا'}
                                    type={'text'}
                                    onChange={e => {
                                        setName(e.target.value)
                                    }}
                                    defaultValue={name}
                                />

                                {
                                    errorName.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorName}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الرقم الجامعي</label>
                                <input
                                    placeholder={'اكتب رقمك الجامعي'}
                                    type={'number'}
                                    onChange={e => {
                                        setUsername(e.target.value)
                                    }}
                                    defaultValue={username}
                                />
                                {
                                    errorUsername.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorUsername}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الهوية</label>
                                <input
                                    placeholder={'اكتب رقم هويتك'}
                                    type={'number'}
                                    onChange={e => {
                                        setIdCard(e.target.value)
                                    }}
                                    defaultValue={idCard}
                                />
                                {
                                    errorIdCard.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorIdCard}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>البريد الإلكتروني</label>
                                <input style={{
                                    textAlign: 'left'
                                }}
                                       placeholder={'اكتب بريدك الإلكتروني'}
                                       type={'email'}
                                       onChange={e => {
                                           setEmail(e.target.value)
                                       }}
                                       defaultValue={email}
                                />
                                {
                                    errorEmail.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorEmail}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>رقم الواتساب</label>
                                <input
                                    placeholder={'أكَد رقمك للواتساب'}
                                    type={'number'}
                                    onChange={e => {
                                        setWhatsApp(e.target.value)
                                    }}
                                    defaultValue={whatsApp}
                                />
                                {
                                    errorWhatsApp.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorWhatsApp}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الدولة</label>
                                <select onChange={e => setCountry(e.target.value)}>
                                    <option value={''}>اختر الدولة</option>
                                    {
                                        countries.map(countryList => countryList.name != "---" && <option selected={countryList._id == country} value={countryList._id}>{countryList.name}</option>)
                                    }
                                </select>
                                {
                                    errorCountry.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorCountry}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الكلية</label>
                                <select onChange={e => setCollege(e.target.value)}>
                                    <option value={''}>اختر الكلية</option>
                                    {
                                        colleges.map(collegeList => collegeList.name != "---" && <option selected={collegeList._id == college} value={collegeList._id}>{collegeList.name}</option>)
                                    }
                                </select>
                                {
                                    errorCollege.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorCollege}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>المستوى</label>
                                <select onChange={e => setLevel(e.target.value)}>
                                    <option value={''}>اختر المستوى</option>
                                    {
                                        levels.map(levelList => levelList.name != "---" && levelList.name != "التاسع" && levelList.name != "الثاني عشر" && levelList.name != "الحادي عشر" && levelList.name != "العاشر" && <option selected={levelList._id == level} value={levelList._id}>{levelList.name}</option>)
                                    }
                                </select>
                                {
                                    errorLevel.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorLevel}</span>
                                    </div>
                                }
                            </div>
                            {
                                (session.user.role === 'admin'
                                    || session.user.role === 'coordinator'
                                    || session.user.role === 'president'
                                    || session.user.role === 'manager')
                                && session.user.permissions.editStudent.status
                                    ? <div>
                                        <label>الرتبة</label>
                                        <select onChange={e => setRole(e.target.value)}>
                                            <option selected={role == ''} value={''}>اختر رتبة المستخدم</option>
                                            <option selected={role == 'student'} value={'student'}>طالب</option>
                                            {
                                                session.user.role === 'admin'
                                                    ? <option selected={role == 'admin'} value={'admin'}>مدير الموقع</option>
                                                    : null
                                            }
                                            {
                                                session.user.role === 'admin'
                                                || session.user.role === 'president'
                                                    ? <option selected={role == 'president'} value={'president'}>المشرف على الأندية</option>
                                                    : null
                                            }
                                            {
                                                session.user.role === 'admin'
                                                || session.user.role === 'coordinator'
                                                || session.user.role === 'president'
                                                    ? <>
                                                        <option selected={role == 'manager'} value={'manager'}>مدير</option>
                                                        <option selected={role == 'coordinator'} value={'coordinator'}>منسق</option>
                                                    </>
                                                    : null
                                            }
                                            <option selected={role == 'officials'} value={'officials'}>مسؤول</option>
                                            <option selected={role == 'deputy'} value={'deputy'}>نائب</option>
                                        </select>
                                        {
                                            errorRole.length > 0 &&
                                            <div className={Styles.error}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    fill="#E06469"
                                                    stroke="#E06469"
                                                    className="cf-icon-svg"
                                                    viewBox="-1.7 0 20.4 20.4"
                                                >
                                                    <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                </svg>
                                                <span>{errorRole}</span>
                                            </div>
                                        }
                                    </div>
                                    : null
                            }
                            {
                                session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                                    ? <div>
                                        <label>النادي</label>
                                        <select onChange={e => setClub(e.target.value)}>
                                            <option value={''}>اختر النادي</option>
                                            {
                                                session.user.role === 'admin'
                                                    ? clubs.map(clubList => clubList.name != "---" && <option selected={clubList._id == club} value={clubList._id}>{clubList.name}</option>)
                                                    : clubs.map(clubList => clubList.name != "---" && clubList.name != "فريق الإدارة" && <option selected={clubList._id == club} value={clubList._id}>{clubList.name}</option>)
                                            }
                                        </select>
                                        {
                                            errorClub.length > 0 &&
                                            <div className={Styles.error}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    fill="#E06469"
                                                    stroke="#E06469"
                                                    className="cf-icon-svg"
                                                    viewBox="-1.7 0 20.4 20.4"
                                                >
                                                    <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                </svg>
                                                <span>{errorClub}</span>
                                            </div>
                                        }
                                    </div>
                                    : null
                            }
                            <div>
                                <label>نوع العضوية</label>
                                <select onChange={e => setType(e.target.value)}>
                                    <option selected={type == ''} value={''}>اختر نوع عضوية المستخدم</option>
                                    <option selected={type == 'basic'} value={'basic'}>أساسي</option>
                                    <option selected={type == 'subsidiary'} value={'subsidiary'}>فرعي</option>
                                </select>
                                {
                                    errorType.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorType}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isProfile && !isFile &&
                        <>
                            <div>
                                <label>الاسم الكامل</label>
                                <input
                                    placeholder={'اكتب اسمك كاملا'}
                                    type={'text'}
                                    onChange={e => {
                                        setName(e.target.value)
                                    }}
                                    defaultValue={name}
                                />

                                {
                                    errorName.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorName}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>البريد الإلكتروني</label>
                                <input style={{
                                    textAlign: 'left'
                                }}
                                       placeholder={'اكتب بريدك الإلكتروني'}
                                       type={'email'}
                                       onChange={e => {
                                           setEmail(e.target.value)
                                       }}
                                       defaultValue={email}
                                />
                                {
                                    errorEmail.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorEmail}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>رقم الواتساب</label>
                                <input
                                    placeholder={'أكَد رقمك للواتساب'}
                                    type={'number'}
                                    onChange={e => {
                                        setWhatsApp(e.target.value)
                                    }}
                                    defaultValue={whatsApp}
                                />
                                {
                                    errorWhatsApp.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorWhatsApp}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الدولة</label>
                                <select onChange={e => setCountry(e.target.value)}>
                                    <option value={''}>اختر الدولة</option>
                                    {
                                        countries.map(countryList => countryList.name != "---" && <option selected={countryList._id == country} value={countryList._id}>{countryList.name}</option>)
                                    }
                                </select>
                                {
                                    errorCountry.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorCountry}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الكلية</label>
                                <select onChange={e => setCollege(e.target.value)}>
                                    <option value={''}>اختر الكلية</option>
                                    {
                                        colleges.map(collegeList => collegeList.name != "---" && <option selected={collegeList._id == college} value={collegeList._id}>{collegeList.name}</option>)
                                    }
                                </select>
                                {
                                    errorCollege.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorCollege}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>المستوى</label>
                                <select onChange={e => setLevel(e.target.value)}>
                                    <option value={''}>اختر المستوى</option>
                                    {
                                        levels.map(levelList => levelList.name != "---" && levelList.name != "التاسع" && levelList.name != "الثاني عشر" && levelList.name != "الحادي عشر" && levelList.name != "العاشر" && <option selected={levelList._id == level} value={levelList._id}>{levelList.name}</option>)
                                    }
                                </select>
                                {
                                    errorLevel.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorLevel}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isEditPassword && !isFile &&
                        <>
                            <div>
                                <label>كلمة المرور القديمة</label>
                                <input
                                    placeholder={'اكتب كلمة مرور حسابك القديمة'}
                                    type={'password'}
                                    onChange={e => {
                                        setPasswordOld(e.target.value)
                                    }}
                                />
                                {
                                    errorPasswordOld.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorPasswordOld}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>كلمة المرور الجديدة</label>
                                <input
                                    placeholder={'اكتب كلمة مرور حسابك الجديدة'}
                                    type={'password'}
                                    onChange={e => {
                                        setPassword(e.target.value)
                                    }}
                                />
                                {
                                    errorPassword.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorPassword}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>تأكيد كلمة المرور الجديدة</label>
                                <input
                                    placeholder={'أكَد كلمة مرور حسابك الجديدة'}
                                    type={'password'}
                                    onChange={e => {
                                        setConfirmPassword(e.target.value)
                                    }}
                                />
                                {
                                    errorConfirmPassword.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorConfirmPassword}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isEditPasswordFromShow && !isFile &&
                        <>
                            <div>
                                <label>كلمة المرور الجديدة</label>
                                <input
                                    placeholder={'اكتب كلمة مرور حسابك الجديدة'}
                                    type={'password'}
                                    onChange={e => {
                                        setPassword(e.target.value)
                                    }}
                                />
                                {
                                    errorPassword.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorPassword}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>تأكيد كلمة المرور الجديدة</label>
                                <input
                                    placeholder={'أكَد كلمة مرور حسابك الجديدة'}
                                    type={'password'}
                                    onChange={e => {
                                        setConfirmPassword(e.target.value)
                                    }}
                                />
                                {
                                    errorConfirmPassword.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorConfirmPassword}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isAddActivity && !isFile && !isEdit &&
                        <>
                            <div>
                                <label>عنوان الفعالية</label>
                                <input
                                    placeholder={'اكتب عنوان الفعالية كاملا'}
                                    type={'text'}
                                    onChange={e => {
                                        setTitle(e.target.value)
                                    }}
                                />
                                {
                                    errorTitle.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorTitle}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>مقدم الفعالية</label>
                                <input
                                    placeholder={'اكتب اسم مقدم الفعالية'}
                                    type={'text'}
                                    onChange={e => {
                                        setPresenter(e.target.value)
                                    }}
                                />
                                {
                                    errorPresenter.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorPresenter}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>التاريخ</label>
                                <select onChange={e => setDate(e.target.value)}>
                                    <option value={''}>اختر التاريخ</option>
                                    {
                                        dates.map(date => <option value={date}>{date}</option>)
                                    }
                                </select>
                                {
                                    errorDate.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorDate}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>من</label>
                                <select onChange={e => setFrom(e.target.value)}>
                                    <option value={''}>اختر بداية الوقت</option>
                                    {
                                        times.map(time => <option value={time}>{time}</option>)
                                    }
                                </select>
                                {
                                    errorFrom.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorFrom}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>إلى</label>
                                <select onChange={e => setTo(e.target.value)}>
                                    <option value={''}>اختر نهاية الوقت</option>
                                    {
                                        times.map(time => <option value={time}>{time}</option>)
                                    }
                                </select>
                                {
                                    errorTo.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorTo}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>المكان</label>
                                <select onChange={e => setLocation(e.target.value)}>
                                    <option value={''}>اختر المكان</option>
                                    {
                                        locations.map(location => <option value={location._id}>{location.name}</option>)
                                    }
                                </select>
                                {
                                    errorLocation.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorLocation}</span>
                                    </div>
                                }
                            </div>
                            {
                                session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                                    ? <div>
                                        <label>النادي</label>
                                        <select onChange={e => setClub(e.target.value)}>
                                            <option value={''}>اختر النادي</option>
                                            {
                                                clubs.map(club => club.name != "---" && club.name != "فريق الإدارة" && <option value={club._id}>{club.name}</option>)
                                            }
                                        </select>
                                        {
                                            errorClub.length > 0 &&
                                            <div className={Styles.error}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    fill="#E06469"
                                                    stroke="#E06469"
                                                    className="cf-icon-svg"
                                                    viewBox="-1.7 0 20.4 20.4"
                                                >
                                                    <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                </svg>
                                                <span>{errorClub}</span>
                                            </div>
                                        }
                                    </div>
                                    : null
                            }
                            <div>
                                <label>النوع</label>
                                <select onChange={e => setType(e.target.value)}>
                                    <option value={''}>اختر النوع</option>
                                    {
                                        types.map(type => <option value={type._id}>{type.name}</option>)
                                    }
                                </select>
                                {
                                    errorType.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorType}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الضيافة</label>
                                <select onChange={e => setHospitality(e.target.value)}>
                                    <option value={''}>اختر حالة الضيافة</option>
                                    <option value={true}>نعم</option>
                                    <option value={false}>لا</option>
                                </select>
                                {
                                    errorHospitality.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorHospitality}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>البروجتر</label>
                                <select onChange={e => setProjector(e.target.value)}>
                                    <option value={''}>اختر حالة البروجكتر</option>
                                    <option value={true}>نعم</option>
                                    <option value={false}>لا</option>
                                </select>
                                {
                                    errorProjector.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorProjector}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الاشتراك</label>
                                <select onChange={e => setIsShare(e.target.value)}>
                                    <option value={''}>اختر حالة الاشتراك</option>
                                    <option value={true}>نعم</option>
                                    <option value={false}>لا</option>
                                </select>
                                {
                                    errorIsShare.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorIsShare}</span>
                                    </div>
                                }
                            </div>
                            {
                                isShare === "true"
                                    ? <div>
                                        <label>مشتركة مع من؟</label>
                                        <select onChange={e => setClubShare(e.target.value)}>
                                            <option value={''}>اختر النادي</option>
                                            {
                                                clubs.map(clubList => clubList.name != "---" && clubList.name != "فريق الإدارة" && clubList._id != club && <option value={clubList._id}>{clubList.name}</option>)
                                            }
                                        </select>
                                        {
                                            errorClubShare.length > 0 &&
                                            <div className={Styles.error}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    fill="#E06469"
                                                    stroke="#E06469"
                                                    className="cf-icon-svg"
                                                    viewBox="-1.7 0 20.4 20.4"
                                                >
                                                    <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                </svg>
                                                <span>{errorClubShare}</span>
                                            </div>
                                        }
                                    </div>
                                    : null
                            }
                            <div>
                                <label>الخطاب</label>
                                <select onChange={e => setIsDiscourse(e.target.value)}>
                                    <option value={''}>اختر حالة الخطاب</option>
                                    <option value={true}>نعم</option>
                                    <option value={false}>لا</option>
                                </select>
                                {
                                    errorIsDiscourse.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorIsDiscourse}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>التصميم</label>
                                <select onChange={e => setIsDesign(e.target.value)}>
                                    <option value={''}>اختر حالة التصميم</option>
                                    <option value={true}>نعم</option>
                                    <option value={false}>لا</option>
                                </select>
                                {
                                    errorIsDesign.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorIsDesign}</span>
                                    </div>
                                }
                            </div>
                            {
                                session.user.role === "admin" || session.user.role === 'president' || session.user.role === 'coordinator'
                                    ? <div>
                                        <label>الحالة</label>
                                        <select onChange={e => setStatus(e.target.value)}>
                                            <option value={''}>حدد الحالة</option>
                                            <option value={'أقيمت'}>أقيمت</option>
                                            <option value={'لم تقم'}>لم تقم</option>
                                            <option value={'ملغاة'}>ملغاة</option>
                                            <option value={'مؤجلة'}>مؤجلة</option>
                                            <option value={'تم الطلب'}>تم الطلب</option>
                                            <option value={'تم الحجز'}>تم الحجز</option>
                                        </select>
                                        {
                                            errorStatus.length > 0 &&
                                            <div className={Styles.error}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    fill="#E06469"
                                                    stroke="#E06469"
                                                    className="cf-icon-svg"
                                                    viewBox="-1.7 0 20.4 20.4"
                                                >
                                                    <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                </svg>
                                                <span>{errorStatus}</span>
                                            </div>
                                        }
                                    </div>
                                    : null
                            }
                            <div style={{
                                gridColumn: "span 3"
                            }}>
                                <label>ملاحظات</label>
                                <textarea placeholder={'ملاحظات توجهها لفريق الإشراف؟'} onChange={e => setNotes(e.target.value)}></textarea>
                                {
                                    errorNotes.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorNotes}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isAddPosts && !isFile && !isEdit &&
                        <>
                            <div>
                                <label>عنوان المنشور</label>
                                <input
                                    placeholder={'اكتب عنوان المشنور'}
                                    type={'text'}
                                    onChange={e => {
                                        setTitle(e.target.value)
                                    }}
                                />
                                {
                                    errorTitle.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorTitle}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>صورة المنشور</label>
                                <input
                                    type={'file'}
                                    onChange={e => {
                                        setImage(e.target.files[0])
                                    }}
                                />
                                {
                                    errorImage.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorImage}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>النادي</label>
                                <select onChange={e => setClub(e.target.value)}>
                                    <option value={''}>اختر النادي</option>
                                    {
                                        clubs.map(club => <option value={club._id}>{club.name}</option>)
                                    }
                                </select>
                                {
                                    errorClub.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorClub}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>المحتوى</label>
                                <textarea placeholder={'اكتب محتوى المنشور'} onChange={e => setBody(e.target.value)}></textarea>
                                {
                                    errorBody.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorBody}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isAddPosts && !isFile && isEdit &&
                        <>
                            <div>
                                <label>عنوان المنشور</label>
                                <input
                                    placeholder={'اكتب عنوان المشنور'}
                                    type={'text'}
                                    onChange={e => {
                                        setTitle(e.target.value)
                                    }}
                                    defaultValue={title}
                                />
                                {
                                    errorTitle.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorTitle}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>صورة المنشور</label>
                                <input
                                    type={'file'}
                                    onChange={e => {
                                        setImage(e.target.files[0])
                                    }}
                                />
                                {
                                    errorImage.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorImage}</span>
                                    </div>
                                }
                            </div>
                            {
                                session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                                    ? <div>
                                        <label>النادي</label>
                                        <select onChange={e => setClub(e.target.value)}>
                                            <option value={''}>اختر النادي</option>
                                            {
                                                clubs.map(clubList => <option selected={clubList._id == club} value={clubList._id}>{clubList.name}</option>)
                                            }
                                        </select>
                                        {
                                            errorClub.length > 0 &&
                                            <div className={Styles.error}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    fill="#E06469"
                                                    stroke="#E06469"
                                                    className="cf-icon-svg"
                                                    viewBox="-1.7 0 20.4 20.4"
                                                >
                                                    <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                </svg>
                                                <span>{errorClub}</span>
                                            </div>
                                        }
                                    </div>
                                    : null
                            }
                            <div>
                                <label>المحتوى</label>
                                <textarea defaultValue={body} placeholder={'اكتب محتوى المنشور'} onChange={e => setBody(e.target.value)}></textarea>
                                {
                                    errorBody.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorBody}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isAddReports && !isFile && !isEdit &&
                        <>
                            <div>
                                <label>النادي</label>
                                <select onChange={e => {
                                    setClub(e.target.value)
                                    if(e.target.value.length != 0) {
                                        axios.post('/reports/getActivity', {
                                            clubId: e.target.value
                                        }).then(res => {
                                            setActivitiesList(res.data.activities)
                                        })
                                    }else {
                                        setErrorClub('رجاء حدد اسم النادي.')
                                    }
                                }}>
                                    <option value={''}>اختر النادي</option>
                                    {
                                        session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                                            ? clubs.map(clubList => clubList.name != "---" && clubList.name != "فريق الإدارة" && <option selected={clubList._id == club} value={clubList._id}>{clubList.name}</option>)
                                            : <option selected={session.user.club._id == club} value={session.user.club._id}>{session.user.club.name}</option>
                                    }
                                </select>
                                {
                                    errorClub.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorClub}</span>
                                    </div>
                                }
                            </div>
                            {
                                activitiesList.length > 0
                                    ? <>
                                        <div>
                                            <label>عنوان الفعالية</label>
                                            <select onChange={e => setActivity(e.target.value)}>
                                                <option value={''}>اختر الفعالية</option>
                                                {
                                                    activitiesList.map(activityList => <option selected={activityList._id == activity} value={activityList._id}>{activityList.title + ' ' + `{${activityList.date.split('T')[0]}}`}</option>)
                                                }
                                            </select>
                                            {
                                                errorTitle.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorTitle}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>عدد الحضور</label>
                                            <input
                                                type={'number'}
                                                onChange={e => {
                                                    setNumbers(e.target.value)
                                                }}
                                            />
                                            {
                                                errorNumber.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorNumber}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>صور التقرير</label>
                                            <input
                                                type={'file'}
                                                multiple={true}
                                                onChange={e => {
                                                    setImages(e.target.files)
                                                }}
                                            />
                                            {
                                                errorImage.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorImage}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>الملخص</label>
                                            <textarea defaultValue={summary} placeholder={'اكتب ملخص الفعالية'} onChange={e => setSummary(e.target.value)}></textarea>
                                            {
                                                errorSummary.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorSummary}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>ملاحظات</label>
                                            <textarea defaultValue={notes} placeholder={'اكتب إذا كانت لديك ملاحظات على الفعالية'} onChange={e => setNotes(e.target.value)}></textarea>
                                            {
                                                errorNotes.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorNotes}</span>
                                                </div>
                                            }
                                        </div>
                                    </>
                                    : null
                            }
                        </>
                    }
                    {
                        isAddDesign && !isFile && !isEdit &&
                        <>
                            <div>
                                <label>النادي</label>
                                <select onChange={e => {
                                    setClub(e.target.value)
                                    if(e.target.value.length != 0) {
                                        axios.post('/designs/getActivity', {
                                            clubId: e.target.value
                                        }).then(res => {
                                            setActivitiesList(res.data.activities)
                                        })
                                    }else {
                                        setErrorClub('رجاء حدد اسم النادي.')
                                    }
                                }}>
                                    <option value={''}>اختر النادي</option>
                                    {
                                        session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                                            ? clubs.map(clubList => clubList.name != "---" && clubList.name != "فريق الإدارة" && <option selected={clubList._id == club} value={clubList._id}>{clubList.name}</option>)
                                            : <option selected={session.user.club._id == club} value={session.user.club._id}>{session.user.club.name}</option>
                                    }
                                </select>
                                {
                                    errorClub.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorClub}</span>
                                    </div>
                                }
                            </div>
                            {
                                activitiesList.length > 0
                                    ? <>
                                        <div>
                                            <label>عنوان الفعالية</label>
                                            <select onChange={e => setActivity(e.target.value)}>
                                                <option value={''}>اختر الفعالية</option>
                                                {
                                                    activitiesList.map(activityList => <option selected={activityList._id == activity} value={activityList._id}>{activityList.title + ' ' + `{${activityList.date.split('T')[0]}}`}</option>)
                                                }
                                            </select>
                                            {
                                                errorTitle.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorTitle}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>ملاحظات</label>
                                            <textarea defaultValue={notes} placeholder={'اكتب إذا كانت لديك ملاحظات على الفعالية'} onChange={e => setNotes(e.target.value)}></textarea>
                                            {
                                                errorNotes.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorNotes}</span>
                                                </div>
                                            }
                                        </div>
                                    </>
                                    : null
                            }
                        </>
                    }
                    {
                        isAddDiscourses && !isFile && !isEdit &&
                        <>
                            <div>
                                <label>النادي</label>
                                <select onChange={e => {
                                    setClub(e.target.value)
                                    if(e.target.value.length != 0) {
                                        axios.post('/discourses/getActivity', {
                                            clubId: e.target.value
                                        }).then(res => {
                                            setActivitiesList(res.data.activities)
                                        })
                                    }else {
                                        setErrorClub('رجاء حدد اسم النادي.')
                                    }
                                }}>
                                    <option value={''}>اختر النادي</option>
                                    {
                                        session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                                            ? clubs.map(clubList => clubList.name != "---" && clubList.name != "فريق الإدارة" && <option selected={clubList._id == club} value={clubList._id}>{clubList.name}</option>)
                                            : <option selected={session.user.club._id == club} value={session.user.club._id}>{session.user.club.name}</option>
                                    }
                                </select>
                                {
                                    errorClub.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorClub}</span>
                                    </div>
                                }
                            </div>
                            {
                                activitiesList.length > 0
                                    ? <>
                                        <div>
                                            <label>عنوان الفعالية</label>
                                            <select onChange={e => setActivity(e.target.value)}>
                                                <option value={''}>اختر الفعالية</option>
                                                {
                                                    activitiesList.map(activityList => <option selected={activityList._id == activity} value={activityList._id}>{activityList.title + ' ' + `{${activityList.date.split('T')[0]}}`}</option>)
                                                }
                                            </select>
                                            {
                                                errorTitle.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorTitle}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>مقدم الفعالية</label>
                                            <input
                                                placeholder={'اكتب اسم مقدم الفعالية'}
                                                type={'text'}
                                                onChange={e => {
                                                    setPresenter(e.target.value)
                                                }}
                                                defaultValue={presenter}
                                            />
                                            {
                                                errorPresenter.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorPresenter}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>رتبة المقدم</label>
                                            <input
                                                placeholder={'اكتب رتبة مقدم الفعالية'}
                                                type={'text'}
                                                onChange={e => {
                                                    setSurname(e.target.value)
                                                }}
                                                defaultValue={surname}
                                            />
                                            {
                                                errorSurname.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorSurname}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>جهة المقدم</label>
                                            <input
                                                placeholder={'اكتب جهة مقدم الفعالية'}
                                                type={'text'}
                                                onChange={e => {
                                                    setSide(e.target.value)
                                                }}
                                                defaultValue={side}
                                            />
                                            {
                                                errorSide.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorSide}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>عدد الحضور المتوقع</label>
                                            <input
                                                type={'number'}
                                                onChange={e => {
                                                    setNumbers(e.target.value)
                                                }}
                                            />
                                            {
                                                errorNumber.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorNumber}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>ملاحظات</label>
                                            <textarea defaultValue={notes} placeholder={'اكتب إذا كانت لديك ملاحظات على الفعالية'} onChange={e => setNotes(e.target.value)}></textarea>
                                            {
                                                errorNotes.length > 0 &&
                                                <div className={Styles.error}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        fill="#E06469"
                                                        stroke="#E06469"
                                                        className="cf-icon-svg"
                                                        viewBox="-1.7 0 20.4 20.4"
                                                    >
                                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                    </svg>
                                                    <span>{errorNotes}</span>
                                                </div>
                                            }
                                        </div>
                                    </>
                                    : null
                            }
                        </>
                    }
                    {
                        isAddDiscourses && !isFile && isEdit &&
                        <>
                            <div>
                                <label>مقدم الفعالية</label>
                                <input
                                    placeholder={'اكتب اسم مقدم الفعالية'}
                                    type={'text'}
                                    onChange={e => {
                                        setPresenter(e.target.value)
                                    }}
                                    defaultValue={presenter}
                                />
                                {
                                    errorPresenter.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorPresenter}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>رتبة المقدم</label>
                                <input
                                    placeholder={'اكتب رتبة مقدم الفعالية'}
                                    type={'text'}
                                    onChange={e => {
                                        setSurname(e.target.value)
                                    }}
                                    defaultValue={surname}
                                />
                                {
                                    errorSurname.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorSurname}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>جهة المقدم</label>
                                <input
                                    placeholder={'اكتب جهة مقدم الفعالية'}
                                    type={'text'}
                                    onChange={e => {
                                        setSide(e.target.value)
                                    }}
                                    defaultValue={side}
                                />
                                {
                                    errorSide.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorSide}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>عدد الحضور المتوقع</label>
                                <input
                                    type={'number'}
                                    onChange={e => {
                                        setNumbers(e.target.value)
                                    }}
                                    defaultValue={numbers}
                                />
                                {
                                    errorNumber.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorNumber}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>حالة الخطاب</label>
                                <select onChange={e => setStatus(e.target.value)}>
                                    <option selected={'' == status} value={''}>اختر الحالة</option>
                                    <option selected={'completed' == status} value={'completed'}>تمت الموافقة</option>
                                    <option selected={'canceled' == status} value={'canceled'}>لم تتم الموافقة</option>
                                    <option selected={'pending' == status} value={'pending'}>تحت التنفيذ</option>
                                </select>
                                {
                                    errorStatus.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorStatus}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>ملاحظات</label>
                                <textarea defaultValue={notes} placeholder={'اكتب إذا كانت لديك ملاحظات على الخطاب'} onChange={e => setNotes(e.target.value)}></textarea>
                                {
                                    errorNotes.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorNotes}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isAddDesign && !isFile && isEdit &&
                        <>
                            <div>
                                <label>حالة التصميم</label>
                                <select onChange={e => setStatus(e.target.value)}>
                                    <option selected={'' == status} value={''}>اختر الحالة</option>
                                    <option selected={'completed' == status} value={'completed'}>تم التصميم</option>
                                    <option selected={'canceled' == status} value={'canceled'}>لم يتم التصميم</option>
                                    <option selected={'pending' == status} value={'pending'}>تحت التنفيذ</option>
                                </select>
                                {
                                    errorStatus.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorStatus}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>ملاحظات</label>
                                <textarea defaultValue={notes} placeholder={'اكتب إذا كانت لديك ملاحظات على الفعالية'} onChange={e => setNotes(e.target.value)}></textarea>
                                {
                                    errorNotes.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorNotes}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isAddReports && !isFile && isEdit &&
                        <>
                            <div>
                                <label>عدد الحضور</label>
                                <input
                                    defaultValue={numbers}
                                    type={'number'}
                                    onChange={e => {
                                        setNumbers(e.target.value)
                                    }}
                                />
                                {
                                    errorNumber.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorNumber}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الملخص</label>
                                <textarea defaultValue={summary} placeholder={'اكتب ملخص الفعالية'} onChange={e => setSummary(e.target.value)}></textarea>
                                {
                                    errorSummary.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorSummary}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>ملاحظات</label>
                                <textarea defaultValue={notes} placeholder={'اكتب إذا كانت لديك ملاحظات على الفعالية'} onChange={e => setNotes(e.target.value)}></textarea>
                                {
                                    errorNotes.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorNotes}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isAddContact && !isFile && !isEdit &&
                        <>
                            <div>
                                <label>عنوان الطلب</label>
                                <input
                                    placeholder={'اكتب عنوان الطلب'}
                                    type={'text'}
                                    onChange={e => {
                                        setTitle(e.target.value)
                                    }}
                                    defaultValue={title}
                                />
                                {
                                    errorTitle.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorTitle}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>نوع الطلب</label>
                                <select onChange={e => setType(e.target.value)}>
                                    <option selected={'' == type} value={''}>اختر النوع</option>
                                    <option selected={'تغيير النادي الأساسي' == type} value={'تغيير النادي الأساسي'}>تغيير النادي الأساسي</option>
                                    <option selected={'الجوائز' == type} value={'الجوائز'}>الجوائز</option>
                                    <option selected={'الشهادات' == type} value={'الشهادات'}>الشهادات</option>
                                    <option selected={'شكوى' == type} value={'شكوى'}>شكوى</option>
                                    <option selected={'غير ذلك' == type} value={'غير ذلك'}>غير ذلك</option>
                                </select>
                                {
                                    errorType.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorType}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>جهة الطلب</label>
                                <select onChange={e => setClub(e.target.value)}>
                                    <option value={''}>اختر النادي</option>
                                    {
                                        clubs.map(clubList => <option selected={clubList._id == club} value={clubList._id}>{clubList.name}</option>)
                                    }
                                </select>
                                {
                                    errorClub.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorClub}</span>
                                    </div>
                                }
                            </div>
                            <div style={{
                                gridColumn: "span 3"
                            }}>
                                <label>المحتوى</label>
                                <textarea defaultValue={body} placeholder={'اكتب محتوى المنشور'} onChange={e => setBody(e.target.value)}></textarea>
                                {
                                    errorBody.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorBody}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>مرفقات (اختياري)</label>
                                <input
                                    type={'file'}
                                    onChange={e => {
                                        setImage(e.target.files[0])
                                    }}
                                />
                                {
                                    errorImage.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorImage}</span>
                                    </div>
                                }
                            </div>
                            {
                                session.user.role === "admin"
                                || session.user.role === 'president'
                                || session.user.role === 'coordinator'
                                ? <div>
                                    <label>حالة الطلب</label>
                                    <select onChange={e => setStatus(e.target.value)}>
                                        <option selected={'' == status} value={''}>اختر الحالة</option>
                                        <option selected={'completed' == status} value={'completed'}>مكتمل</option>
                                        <option selected={'canceled' == status} value={'canceled'}>ملغى</option>
                                        <option selected={'pending' == status} value={'pending'}>تحت التنفيذ</option>
                                    </select>
                                    {
                                        errorStatus.length > 0 &&
                                        <div className={Styles.error}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={20}
                                                height={20}
                                                fill="#E06469"
                                                stroke="#E06469"
                                                className="cf-icon-svg"
                                                viewBox="-1.7 0 20.4 20.4"
                                            >
                                                <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                            </svg>
                                            <span>{errorStatus}</span>
                                        </div>
                                    }
                                 </div>
                                : null
                            }
                        </>
                    }
                    {
                        isAddContact && !isFile && isEdit &&
                        <>
                            <div>
                                <label>عنوان الطلب</label>
                                <input
                                    placeholder={'اكتب عنوان الطلب'}
                                    type={'text'}
                                    onChange={e => {
                                        setTitle(e.target.value)
                                    }}
                                    defaultValue={title}
                                />
                                {
                                    errorTitle.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorTitle}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>نوع الطلب</label>
                                <select onChange={e => setType(e.target.value)}>
                                    <option selected={'' == type} value={''}>اختر النوع</option>
                                    <option selected={'تغيير النادي الأساسي' == type} value={'تغيير النادي الأساسي'}>تغيير النادي الأساسي</option>
                                    <option selected={'الجوائز' == type} value={'الجوائز'}>الجوائز</option>
                                    <option selected={'الشهادات' == type} value={'الشهادات'}>الشهادات</option>
                                    <option selected={'شكوى' == type} value={'شكوى'}>شكوى</option>
                                    <option selected={'غير ذلك' == type} value={'غير ذلك'}>غير ذلك</option>
                                </select>
                                {
                                    errorType.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorType}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>جهة الطلب</label>
                                <select onChange={e => setClub(e.target.value)}>
                                    <option value={''}>اختر النادي</option>
                                    {
                                        clubs.map(clubList => <option selected={clubList._id == club} value={clubList._id}>{clubList.name}</option>)
                                    }
                                </select>
                                {
                                    errorClub.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorClub}</span>
                                    </div>
                                }
                            </div>
                            <div style={{
                                gridColumn: "span 3"
                            }}>
                                <label>المحتوى</label>
                                <textarea defaultValue={body} placeholder={'اكتب محتوى المنشور'} onChange={e => setBody(e.target.value)}></textarea>
                                {
                                    errorBody.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorBody}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>مرفقات (اختياري)</label>
                                <input
                                    type={'file'}
                                    onChange={e => {
                                        setImage(e.target.files[0])
                                    }}
                                />
                                {
                                    errorImage.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorImage}</span>
                                    </div>
                                }
                            </div>
                            {
                                session.user.role === "admin"
                                || session.user.role === 'president'
                                || session.user.role === 'coordinator' &&
                                <div>
                                    <label>حالة الطلب</label>
                                    <select onChange={e => setStatus(e.target.value)}>
                                        <option selected={'' == status} value={''}>اختر الحالة</option>
                                        <option selected={'completed' == status} value={'completed'}>مكتمل</option>
                                        <option selected={'canceled' == status} value={'canceled'}>ملغى</option>
                                        <option selected={'pending' == status} value={'pending'}>تحت التنفيذ</option>
                                    </select>
                                    {
                                        errorStatus.length > 0 &&
                                        <div className={Styles.error}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={20}
                                                height={20}
                                                fill="#E06469"
                                                stroke="#E06469"
                                                className="cf-icon-svg"
                                                viewBox="-1.7 0 20.4 20.4"
                                            >
                                                <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                            </svg>
                                            <span>{errorStatus}</span>
                                        </div>
                                    }
                                </div>
                            }
                        </>
                    }
                    {
                        isAddActivity && !isFile && isEdit &&
                        <>
                            <div>
                                <label>عنوان الفعالية</label>
                                <input
                                    placeholder={'اكتب عنوان الفعالية كاملا'}
                                    type={'text'}
                                    onChange={e => {
                                        setTitle(e.target.value)
                                    }}
                                    defaultValue={title}
                                />
                                {
                                    errorTitle.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorTitle}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>مقدم الفعالية</label>
                                <input
                                    placeholder={'اكتب اسم مقدم الفعالية'}
                                    type={'text'}
                                    onChange={e => {
                                        setPresenter(e.target.value)
                                    }}
                                    defaultValue={presenter}
                                />
                                {
                                    errorPresenter.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorPresenter}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>التاريخ</label>
                                <select onChange={e => setDate(e.target.value)}>
                                    <option value={''}>اختر التاريخ</option>
                                    {
                                        dates.map(dateList => <option selected={dateList == date} value={dateList}>{dateList}</option>)
                                    }
                                </select>
                                {
                                    errorDate.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorDate}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>من</label>
                                <select onChange={e => setFrom(e.target.value)}>
                                    <option value={''}>اختر بداية الوقت</option>
                                    {
                                        times.map(time => <option selected={time == from} value={time}>{time}</option>)
                                    }
                                </select>
                                {
                                    errorFrom.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorFrom}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>إلى</label>
                                <select onChange={e => setTo(e.target.value)}>
                                    <option value={''}>اختر نهاية الوقت</option>
                                    {
                                        times.map(time => <option selected={time == to} value={time}>{time}</option>)
                                    }
                                </select>
                                {
                                    errorTo.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorTo}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>المكان</label>
                                <select onChange={e => setLocation(e.target.value)}>
                                    <option value={''}>اختر المكان</option>
                                    {
                                        locations.map(locationList => <option selected={locationList._id == location} value={locationList._id}>{locationList.name}</option>)
                                    }
                                </select>
                                {
                                    errorLocation.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorLocation}</span>
                                    </div>
                                }
                            </div>
                            {
                                session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                                    ? <div>
                                        <label>النادي</label>
                                        <select onChange={e => setClub(e.target.value)}>
                                            <option value={''}>اختر النادي</option>
                                            {
                                                clubs.map(clubList => <option selected={clubList._id == club} value={clubList._id}>{clubList.name}</option>)
                                            }
                                        </select>
                                        {
                                            errorClub.length > 0 &&
                                            <div className={Styles.error}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    fill="#E06469"
                                                    stroke="#E06469"
                                                    className="cf-icon-svg"
                                                    viewBox="-1.7 0 20.4 20.4"
                                                >
                                                    <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                </svg>
                                                <span>{errorClub}</span>
                                            </div>
                                        }
                                    </div>
                                    : null
                            }
                            <div>
                                <label>النوع</label>
                                <select onChange={e => setType(e.target.value)}>
                                    <option value={''}>اختر النوع</option>
                                    {
                                        types.map(typeList => <option selected={typeList._id == type} value={typeList._id}>{typeList.name}</option>)
                                    }
                                </select>
                                {
                                    errorType.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorType}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الضيافة</label>
                                <select onChange={e => setHospitality(e.target.value)}>
                                    <option value={''}>اختر حالة الضيافة</option>
                                    <option selected={hospitality == true} value={true}>نعم</option>
                                    <option selected={hospitality == false} value={false}>لا</option>
                                </select>
                                {
                                    errorHospitality.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorHospitality}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>البروجتر</label>
                                <select onChange={e => setProjector(e.target.value)}>
                                    <option value={''}>اختر حالة البروجكتر</option>
                                    <option selected={projector == true} value={true}>نعم</option>
                                    <option selected={projector == false} value={false}>لا</option>
                                </select>
                                {
                                    errorProjector.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorProjector}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>الاشتراك</label>
                                <select onChange={e => setIsShare(e.target.value)}>
                                    <option value={''}>اختر حالة الاشتراك</option>
                                    <option selected={isShare === "true"} value={true}>نعم</option>
                                    <option selected={isShare === "false"} value={false}>لا</option>
                                </select>
                                {
                                    errorIsShare.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorIsShare}</span>
                                    </div>
                                }
                            </div>
                            {
                                isShare === "true"
                                    ? <div>
                                        <label>مشتركة مع من؟</label>
                                        <select onChange={e => setClubShare(e.target.value)}>
                                            <option value={''}>اختر النادي</option>
                                            {
                                                clubs.map(clubList => clubList.name != "---" && clubList.name != "فريق الإدارة" && clubList._id != club && <option selected={clubShare == clubList._id} value={clubList._id}>{clubList.name}</option>)
                                            }
                                        </select>
                                        {
                                            errorClubShare.length > 0 &&
                                            <div className={Styles.error}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    fill="#E06469"
                                                    stroke="#E06469"
                                                    className="cf-icon-svg"
                                                    viewBox="-1.7 0 20.4 20.4"
                                                >
                                                    <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                                </svg>
                                                <span>{errorClubShare}</span>
                                            </div>
                                        }
                                    </div>
                                    : null
                            }
                            <div>
                                <label>الخطاب</label>
                                <select onChange={e => setIsDiscourse(e.target.value)}>
                                    <option value={''}>اختر حالة الخطاب</option>
                                    <option selected={isDiscourse == true} value={true}>نعم</option>
                                    <option selected={isDiscourse == true} value={false}>لا</option>
                                </select>
                                {
                                    errorIsDiscourse.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorIsDiscourse}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>التصميم</label>
                                <select onChange={e => setIsDesign(e.target.value)}>
                                    <option value={''}>اختر حالة التصميم</option>
                                    <option selected={isDesign == true} value={true}>نعم</option>
                                    <option selected={isDesign == false} value={false}>لا</option>
                                </select>
                                {
                                    errorIsDesign.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorIsDesign}</span>
                                    </div>
                                }
                            </div>
                            {
                                session.user.role === "admin"
                                || session.user.role === 'president'
                                || session.user.role === 'coordinator' &&
                                <div>
                                    <label>الحالة</label>
                                    <select onChange={e => setStatus(e.target.value)}>
                                        <option value={''}>اختر حالة الفعالية</option>
                                        <option selected={status == 'أقيمت'} value={'أقيمت'}>أقيمت</option>
                                        <option selected={status == 'لم تقم'} value={'لم تقم'}>لم تقم</option>
                                        <option selected={status == 'ملغاة'} value={'ملغاة'}>ملغاة</option>
                                        <option selected={status == 'مؤجلة'} value={'مؤجلة'}>مؤجلة</option>
                                        <option selected={status == 'تم الطلب'} value={'تم الطلب'}>تم الطلب</option>
                                        <option selected={status == 'تم الحجز'} value={'تم الحجز'}>تم الحجز</option>
                                    </select>
                                    {
                                        errorStatus.length > 0 &&
                                        <div className={Styles.error}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={20}
                                                height={20}
                                                fill="#E06469"
                                                stroke="#E06469"
                                                className="cf-icon-svg"
                                                viewBox="-1.7 0 20.4 20.4"
                                            >
                                                <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                            </svg>
                                            <span>{errorStatus}</span>
                                        </div>
                                    }
                                </div>
                            }
                            <div style={{
                                gridColumn: "span 3"
                            }}>
                                <label>ملاحظات</label>
                                <textarea defaultValue={notes} placeholder={'ملاحظات توجهها لفريق الإشراف؟'} onChange={e => setNotes(e.target.value)}></textarea>
                                {
                                    errorNotes.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorNotes}</span>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {
                        isFile && !isEdit &&
                        <div style={{
                            gridColumn: "span 3"
                        }}>
                            <label>ملف اكسل</label>
                            <input
                                type={"file"}
                                onChange={e => importExcel(e)}
                            />
                            {
                                errorFile.length > 0 &&
                                <div className={Styles.error}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        fill="#E06469"
                                        stroke="#E06469"
                                        className="cf-icon-svg"
                                        viewBox="-1.7 0 20.4 20.4"
                                    >
                                        <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                    </svg>
                                    <span>{errorFile}</span>
                                </div>
                            }
                        </div>
                    }

                </div>
                {
                    error.length > 0 &&
                    <span style={{
                        textAlign: 'center',
                        color: '#eb5151',
                        display: "block",
                        margin: "10px 0",
                        fontSize: "14px",
                    }}>{error}</span>
                }
                {
                    success.length > 0 &&
                    <span style={{
                        textAlign: 'center',
                        color: 'green',
                        display: "block",
                        margin: "10px 0",
                        fontSize: "14px",
                    }}>{success}</span>
                }
                {
                    loading == true
                        ?(
                            <button style={{
                                width: 'fit-content',
                            }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={30}
                                    height={30}
                                    fill="none"
                                    className={Styles.loader}
                                    viewBox="0 0 16 16"
                                >
                                    <g fill="#fff" fillRule="evenodd" clipRule="evenodd">
                                        <path
                                            d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"
                                            opacity={0.2}
                                        />
                                        <path d="M7.25.75A.75.75 0 0 1 8 0a8 8 0 0 1 8 8 .75.75 0 0 1-1.5 0A6.5 6.5 0 0 0 8 1.5a.75.75 0 0 1-.75-.75z" />
                                    </g>
                                </svg>
                            </button>
                        ):(
                            isFile
                                ? <button disabled={done == false ? true : false} style={done == false ? {
                                        backgroundColor: "black",
                                        color: "white"
                                    } : null}>
                                        {
                                            done == false
                                                ? "يتم الآن تجهيز الملف..."
                                                : 'حفظ الملف'
                                        }
                                    </button>
                                : isAddUser
                                    ? isEdit
                                        ? <button>تعديل الطالب</button>
                                        : <button>حفظ الطالب</button>
                                    : isAddActivity
                                        ? isEdit
                                            ? <button>تعديل الفعالية</button>
                                            : <button>حفظ الفعالية</button>
                                        : isAddPosts
                                            ? isEdit
                                                ? <button>تعديل المنشور</button>
                                                : <button>حفظ المنشور</button>
                                            : isAddContact
                                                ? isEdit
                                                    ? <button>تعديل الطلب</button>
                                                    : <button>حفظ الطلب</button>
                                                : isAddReports
                                                    ? isEdit
                                                        ? <button>تعديل التقرير</button>
                                                        : <button>حفظ التقرير</button>
                                                    : isProfile
                                                        ? <button>تحديث الحساب</button>
                                                        : isEditPassword || isEditPasswordFromShow
                                                            ? <button>تحديث كلمة المرور</button>
                                                            : isRegister
                                                                ? <button>تسجيل الحساب</button>
                                                                : isAddAttend
                                                                    ? <button>حفظ التقييمات</button>
                                                                    : isAddDesign
                                                                        ? isEdit
                                                                            ? <button>تعديل التصميم</button>
                                                                            : <button>حفظ التصميم</button>
                                                                        : isAddDiscourses
                                                                            ? isEdit
                                                                                ? <button>تعديل الخطاب</button>
                                                                                : <button>حفظ الخطاب</button>
                                                                            : null
                        )

                }
            </form>
        </section>
    )
}
