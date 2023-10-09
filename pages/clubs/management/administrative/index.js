import Styles from "../../../../styles/Index.module.css"
import HeaderPages from "../../../../components/HeaderPages";
import Head from "next/head";
import {getServerSession} from "next-auth";
import {options} from "../../../api/auth/[...nextauth]";
import {useRouter} from "next/router";
import useSWR from "swr";
import Alert from "../../../../components/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import Table from "../../../../components/Table";
import axios from "axios";
import Loading from "../../../../components/Loading";
import {NextSeo} from "next-seo";
const fetcher = url => axios.get(url).then(res => res.data);
export async function getServerSideProps(context) {
    const {clubId} = context.query
    const session = await getServerSession(context.req, context.res, options)
    if(!clubId){
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }else {
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
                && session.user.permissions.showClub.status
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

}
export default ({session}) => {
    const title = `إدارة النادي | ${session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' ? 'إدارة الأندية' : session.user.club.name} | الأندية`;
    const router = useRouter()
    const { data, isError, isLoading } = useSWR(`/clubs/management/administrative?clubId=${router.query.clubId}`, fetcher)
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                nofollow={true}
                description="إضافة إداريي الأندية الطلابية على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={!isLoading && data.administrativeClub.totalDocs} title={'إدارة النادي'} route={`/add?clubId=${router.query.clubId}`} isBack={true} routeBack={'/clubs/management'} add={session.user.permissions.showClub.status ? 'إضافة إداري' : null} />
                {
                    isLoading
                        ? <Loading />
                        : data.administrativeClub.totalDocs == 0
                            ? <Alert type={'error'} title={'لا توجد إدارة!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                            : <Table
                                permissions={session.user.permissions}
                                headers={["الاسم", "الصورة", "الرقم الجامعي", "الجنسية", "الوظيفة", "الرتبة", "خيارات"]}
                                isAdministrativeClub={true}
                                data={data.administrativeClub}
                            />
                }
            </section>
        </>
    )
}
