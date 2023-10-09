import {getServerSession} from "next-auth";
import {options} from "../../api/auth/[...nextauth]";
import {useDispatch} from "react-redux";
import {isFileActions} from "../../../redux/slices/isFileSlice";
import Head from "next/head";
import HeaderPages from "../../../components/HeaderPages";
import IsFile from "../../../components/IsFile";
import FormUser from "../../../components/FormUser";
import Styles from "../../../styles/Index.module.css";
import useSWR from "swr";
import axios from "axios";
import {useState} from "react";
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
        if(session.user.role === 'admin'){
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
    const dispatch = useDispatch()
    const title = "إضافة التقييمات | التقييمات | التحضير";
    dispatch(isFileActions.set(true))
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                noindex={true}
                nofollow={true}
                description="إضافة تحضير الفعاليات على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.index}>
                <HeaderPages isBack={true} title={'إضافة ملف تقييمات'} routeBack={'/reviews'} />
                <div>
                    <FormUser session={session} isAddAttend={true} />
                </div>
            </section>
        </>
    )
}
