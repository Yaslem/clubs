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
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {certificatesAndActivitiesActions} from "../../../redux/slices/certificatesAndActivitiesSlice";
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
                && session.user.permissions.showCertificate.status
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
                destination: '/certificates',
                permanent: false,
            },
        }
    }

}
export default ({session}) => {
    const [activityTitle, setActivityTitle] = useState('')
    const title = `الشهادات`;
    const router = useRouter()
    const isEditAwardsAndActivities = useSelector(state => state.certificatesAndActivities.isEdit)
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`certificates/show/getStudentCertificates?student=${router.query.studentId}&page=${router.query.page || 1}`, fetcher)
    const certificatesAndActivities = useSelector(state => state.certificatesAndActivities.certificatesAndActivities)
    const count = useSelector(state => state.certificatesAndActivities.count)
    const isShowAwardsAndActivities = useSelector(state => state.certificatesAndActivities.isShow)
    const countSearch = useSelector(state => state.certificatesAndActivities.countSearch)
    const result = useSelector(state => state.certificatesAndActivities.result)
    if(!isLoading){
        dispatch(certificatesAndActivitiesActions.count(data.students.totalDocs))
    }
    return (
        <>
            {
                !isLoading &&
                <Head>
                    <title>{`${router.query.name} | ${title} | ${process.env.SITE_TITLE}`}</title>
                </Head>
            }
            <section className={Styles.index}>
                {
                    !isLoading && <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} isBack={true} isAward={true} routeBack={`/certificates/${router.query.certificateId}`} title={router.query.name} />
                }
                {
                    isLoading
                        ? <Loading />
                        : certificatesAndActivities.status == true
                            ? certificatesAndActivities.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد شهادات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <p>{result}</p>
                                    <p>hello</p>
                                </>
                            : data.students.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد شهادة لأي طالب!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    permissions={session.user.permissions}
                                    isShowUser={true}
                                    headers={["الفعالية", "الرقم الجامعي", "الجنسية", "النادي", "خيارات"]}
                                    isCertificate={true}
                                    awardClubName={null}
                                    isPaginate={false}
                                    data={data.students}
                                />
                }
            </section>
        </>
    )
}
