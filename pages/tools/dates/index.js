import Head from "next/head";
import Styles from "../../../styles/Index.module.css"
import HeaderPages from "../../../components/HeaderPages";
import Table from "../../../components/Table";
import {getServerSession} from "next-auth";
import {options} from "../../api/auth/[...nextauth]";
import useSWR from "swr";
import Loading from "../../../components/Loading";
import Alert from "../../../components/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {useRouter} from "next/router";
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
        if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
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
const fetcher = url => axios.get(url).then(res => res.data);
export default () => {
    const title = "تواريخ الحجز | الأدوات";
    const router = useRouter()
    const { data, isError, isLoading } = useSWR(`/tools/dates?page=${router.query.page || 1}`, fetcher)
    if (isLoading) return;
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                    <HeaderPages title={'تواريخ الحجز'} route={data.dates.totalDocs == 0 ? '/add': null} add={data.dates.totalDocs == 0 ? 'إضافة تاريخ' : null} routeBack={'/tools'}/>
                {
                    data.dates.totalDocs == 0
                        ? <Alert type={'error'} title={'لا توجد تواريخ!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                        : <Table
                            headers={["من", "إلى", "خيارات"]}
                            isDate={true}
                            data={data.dates}
                        />
                }
            </section>
        </>
    )
}
