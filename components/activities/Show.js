import Styles from "../../styles/profile/index.module.css";
import {useDispatch, useSelector} from "react-redux";
import Image from 'next/image';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBell,
    faCheck,
    faClock,
    faInfo,
    faUnlockKeyhole,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import Alert from "../Alert";
import HeaderPages from "../../components/HeaderPages";
import Table from "../../components/Table";
import {useEffect, useState} from "react";
import useSWR from "swr";
import axios from "axios";
import Loading from "../../components/Loading";
import swal from "sweetalert";
import Comments from "../../components/Comments";
import {useSession} from "next-auth/react";
import {profilesActions} from "../../redux/slices/profilesSlice";
import Close from "../../components/Close";
import FormUser from "../../components/FormUser";
const fetcher = url => axios.get(url).then(res => res.data);

export default ({permissionsList, isStudent = false, isActivity = false, isPost = false, isContact = false, isReview = false, isAward = false, isReport = false, isDiscourse = false, isCertificate = false}) => {
    const activity = useSelector(state => state.activities.show)
    const {data: session} = useSession()
    const isEditPassword = useSelector(state => state.profiles.isEditPassword)
    const dispatch = useDispatch()

    const [certificates, setCertificates]  = useState([])
    const [awards, setAwards]  = useState([])

    const [loadingCertificates, setLoadingCertificates] = useState(true)
    const [loadingAwards, setLoadingAwards] = useState(true)
    const student = useSelector(state => state.students.show)
    const post = useSelector(state => state.posts.show)
    const report = useSelector(state => state.reports.show)
    const contact = useSelector(state => state.contacts.show)
    const discourse = useSelector(state => state.discourses.show)
    const review = useSelector(state => state.reviews.show)
    const studentAward = useSelector(state => state.awardsAndActivities.show)
    const studentCertificate = useSelector(state => state.certificatesAndActivities.show)
    const { data, isError, isLoading } = isReport || !session ? { data: null, isError: null, isLoading: null } : useSWR(isPost ? `/posts/comments?postId=${post.id || ''}` : `/contacts/replies?contactId=${contact.id || ''}`, fetcher)
    const [body, setBody] = useState('')
    const [errorBody, setErrorBody] = useState('')
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if(isStudent){
            axios.get(`/students/getCertificates?studentId=${student.id}`).then(res => {
                if(res.status == 200){
                    setCertificates(res.data.certificates)
                    setLoadingCertificates(false)
                }
            })

            axios.get(`/students/getAwards?studentId=${student.id}`).then(res => {
                if(res.status == 200){
                    setAwards(res.data.awards)
                    setLoadingAwards(false)
                }
            })
        }
    }, [])
    function handlerSubmitAddReply(e){
        e.preventDefault()
        setLoading(true)
        if(body.length == 0){
            setErrorBody('محتوى الرد مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorBody('')
        }
        setLoading(true)
        axios.post(`/contacts/replies/add`, {
            contactId: contact.id,
            user: session.user.id,
            body: body,
        })
            .then( async (res) => {
                if(res.status === 201 ){
                    await swal({
                        title: 'تم!',
                        text: res.data.mess,
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                    e.target.reset()
                    setLoading(false)
                }else {
                    await swal({
                        title: 'خطأ!',
                        text: res.data.mess,
                        icon: "error",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                }
            })
    }
    function handlerSubmitAddComment(e){
        e.preventDefault()
        setLoading(true)
        if(body.length == 0){
            setErrorBody('محتوى الرد مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorBody('')
        }
        setLoading(true)
        axios.post(`/posts/comments/add`, {
            postId: post.id,
            user: session.user.id,
            body: body,
        })
            .then( async (res) => {
                if(res.status === 201 ){
                    await swal({
                        title: 'تم!',
                        text: res.data.mess,
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                    e.target.reset()
                    setLoading(false)
                }else {
                    await swal({
                        title: 'خطأ!',
                        text: res.data.mess,
                        icon: "error",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                }
            })
    }
    function getAttended(attended){
        switch (attended) {
            case "جميعها":
                return 5
                break
            case "أغلبها":
                return 4
                break
            case "نصفها":
                return 3
                break
            case "بعضها":
                return 2
                break
            case "لا شيء منها":
                return 1
                break
        }
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
    const benefit = (review.benefit * 100) / 5
    const lecturer = (review.lecturer * 100) / 5
    const attended = (getAttended(review.attended) * 100) / 5
    function getStatus(status){
        switch (status) {
            case "أقيمت":
                return (<Alert type={'success'} title={`الفعالية أقيمت`} icon={<FontAwesomeIcon icon={faCheck} />} msg={'تمت إقامة هذه الفعالية بنجاح.'} />)
                break
            case "تم الحجز":
                return (<Alert type={'success'} title={`الفعالية تم حجزها`} icon={<FontAwesomeIcon icon={faCheck} />} msg={'تم تأكيد حجز هذه الفعالية بنجاح.'} />)
                break
            case "تم الطلب":
                return (<Alert type={'warning'} title={`الفعالية تحت الطلب`} icon={<FontAwesomeIcon icon={faInfo} />} msg={'تم طلب حجز الفعالية بنجاح، ويجري الآن النظر فيها من فريق الإشراف.'} />)
                break
            case "ملغاة":
                return (<Alert type={'error'} title={`الفعالية ألغيت`} icon={<FontAwesomeIcon icon={faXmark} />} msg={'تم إلغاء هذه الفعالية، رجاء مراجعة فريق الإشراف لمعرفة السبب.'} />)
                break
            case "لم تقم":
                return (<Alert type={'error'} title={`الفعالية لم تقم`} icon={<FontAwesomeIcon icon={faXmark} />} msg={'لم تقم هذه الفعالية، رجاء مراجعة فريق الإشراف لمعرفة السبب.'} />)
                break
            case "مؤجلة":
                return (<Alert type={'error'} title={`الفعالية مؤجلة`} icon={<FontAwesomeIcon icon={faClock} />} msg={'تم تأجيل هذه الفعالية، رجاء مراجعة فريق الإشراف لمعرفة السبب.'} />)
                break
        }
    }
    const styleTitle = {
        fontSize: '16px',
        marginBottom: '-10px',
        color: '#85898c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    function getActivityElement(){
        return (
            <div className={Styles.profile}>
                <div>
                    <ul className={Styles.activity} style={{
                        width: '100%'
                    }}>
                        <li>
                            <div>
                                <span>العنوان</span>
                                <span>{activity.title}</span>
                            </div>
                            <div>
                                <span>المقدم</span>
                                <span>{activity.presenter}</span>
                            </div>
                            <div>
                                <span>النادي</span>
                                <span>{activity.club}</span>
                            </div>
                        </li>
                        <hr />
                        <li>
                            <div>
                                <span>الموقع</span>
                                <span>{activity.location}</span>
                            </div>
                            <div>
                                <span>النوع</span>
                                <span>{activity.type}</span>
                            </div>
                            <div>
                                <span>التاريخ</span>
                                <span>{activity.date}</span>
                            </div>
                        </li>
                        <hr />
                        <li>
                            <div>
                                <span>من</span>
                                <span>{activity.from}</span>
                            </div>
                            <div>
                                <span>إلى</span>
                                <span>{activity.to}</span>
                            </div>
                            <div>
                                <span>حالة الاشتراك</span>
                                <span>{activity.isShare}</span>
                            </div>
                        </li>
                        <hr />
                        <li>
                            <div>
                                <span>الضيافة</span>
                                <span>{activity.hospitality}</span>
                            </div>
                            <div>
                                <span>البروجكتر</span>
                                <span>{activity.projector}</span>
                            </div>
                            <div>
                                <span>الحالة</span>
                                <span>{activity.status}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
    function getDiscourseElement(){
        return (
            <div className={Styles.profile}>
                <div>
                    <ul className={Styles.activity} style={{
                        width: '100%'
                    }}>
                        <li>
                            <div>
                                <span>المقدم</span>
                                <span>{discourse.name}</span>
                            </div>
                            <div>
                                <span>الرتبة</span>
                                <span>{discourse.surname}</span>
                            </div>
                            <div>
                                <span>الجهة</span>
                                <span>{discourse.side}</span>
                            </div>
                        </li>
                        <hr />
                        <li>
                            <div>
                                <span>حالة الخطاب</span>
                                <span>{getStatusDiscourse(discourse.status)}</span>
                            </div>
                            <div>
                                <span>العنوان</span>
                                <span>{discourse.title}</span>
                            </div>
                            <div>
                                <span>النادي</span>
                                <span>{discourse.club}</span>
                            </div>
                        </li>
                        <hr />
                        <li>
                            <div>
                                <span>الموقع</span>
                                <span>{discourse.location}</span>
                            </div>
                            <div>
                                <span>النوع</span>
                                <span>{discourse.type}</span>
                            </div>
                            <div>
                                <span>التاريخ</span>
                                <span>{discourse.date}</span>
                            </div>
                        </li>
                        <hr />
                        <li>
                            <div>
                                <span>من</span>
                                <span>{discourse.from}</span>
                            </div>
                            <div>
                                <span>إلى</span>
                                <span>{discourse.to}</span>
                            </div>
                            <div>
                                <span>حالة الاشتراك</span>
                                <span>{discourse.isShare}</span>
                            </div>
                        </li>
                        <hr />
                        <li>
                            <div>
                                <span>الضيافة</span>
                                <span>{discourse.hospitality}</span>
                            </div>
                            <div>
                                <span>البروجكتر</span>
                                <span>{discourse.projector}</span>
                            </div>
                            <div>
                                <span>الفعالية</span>
                                <span>{discourse.statusActivity}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
    function getStudentElement(){
        return (
            <>
                {/*<section className={Styles.analysis}>*/}
                {/*    <div>*/}
                {/*        <span>*/}
                {/*            <FontAwesomeIcon icon={faAddressCard} />*/}
                {/*        </span>*/}
                {/*        <span>مكتملة</span>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <span>*/}
                {/*            <FontAwesomeIcon icon={faAward} />*/}
                {/*        </span>*/}
                {/*        <span>13</span>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <span>*/}
                {/*            <FontAwesomeIcon icon={faNewspaper} />*/}
                {/*        </span>*/}
                {/*        <span>44</span>*/}
                {/*    </div>*/}
                {/*</section>*/}
                {
                    isEditPassword
                        ? <>
                            <Close action={profilesActions.isEditPassword} />
                            <FormUser userId={student.id} session={session} isEditPasswordFromShow={true} repeat={2} />
                        </>
                        : <>
                            <span style={styleTitle}>البيانات الشخصية</span>
                            <div className={Styles.profile}>
                                <div>
                                    <Image src={`/uploads/files/${student.avatar}`} width={100} height={100}/>
                                    <div>
                                        <span>{student.username}</span>
                                        <span>{student.email}</span>
                                    </div>
                                    <section onClick={e => {
                                        dispatch(profilesActions.isEditPassword(true))
                                    }}>
                                        <span>تغيير كلمة المرور</span>
                                        <FontAwesomeIcon icon={faUnlockKeyhole} />
                                    </section>
                                </div>
                                <div>
                                    <ul className={Styles.pro}>
                                        <li>
                                            <div>
                                                <span>الاسم</span>
                                                <span>{student.name}</span>
                                            </div>
                                            <div>
                                                <span>الهوية</span>
                                                <span>{student.idNumber}</span>
                                            </div>
                                        </li>
                                        <hr />
                                        <li>
                                            <div>
                                                <span>النادي</span>
                                                <span>{student.club}</span>
                                            </div>
                                            <div>
                                                <span>الكلية</span>
                                                <span>{student.college}</span>
                                            </div>
                                        </li>
                                        <hr />
                                        <li>
                                            <div>
                                                <span>المستوى</span>
                                                <span>{student.level}</span>
                                            </div>
                                            <div>
                                                <span>الدولة</span>
                                                <span>{student.country}</span>
                                            </div>
                                        </li>
                                        <hr />
                                        <li>
                                            <div>
                                                <span>رقم الواتساب</span>
                                                <span>{student.whatsapp}</span>
                                            </div>
                                            <div>
                                                <span>نوع الحساب</span>
                                                <span>{getType(student.role)}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </>
                }
                <span style={styleTitle}>
                    <span>الشهادات</span>
                    <span>{loadingCertificates ? 0 : certificates.docs.length}</span>
                </span>
                <section>
                    {
                        loadingCertificates
                            ? <Loading />
                            : certificates.docs.length === 0
                                ? <Alert type={'error'} title={'لا توجد شهادة لهذا الطالب!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    permissions={session.user.permissions}
                                    headers={["الاسم", "الرقم الجامعي", "الجنسية", "النادي", `${session.user.permissions.downloadCertificate.status ? "خيارات" : "null"}`]}
                                    isCertificate={true}
                                    isPaginate={false}
                                    awardClubName={null}
                                    isFull={true}
                                    data={certificates}
                                />
                    }
                </section>
                <span style={styleTitle}>
                    <span>الجوائز</span>
                    <span>{loadingAwards ? 0 : awards.docs.length}</span>
                </span>
                <section>
                    {
                        loadingAwards
                            ? <Loading />
                            : awards.docs.length == 0
                                ? <Alert type={'error'} title={'لا توجد جائزة لهذا الطالب!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    permissions={session.user.permissions}
                                    headers={["الاسم", "الرقم الجامعي", "الجنسية", "النادي", "نوع الجائزة", "المنسق", "الحالة"]}
                                    isAwardAndActivity={true}
                                    isPaginate={false}
                                    isAllAwards={true}
                                    awardClubName={null}
                                    data={awards}
                                />
                    }
                </section>
                {
                    session.user.permissions.editPermission.status &&
                        session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                            ? <>
                            <span style={styleTitle}>الصلاحيات</span>
                            <section className={Styles.permissions}>
                                <div>
                                    <span>الفعاليات</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addActivity?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addActivity",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addActivity'}
                                                defaultChecked={permissionsList?.addActivity?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editActivity?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editActivity",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editActivity'}
                                                defaultChecked={permissionsList?.editActivity?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showActivity?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showActivity",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showActivity'}
                                                defaultChecked={permissionsList?.showActivity?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deleteActivity?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deleteActivity",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deleteActivity'}
                                                defaultChecked={permissionsList?.deleteActivity?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>التصاميم</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addDesign?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addDesign",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addDesign'}
                                                defaultChecked={permissionsList?.addDesign?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editDesign?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editDesign",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editDesign'}
                                                defaultChecked={permissionsList?.editDesign?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showDesign?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showDesign",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showDesign'}
                                                defaultChecked={permissionsList?.showDesign?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deleteDesign?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deleteDesign",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deleteDesign'}
                                                defaultChecked={permissionsList?.deleteDesign?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الخطابات</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addDiscourse?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addDiscourse",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addDiscourse'}
                                                defaultChecked={permissionsList?.addDiscourse?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editDiscourse?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editDiscourse",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editDiscourse'}
                                                defaultChecked={permissionsList?.editDiscourse?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showDiscourse?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showDiscourse",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showDiscourse'}
                                                defaultChecked={permissionsList?.showDiscourse?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deleteDiscourse?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deleteDiscourse",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deleteDiscourse'}
                                                defaultChecked={permissionsList?.deleteDiscourse?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الطلاب</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addStudent?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addStudent",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addStudent'}
                                                defaultChecked={permissionsList?.addStudent?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editStudent?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editStudent",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editStudent'}
                                                defaultChecked={permissionsList?.editStudent?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showStudent?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showStudent",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showStudent'}
                                                defaultChecked={permissionsList?.showStudent?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deleteStudent?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deleteStudent",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deleteStudent'}
                                                defaultChecked={permissionsList?.deleteStudent?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>المنشورات</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addPost?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addPost",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addPost'}
                                                defaultChecked={permissionsList?.addPost?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editPost?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editPost",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editPost'}
                                                defaultChecked={permissionsList?.editPost?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showPost?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showPost",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showPost'}
                                                defaultChecked={permissionsList?.showPost?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deletePost?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deletePost",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deletePost'}
                                                defaultChecked={permissionsList?.deletePost?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الطلبات</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addContact?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addContact",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addContact'}
                                                defaultChecked={permissionsList?.addContact?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editContact?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editContact",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editContact'}
                                                defaultChecked={permissionsList?.editContact?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showContact?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showContact",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showContact'}
                                                defaultChecked={permissionsList?.showContact?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deleteContact?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deleteContact",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deleteContact'}
                                                defaultChecked={permissionsList?.deleteContact?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>التقارير</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addReport?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addReport",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addReport'}
                                                defaultChecked={permissionsList?.addReport?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editReport?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editReport",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editReport'}
                                                defaultChecked={permissionsList?.editReport?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showReport?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showReport",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showReport'}
                                                defaultChecked={permissionsList?.showReport?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deleteReport?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deleteReport",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deleteReport'}
                                                defaultChecked={permissionsList?.deleteReport?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الجوائز</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addAward?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addAward",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addAward'}
                                                defaultChecked={permissionsList?.addAward?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editAward?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editAward",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editAward'}
                                                defaultChecked={permissionsList?.editAward?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showAward?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showAward",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showAward'}
                                                defaultChecked={permissionsList?.showAward?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deleteAward?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deleteAward",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deleteAward'}
                                                defaultChecked={permissionsList?.deleteAward?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الشهادات</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addCertificate?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addCertificate",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addCertificate'}
                                                defaultChecked={permissionsList?.addCertificate?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editCertificate?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editCertificate",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editCertificate'}
                                                defaultChecked={permissionsList?.editCertificate?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showCertificate?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showCertificate",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showCertificate'}
                                                defaultChecked={permissionsList?.showCertificate?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.downloadCertificate?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "downloadCertificate",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'downloadCertificate'}
                                                defaultChecked={permissionsList?.downloadCertificate?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deleteCertificate?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deleteCertificate",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deleteCertificate'}
                                                defaultChecked={permissionsList?.deleteCertificate?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الأندية</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addClub?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addClub",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addClub'}
                                                defaultChecked={permissionsList?.addClub?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editClub?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editClub",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editClub'}
                                                defaultChecked={permissionsList?.editClub?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showClub?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showClub",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showClub'}
                                                defaultChecked={permissionsList?.showClub?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deleteClub?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deleteClub",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deleteClub'}
                                                defaultChecked={permissionsList?.deleteClub?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>التعليقات/الردود</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addComment?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addComment",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addComment'}
                                                defaultChecked={permissionsList?.addComment?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editComment?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editComment",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editComment'}
                                                defaultChecked={permissionsList?.editComment?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showComment?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showComment",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showComment'}
                                                defaultChecked={permissionsList?.showComment?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deleteComment?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deleteComment",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deleteComment'}
                                                defaultChecked={permissionsList?.deleteComment?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الصلاحيات</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addPermission?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addPermission",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addPermission'}
                                                defaultChecked={permissionsList?.addPermission?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editPermission?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editPermission",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editPermission'}
                                                defaultChecked={permissionsList?.editPermission?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showPermission?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showPermission",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showPermission'}
                                                defaultChecked={permissionsList?.showPermission?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deletePermission?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deletePermission",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deletePermission'}
                                                defaultChecked={permissionsList?.deletePermission?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>التحضير</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addAttend?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addAttend",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addAttend'}
                                                defaultChecked={permissionsList?.addAttend?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editAttend?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editAttend",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editAttend'}
                                                defaultChecked={permissionsList?.editAttend?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showAttend?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showAttend",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showAttend'}
                                                defaultChecked={permissionsList?.showAttend?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.deleteAttend?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "deleteAttend",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'deleteAttend'}
                                                defaultChecked={permissionsList?.deleteAttend?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                            </section>
                        </>
                            : <>
                            <span style={styleTitle}>الصلاحيات</span>
                            <Alert type={'warning'} title={'تنبيه!'} icon={<FontAwesomeIcon icon={faBell} />} msg={'بعض الصلاحيات لن يتم تفعيلها إلا إذا كان الطالب برتبة "مسؤول أو نائب".'} />
                            <section className={Styles.permissions}>
                                <div>
                                    <span>الفعاليات</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addActivity?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addActivity",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addActivity'}
                                                defaultChecked={permissionsList?.addActivity?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showActivity?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showActivity",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showActivity'}
                                                defaultChecked={permissionsList?.showActivity?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>التصاميم</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addDesign?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addDesign",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addDesign'}
                                                defaultChecked={permissionsList?.addDesign?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showDesign?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showDesign",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showDesign'}
                                                defaultChecked={permissionsList?.showDesign?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الخطابات</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addDiscourse?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addDiscourse",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addDiscourse'}
                                                defaultChecked={permissionsList?.addDiscourse?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showDiscourse?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showDiscourse",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showDiscourse'}
                                                defaultChecked={permissionsList?.showDiscourse?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الطلاب</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addStudent?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addStudent",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addStudent'}
                                                defaultChecked={permissionsList?.addStudent?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showStudent?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showStudent",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showStudent'}
                                                defaultChecked={permissionsList?.showStudent?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>المنشورات</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addPost?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addPost",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addPost'}
                                                defaultChecked={permissionsList?.addPost?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showPost?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showPost",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showPost'}
                                                defaultChecked={permissionsList?.showPost?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الطلبات</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addContact?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addContact",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addContact'}
                                                defaultChecked={permissionsList?.addContact?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showContact?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showContact",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showContact'}
                                                defaultChecked={permissionsList?.showContact?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>التقارير</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addReport?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addReport",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addReport'}
                                                defaultChecked={permissionsList?.addReport?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showReport?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showReport",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showReport'}
                                                defaultChecked={permissionsList?.showReport?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الجوائز</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.showAward?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showAward",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showAward'}
                                                defaultChecked={permissionsList?.showAward?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الشهادات</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.showCertificate?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showCertificate",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showCertificate'}
                                                defaultChecked={permissionsList?.showCertificate?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.downloadCertificate?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "downloadCertificate",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'downloadCertificate'}
                                                defaultChecked={permissionsList?.downloadCertificate?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>الأندية</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.editClub?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editClub",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editClub'}
                                                defaultChecked={permissionsList?.editClub?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showClub?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showClub",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showClub'}
                                                defaultChecked={permissionsList?.showClub?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>التعليقات/الردود</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.editComment?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editComment",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editComment'}
                                                defaultChecked={permissionsList?.editComment?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showComment?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showComment",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showComment'}
                                                defaultChecked={permissionsList?.showComment?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span>التحضير</span>
                                    <ul>
                                        <li>
                                            <span>{permissionsList?.addAttend?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "addAttend",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'addAttend'}
                                                defaultChecked={permissionsList?.addAttend?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.editAttend?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "editAttend",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'editAttend'}
                                                defaultChecked={permissionsList?.editAttend?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                        <hr/>
                                        <li>
                                            <span>{permissionsList?.showAttend?.label}</span>
                                            <input
                                                onChange={e => {
                                                    axios.post(`/students/permissions/edit`, {
                                                        studentId: student.id,
                                                        status: e.target.checked,
                                                        label: "showAttend",
                                                    }).then(async res => {
                                                        if(res.status === 201){
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
                                                }}
                                                name={'showAttend'}
                                                defaultChecked={permissionsList?.showAttend?.status}
                                                type={"checkbox"}
                                            />
                                        </li>
                                    </ul>
                                </div>
                            </section>
                        </>
                }
            </>
        )
    }
    function getPostElement(){
        return (
            <>
                <section className={Styles.posts}>
                    <div>
                        <div>
                            <Image src={`/uploads/files/${post.user.avatar}`} width={100} height={100}/>
                            <div>
                                <span>{post.user.name}</span>
                                <span>{post.club}</span>
                            </div>
                        </div>
                        <div>
                            <span>{post.createdAt}</span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h5>{post.title}</h5>
                        </div>
                        <div>
                            <p>{post.body}</p>
                        </div>
                        {
                            post.image != null
                                ? <div style={{
                                    width: "100%",
                                    overflow: "hidden",
                                    borderRadius: "var(--border-radius)",
                                    border: "var(--border-primary)",
                                }}>
                                    <Image style={{
                                        width: "100%",
                                        height: "auto",
                                        overflow: "hidden",
                                        objectFit: "cover"
                                    }} src={`/uploads/files/${post.image}`} width={100} height={100}/>
                                </div>
                                : null
                        }
                    </div>
                    <div>
                        {
                            session
                                ? <form onSubmit={handlerSubmitAddComment}>
                                    <span>إضافة تعليق</span>
                                    <textarea onChange={e => setBody(e.target.value)} placeholder={'اكتب محتوى التعليق'}></textarea>
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
                                    <Alert type={'warning'} title={'تنبيه!'} icon={<FontAwesomeIcon icon={faBell} />} msg={'لن يظهر تعليقك على المنشور إلا إذا وافقت عليه إدارة النادي.'} />
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
                                            ): <button>إضافة</button>
                                    }
                                </form>
                                : <Alert type={'warning'} title={'تنبيه!'} icon={<FontAwesomeIcon icon={faBell} />} msg={'يجب تسجيل الدخول حتى تستطيع التعليق على هذا المنشور.'} />
                        }
                    </div>
                    {
                        session
                            ? <div>
                                <span>التعليقات</span>
                                {
                                    isLoading
                                        ? <Loading />
                                        : data.success == false
                                            ? <Alert type={'error'} title={'لا توجد تعليقات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                            : data.comments.map((comment, key) =>
                                                <Comments key={key} commentId={comment._id} user={comment.user.name} club={comment.user.club.name} date={comment.createdAt.split('T')[0]} route={''} image={`/uploads/files/${comment.user.avatar}`} body={comment.body} />
                                            )
                                }
                            </div>
                            : null
                    }
                </section>
            </>
        )
    }
    function getReportElement(){
        return (
            <>
                <section className={Styles.posts}>
                    <div>
                        <div>
                            <Image src={`/uploads/files/${report.user.avatar}`} width={100} height={100}/>
                            <div>
                                <span>{report.user.name}</span>
                                <span>{report.club}</span>
                            </div>
                        </div>
                        <div>
                            <span>{report.createdAt}</span>
                            <span>العدد: {report.numbers}</span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h5>{report.activity}</h5>
                        </div>
                        <div>
                            <p>{report.summary}</p>
                        </div>
                        {
                            report.notes !== "null"
                                ? <div>
                                    <p>{report.notes}</p>
                                </div>
                                : null
                        }
                        {
                            report.images != null
                                ? <div className={Styles.images}>
                                    {
                                        report.images.split(',').map((image, key) =>
                                            <Image style={
                                                key === 0
                                                    ? {
                                                        width: "100%",
                                                        height: "auto",
                                                        overflow: "hidden",
                                                        objectFit: "cover",
                                                        borderBottom: "var(--border-primary)",
                                                        borderBottomLeftRadius: "var(--border-radius)",
                                                        borderLeft: "var(--border-primary)",
                                                    }
                                                    : key === 1
                                                        ? {
                                                            width: "100%",
                                                            height: "auto",
                                                            overflow: "hidden",
                                                            objectFit: "cover",
                                                            borderBottom: "var(--border-primary)",
                                                            borderBottomRightRadius: "var(--border-radius)",
                                                            borderRight: "var(--border-primary)",
                                                        }
                                                        : key === 2
                                                            ? {
                                                                width: "100%",
                                                                height: "auto",
                                                                overflow: "hidden",
                                                                objectFit: "cover",
                                                                borderTop: "var(--border-primary)",
                                                                borderTopLeftRadius: "var(--border-radius)",
                                                                borderLeft: "var(--border-primary)",
                                                            }
                                                            : key === 3
                                                                ? {
                                                                    width: "100%",
                                                                    height: "auto",
                                                                    overflow: "hidden",
                                                                    objectFit: "cover",
                                                                    borderTop: "var(--border-primary)",
                                                                    borderTopRightRadius: "var(--border-radius)",
                                                                    borderRight: "var(--border-primary)",
                                                                }
                                                                : null
                                            } src={`/uploads/files/${image}`} width={100} height={100}/>
                                        )
                                    }
                                </div>
                                : null
                        }
                    </div>
                </section>
            </>
        )
    }
    function getContactElement(){
        return (
            <>
                <section className={Styles.posts}>
                    <div>
                        <div>
                            <Image src={`/uploads/files/${contact.user.avatar}`} width={100} height={100}/>
                            <div>
                                <span>{contact.user.name}</span>
                                <span>{'إلى: ' + contact.club}</span>
                                <span>{'النوع: ' + contact.type}</span>
                            </div>
                        </div>
                        <div>
                            <span>{contact.createdAt}</span>
                            <span>{'الحالة: ' + getStatusContact(contact.status)}</span>
                            {
                                session.user.role === "admin"
                                || session.user.role === 'president'
                                || session.user.role === 'coordinator'
                                    ? <div>
                                        <select onChange={e => {
                                            axios.put(`/contacts/setStatus`, {
                                                contactId: contact.id,
                                                status: e.target.value,
                                            })
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
                                        }}>
                                            <option selected={'' == contact.status} value={''}>اختر الحالة</option>
                                            <option selected={'completed' == contact.status} value={'completed'}>مكتمل</option>
                                            <option selected={'canceled' == contact.status} value={'canceled'}>ملغى</option>
                                            <option selected={'pending' == contact.status} value={'pending'}>تحت التنفيذ</option>
                                        </select>
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                    <div>
                        <div>
                            <h5>{contact.title}</h5>
                        </div>
                        <div>
                            <p>{contact.body}</p>
                        </div>
                        {
                            contact.image != "null"
                                ? <div style={{
                                    width: "100%",
                                    overflow: "hidden",
                                    borderRadius: "var(--border-radius)",
                                    border: "var(--border-primary)",
                                }}>
                                    <Image style={{
                                        width: "100%",
                                        height: "auto",
                                        overflow: "hidden",
                                        objectFit: "cover"
                                    }} src={`/uploads/files/${contact.image}`} width={100} height={100}/>
                                </div>
                                : null
                        }
                    </div>
                    <div>
                        <form onSubmit={handlerSubmitAddReply}>
                            <span>إضافة رد</span>
                            <textarea onChange={e => setBody(e.target.value)} placeholder={'اكتب محتوى التعليق'}></textarea>
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
                                    ): <button>إضافة</button>
                            }
                        </form>
                    </div>
                    <div>
                        <span>الردود</span>
                        {
                            isLoading
                                ? <Loading />
                                : data.success == false
                                    ? <Alert type={'error'} title={'لا توجد ردود!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                    : data.replies.map((reply, key) =>
                                        <Comments key={key} replyId={reply._id} user={reply.user.name} club={reply.user.club.name} date={reply.createdAt.split('T')[0]} route={''} image={`/uploads/files/${reply.user.avatar}`} body={reply.body} />
                                    )
                        }
                    </div>
                </section>
            </>
        )
    }
    function getReviewElement(){
        return (
            <>
                <section className={Styles.reviews}>
                    <section>
                        <span>{review.activity}</span>
                        <div>
                            <span>{review.user} - {review.createdAt} - {review.club}</span>
                        </div>
                    </section>
                    <hr/>
                    <div>
                        <div>
                            <div>
                                <label>تقييم المدرب</label>
                                <label>{review.benefit + ' من 5'}</label>
                                <label>100%</label>
                            </div>
                            <div><span style={{
                                width: `${benefit}%`
                            }}>{`${benefit}%`}</span></div>
                        </div>
                        <div>
                            <div>
                                <label>تقييم الفعالية</label>
                                <label>{review.lecturer + ' من 5'}</label>
                                <label>100%</label>
                            </div>
                            <div><span style={{
                                width: `${lecturer}%`
                            }}>{`${lecturer}%`}</span></div>
                        </div>
                        <div>
                            <div>
                                <label>حضر من الفعالية</label>
                                <label>{`حضر من الفعالية "${review.attended}"`}</label>
                                <label>100%</label>
                            </div>
                            <div><span style={{
                                width: `${attended}%`
                            }}>{`${attended}%`}</span></div>
                        </div>
                    </div>
                    <hr/>
                    <div>
                        <div>
                            <label>الاستفادة من الفعالية</label>
                            <p>{review.utility == "null" ? "---" : review.utility}</p>
                        </div>
                        <div>
                            <label>الاقتراحات</label>
                            <p>{review.suggestions == "null" ? "---" : review.suggestions}</p>
                        </div>
                    </div>
                </section>
            </>
        )
    }
    function getAwardElement(){
        return (
            <>
                <HeaderPages isCount={true} count={studentAward.count} isBack={false} title={studentAward.name.length >= 20 ? studentAward.name.slice(0, 20) + '...' : studentAward.name} />
                <section className={Styles.reviews}>
                    {
                        studentAward.status == false
                            ? null
                            : null
                    }
                </section>
            </>
        )
    }
    function getCertificateElement(){
        return (
            <>
                <HeaderPages isCount={true} count={studentCertificate.count} isBack={false} title={studentCertificate.name.length >= 20 ? studentCertificate.name.slice(0, 20) + '...' : studentCertificate.name} />
                <section className={Styles.reviews}>
                    {
                        studentCertificate.status == false
                            ? null
                            : null
                    }
                </section>
            </>
        )
    }
    return (
        <>
            {getStatus(activity.status)}
            {isActivity && getActivityElement()}
            {isDiscourse && getDiscourseElement()}
            {isStudent && getStudentElement()}
            {isPost && getPostElement()}
            {isContact && getContactElement()}
            {isReview && getReviewElement()}
            {isAward && getAwardElement()}
            {isCertificate && getCertificateElement()}
            {isReport && getReportElement()}
        </>
    )
}
