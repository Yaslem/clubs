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
    const title = `الشهادات`;
    const router = useRouter()
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/certificates/show?certificateId=${router.query.certificateId}&page=${router.query.page || 1}`, fetcher)
    const certificatesAndActivities = useSelector(state => state.certificatesAndActivities.certificatesAndActivities)
    const count = useSelector(state => state.certificatesAndActivities.count)
    const isShowCertificatesAndActivities = useSelector(state => state.certificatesAndActivities.isShow)
    const countSearch = useSelector(state => state.certificatesAndActivities.countSearch)
    const result = useSelector(state => state.certificatesAndActivities.result)
    if(!isLoading){
        dispatch(certificatesAndActivitiesActions.count(data.certificates.students.totalDocs))
    }
    return (
        <>
            {
                !isLoading &&
                <Head>
                    <title>{`${data.certificates.certificate.activityId.title} | ${title} | ${process.env.SITE_TITLE}`}</title>
                </Head>
            }
            <section className={Styles.index}>
                {
                    !isLoading && !isShowCertificatesAndActivities && <HeaderPages isUsersAward={true} isAward={true} isCount={true} count={countSearch > 0 ? countSearch : count} isBack={true} title={data.certificates.certificate.activityId.title.length >= 15 ? data.certificates.certificate.activityId.title.slice(0, 15) + '...' : data.certificates.certificate.activityId.title} route={`/certificates/${router.query.certificateId}/add?activity=${data.certificates.certificate.activityId._id}`} routeBack={`/certificates`} add={'إضافة شهادة لطالب'} />
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
                            : data.certificates.students.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد شهادة لأي طالب!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    permissions={session.user.permissions}
                                    headers={["الاسم", "الرقم الجامعي", "الجنسية", "النادي", "خيارات"]}
                                    isCertificate={true}
                                    isPaginate={false}
                                    awardClubName={data.certificates.certificate.activityId.club.name}
                                    data={data.certificates.students}
                                />
                }
            </section>
        </>
    )
}
