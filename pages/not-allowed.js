import Styles from "../styles/Index.module.css"
import {getServerSession} from "next-auth";
import Image from 'next/image';
import {options} from "./api/auth/[...nextauth]";
import {NextSeo} from "next-seo";
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
        return { props: {session} }
    }

}
export default () => {
    const title = "غير مسموح لك بمشاهدة هذه الصفحة"
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                nofollow={true}
                noindex={true}
                description="غير مسموح لك بعرض هذه الصفحة على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.notAllowed}>
                <span>غير مسموح لك بمشاهدة هذه الصفحة</span>
                <Image src={'/uploads/files/default/forbidden.png'} width={100} height={100}/>
            </section>
        </>
    )
}
