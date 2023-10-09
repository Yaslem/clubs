import Styles from '../../styles/auth/register.module.css'
import Link from "next/link";
import Head from "next/head";
import FormUser from "../../components/FormUser";
import {getServerSession} from "next-auth";
import {options} from "../api/auth/[...nextauth]";
import useSWR from "swr";
import axios from "axios";
import {NextSeo} from "next-seo";
const fetcher = url => axios.get(url).then(res => res.data);
export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, options)
    if (!session) {
        return { props: {} }
    }else {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

}
export default () => {
    const { data, isError, isLoading } = useSWR(`/auth/get`, fetcher)
    if (isLoading) return;
    const title = "تسجيل حساب جديد"
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                description="تسجيل حساب جديد على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.register}>
                <img src={'/uploads/files/default/site-logo.png'}/>
                <div className={Styles.reg}>
                    <section>
                        <div>
                            <FormUser colleges={data.colleges} countries={data.countries} clubs={data.clubs} levels={data.levels} isRegister={true} repeat={2} />
                        </div>
                        <div className={Styles.footer}>
                            <p>لديك حساب؟ <Link href={'/auth/signin'}>سجل الدخول</Link></p>
                        </div>
                    </section>
                </div>
            </section>
        </>
    )
}
