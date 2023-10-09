import Styles from "../../styles/Index.module.css"
import HeaderPages from "../../components/HeaderPages";
import Head from "next/head";
import {getServerSession} from "next-auth";
import {options} from "../api/auth/[...nextauth]";
import {useRouter} from "next/router";
import axios from "axios";
import Table from "../../components/Table";
import Alert from "../../components/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import Filter from "../../components/activities/Filter";
import Loading from "../../components/Loading";
import {useDispatch, useSelector} from "react-redux";
import {studentsActions} from "../../redux/slices/studentsSlice";
const fetcher = url => axios.get(url).then(res => res.data);
export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, options)
    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        }
    }else {
        if(
            (session.user.role === 'admin'
            || session.user.role === 'coordinator'
            || session.user.role === 'president'
            || session.user.role === 'manager'
                || session.user.role === 'deputy'
            || session.user.role === 'officials')
            && session.user.permissions.showStudent.status
        ){
            return { props: {session} }
        }else {
            return {
                redirect: {
                    destination: '/not-allowed',
                    permanent: false,
                },
            }
        }
    }

}
export default ({session}) => {
    const title = "الطلاب";
    const router = useRouter()
    const isEditStudent = useSelector(state => state.students.isEdit)
    const isShowStudent = useSelector(state => state.students.isShow)
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/students?page=${router.query.page || 1}`, fetcher)
    const students = useSelector(state => state.students.students)
    const count = useSelector(state => state.students.count)
    const countSearch = useSelector(state => state.students.countSearch)
    const result = useSelector(state => state.students.result)
    if(!isLoading){
        dispatch(studentsActions.count(data.students.totalDocs))
    }
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} isBack={false} title={'الطلاب'} route={'/add'} routeBack={'students'} add={session.user.permissions.addStudent.status ? 'إضافة طالب' : null} />
                {
                    !isEditStudent && !isShowStudent && <Filter url={'students'} isStudents={true} />
                }
                {
                    isLoading
                        ? <Loading />
                        : students.status == true
                            ? students.totalDocs == 0
                                ? <Alert type={'error'} title={'لا يوجد طلاب!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <p>{result}</p>
                                    <Table
                                        headers={["الاسم", "الرقم الجامعي", "رقم الجوال", "النادي", "الرتبة", "خيارات"]}
                                        isStudents={true}
                                        data={students}
                                        permissions={session.user.permissions}
                                        isPaginate={false}
                                    />
                                </>
                            : data.students.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد فعاليات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    permissions={session.user.permissions}
                                    headers={["الاسم", "الرقم الجامعي", "رقم الجوال", "النادي", "الرتبة", "خيارات"]}
                                    isStudents={true}
                                    data={data.students}
                                />
                }
            </section>
        </>
    )
}
