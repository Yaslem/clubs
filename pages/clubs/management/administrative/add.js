import Styles from "../../../../styles/Index.module.css"
import HeaderPages from "../../../../components/HeaderPages";
import Head from "next/head";
import {getServerSession} from "next-auth";
import {options} from "../../../api/auth/[...nextauth]";
import axios from "axios";
import useSWR from "swr";
import IsFile from "../../../../components/IsFile";
import {useRouter} from "next/router";
import FormAdd from "../../../../components/FormAdd";
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
                    || session.user.role === 'manager')
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
    const title = `إضافة إداري | ${session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' ? 'إدارة الأندية' : session.user.club.name} | الأندية`;
    const router = useRouter()
    const { data, isError, isLoading } = useSWR(`/clubs/management/administrative/get?clubId=${router.query.clubId}`, fetcher)
    if (isLoading) return;
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages title={'إضافة إداري'} routeBack={`/clubs/management/administrative?clubId=${router.query.clubId}`} />
                <div>
                    {
                        session.user.role === 'admin' &&
                        <IsFile />
                    }
                    <FormAdd clubId={router.query.clubId} students={data.students} deputyLists={data.deputy} administrativeList={data.administrative} isAdministrativeClub={true} />
                </div>
            </section>
        </>
    )
}
