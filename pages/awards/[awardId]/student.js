import Styles from "../../../styles/Index.module.css"
import HeaderPages from "../../../components/HeaderPages";
import Head from "next/head";
import {getServerSession} from "next-auth";
import {options} from "../../api/auth/[...nextauth]";
import {useRouter} from "next/router";
import axios from "axios";
import Table from "../../../components/Table";
import Alert from "../../../components/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import Loading from "../../../components/Loading";
import {useDispatch, useSelector} from "react-redux";
import {awardsAndActivitiesActions} from "../../../redux/slices/awardsAndActivitiesSlice";
import {NextSeo} from "next-seo";
const fetcher = url => axios.get(url).then(res => res.data);
export async function getServerSideProps(context) {
    const {studentId} = context.query
    if (studentId){
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
                && session.user.permissions.showAward.status
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
    }else {
        return {
            redirect: {
                destination: '/awards',
                permanent: false,
            },
        }
    }

}
export default ({session}) => {
    const title = `الجوائز`;
    const router = useRouter()
    const dispatch = useDispatch()
    const { data, mutate, isError, isLoading } = useSWR(`awards/show/getStudentAwards?student=${router.query.studentId}&page=${router.query.page || 1}`, fetcher)
    const awardsAndActivities = useSelector(state => state.awardsAndActivities.awardsAndActivities)
    const count = useSelector(state => state.awardsAndActivities.count)
    const countSearch = useSelector(state => state.awardsAndActivities.countSearch)
    const result = useSelector(state => state.awardsAndActivities.result)
    if(!isLoading){
        dispatch(awardsAndActivitiesActions.count(data.students.totalDocs))
    }
    return (
        <>
            {
                !isLoading &&
                <NextSeo
                    title={`${router.query.name} | ${title} | ${process.env.SITE_TITLE}`}
                    nofollow={true}
                    description="عرض الجوائز على موقع الأندية الطلابية بالجامعة الإسلامية."
                />
            }
            <section className={Styles.index}>
                {
                    !isLoading && <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} isBack={true} isAward={true} routeBack={`/awards/${router.query.awardId}`} title={router.query.name} />
                }
                {
                    isLoading
                        ? <Loading />
                        : awardsAndActivities.status == true
                            ? awardsAndActivities.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد جوائز!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <p>{result}</p>
                                    <p>hello</p>
                                </>
                            : data.students.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد جوائز لأي طالب!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    mutate={mutate}
                                    permissions={session.user.permissions}
                                    isShowUser={true}
                                    isAllAwards={true}
                                    headers={["الفعالية", "الرقم الجامعي", "الجنسية", "النادي", "نوع الجائزة", "المنسق", "الحالة"]}
                                    isAwardAndActivity={true}
                                    awardClubName={null}
                                    isPaginate={false}
                                    data={data.students}
                                />
                }
            </section>
        </>
    )
}
