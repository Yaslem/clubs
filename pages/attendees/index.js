import Styles from "../../styles/Index.module.css"
import HeaderPages from "../../components/HeaderPages";
import Head from "next/head";
import {getServerSession} from "next-auth";
import {options} from "../api/auth/[...nextauth]";
import {useRouter} from "next/router";
import axios from "axios";
import Alert from "../../components/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import Loading from "../../components/Loading";
import {useDispatch, useSelector} from "react-redux";
import Card from "../../components/awards/Card";
import {attendeesActions} from "../../redux/slices/attendeesSlice";
import {NextSeo} from "next-seo";
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
        return { props: {session} }
    }

}
export default ({session}) => {
    const title = "التحضير";
    const router = useRouter()
    const isEditAttendees = useSelector(state => state.awardsAndActivities.isEdit)
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/attendees?page=${router.query.page || 1}`, fetcher)
    const attendees = useSelector(state => state.attendees.activities)
    const count = useSelector(state => state.attendees.count)
    const isShowAttendees = useSelector(state => state.attendees.isShow)
    const countSearch = useSelector(state => state.attendees.countSearch)
    const result = useSelector(state => state.attendees.result)
    if(!isLoading){
        dispatch(attendeesActions.count(data.activities.totalDocs))
    }
    console.log(countSearch)
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                noindex={true}
                nofollow={true}
                description="تحضير الفعاليات على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} isBack={false} title={'التحضير'} route={'/reviews'} add={session.user.role !== "student" ? "التقييمات" : 'تقييماتي'} />
                {
                    isLoading
                        ? <Loading />
                        : attendees.status == true
                            ? attendees.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد فعاليات للتحضير فيها!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <p>{result}</p>
                                    <p>hello</p>
                                </>
                            : data.success == false
                                ? <Alert type={'error'} title={'لا توجد فعاليات للتحضير فيها!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Card session={session} isAttend={true} attendees={data.activities} />
                }
            </section>
        </>
    )
}
