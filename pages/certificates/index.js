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
import Pagination from "../../components/Pagination";
import {certificatesAndActivitiesActions} from "../../redux/slices/certificatesAndActivitiesSlice";
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

}
export default ({session}) => {
    const title = "الشهادات";
    const router = useRouter()
    const isEditCertificatesAndActivities = useSelector(state => state.certificatesAndActivities.isEdit)
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/certificates?page=${router.query.page || 1}`, fetcher)
    const certificatesAndActivities = useSelector(state => state.certificatesAndActivities.certificatesAndActivities)
    const count = useSelector(state => state.certificatesAndActivities.count)
    const isShowCertificatesAndActivities = useSelector(state => state.certificatesAndActivities.isShow)
    const countSearch = useSelector(state => state.certificatesAndActivities.countSearch)
    const result = useSelector(state => state.certificatesAndActivities.result)
    if(!isLoading){
        dispatch(certificatesAndActivitiesActions.count(data.certificates.totalDocs))
    }
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} isBack={false} title={'الشهادات'} route={'/add'} routeBack={'/certificates'} add={session.user.permissions.addCertificate.status ? "إضافة شهادة" : null} />
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
                            : data.success == false
                                ? <Alert type={'error'} title={'لا توجد شهادات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <Card session={session} isCertificate={true} certificates={data.certificates} />
                                    {
                                        data.certificates.totalPages > 1 && <Pagination page={data.certificates.page} hasNextPage={data.certificates.hasNextPage} hasPrevPage={data.certificates.hasPrevPage} nextPage={data.certificates.nextPage} prevPage={data.certificates.prevPage} />
                                    }
                                </>
                }
            </section>
        </>
    )
}
