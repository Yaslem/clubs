import Head from "next/head";
import {useRouter} from "next/router";
import Image from 'next/image';
import {NextSeo} from "next-seo";
export default () => {
    const router = useRouter()
    const title = "الصفحة غير موجودة"
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                nofollow={true}
                noindex={true}
                description="الصفحة غير موجودة على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--gap)"
            }}>
                <h4 style={{
                    fontSize: "20px",
                    color: "gray"
                }}>عفوا، لم نتمكن من العصور على الصفحة المطلوبة.</h4>
                <Image style={{
                    width: "400px"
                }} src={'/uploads/files/default/not-found.png'} width={100} height={100}/>
                <span style={{
                    padding: "var(--padding-primary)",
                    backgroundColor: "var(--backg)",
                    color: "white",
                    border: "var(--border-primary)",
                    borderRadius: "var(--border-radius)",
                    cursor: "pointer",
                    fontSize: "14px",
                }} onClick={e => router.push('/')}>الذهاب للصفحة الرئيسية</span>
            </section>
        </>
    )
}
