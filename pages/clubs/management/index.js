import Styles from "../../../styles/Index.module.css"
import HeaderPages from "../../../components/HeaderPages";
import Head from "next/head";
import {getServerSession} from "next-auth";
import {options} from "../../api/auth/[...nextauth]";
import {useRouter} from "next/router";
import useSWR from "swr";
import Alert from "../../../components/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import Table from "../../../components/Table";
import axios from "axios";
import Loading from "../../../components/Loading";
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
export default ({session}) => {
    const title = `${session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' ? 'إدارة الأندية' : session.user.club.name} | الأندية`;
    const router = useRouter()
    const { data, isError, isLoading } = useSWR(`/clubs/management?page=${router.query.page || 1}`, fetcher)
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                nofollow={true}
                description="الأندية الطلابية على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={!isLoading && data.clubs.totalDocs} title={session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' ? 'إدارة الأندية' : session.user.club.name} route={'/add'} routeBack={'clubs'} add={session.user.permissions.addClub.status ? 'إضافة نادي' : null} />
                {
                    isLoading
                        ? <Loading />
                        : data.clubs.totalDocs == 0
                            ? <Alert type={'error'} title={'لا توجد أندية!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                            : <Table
                                permissions={session.user.permissions}
                                headers={["الاسم", "الشعار", "المدير", "إدارة النادي", "الفعاليات", "الأعضاء", "المنشورات", "خيارات"]}
                                isClub={true}
                                data={data.clubs}
                            />
                }
            </section>
        </>
    )
}
