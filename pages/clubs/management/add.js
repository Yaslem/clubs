import Styles from "../../../styles/Index.module.css"
import HeaderPages from "../../../components/HeaderPages";
import Head from "next/head";
import {getServerSession} from "next-auth";
import {options} from "../../api/auth/[...nextauth]";
import axios from "axios";
import FormClub from "../../../components/Clubs/FormClub";
import useSWR from "swr";
import IsFile from "../../../components/IsFile";
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
                || session.user.role === 'president')
            && session.user.permissions.addClub.status
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
    const title = "إضافة نادي | إدارة الأندية | الأندية";
    const { data, isError, isLoading } = useSWR(`/clubs/management/manager`, fetcher)
    if (isLoading) return;
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                nofollow={true}
                description="إضافة الأندية الطلابية على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.index}>
                <HeaderPages title={'إضافة نادي'} routeBack={'/clubs/management'} />
                <div>
                    {
                        session.user.role === 'admin' &&
                        <IsFile />
                    }
                    <FormClub session={session} managers={data.students} />
                </div>
            </section>
        </>
    )
}
