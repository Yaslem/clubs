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
import {discoursesActions} from "../../redux/slices/discoursesSlice";
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
            && session.user.permissions.showDiscourse.status
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
    const title = "الخطابات";
    const router = useRouter()
    const isEditDiscourse = useSelector(state => state.discourses.isEdit)
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/discourses?page=${router.query.page || 1}`, fetcher)
    const discourses = useSelector(state => state.discourses.discourses)
    const count = useSelector(state => state.discourses.count)
    const isShowDiscourse = useSelector(state => state.discourses.isShow)
    const countSearch = useSelector(state => state.discourses.countSearch)
    const result = useSelector(state => state.discourses.result)
    if(!isLoading){
        dispatch(discoursesActions.count(data.discourses.totalDocs))
    }
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} isBack={false} title={'الخطابات'} route={'/add'} routeBack={'discourses'} add={session.user.permissions.addContact.status ? 'رفع خطاب' : null} />
                {
                    !isEditDiscourse && !isShowDiscourse && <Filter url={'discourses'} isDiscourses={true} />
                }
                {
                    isLoading
                        ? <Loading />
                        : discourses.status == true
                            ? discourses.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد خطابات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <p>{result}</p>
                                    <Table
                                        permissions={session.user.permissions}
                                        headers={["العنوان", "النادي", "الجهة", "اليوم", "التاريخ", "حالة الفعالية", "حالة الخطاب", "خيارات"]}
                                        isDiscourse={true}
                                        data={discourses}
                                        isPaginate={false}
                                    />
                                </>
                            : data.success == false
                                ? <Alert type={'error'} title={'لا توجد خطابات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    permissions={session.user.permissions}
                                    headers={["العنوان", "النادي", "الجهة", "اليوم", "التاريخ", "حالة الفعالية", "حالة الخطاب", "خيارات"]}
                                    isDiscourse={true}
                                    data={data.discourses}
                                />
                }
            </section>
        </>
    )
}
