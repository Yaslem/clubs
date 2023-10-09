import {getServerSession} from "next-auth";
import {options} from "../api/auth/[...nextauth]";
import {useDispatch} from "react-redux";
import {isFileActions} from "../../redux/slices/isFileSlice";
import Head from "next/head";
import HeaderPages from "../../components/HeaderPages";
import IsFile from "../../components/IsFile";
import FormUser from "../../components/FormUser";
import Styles from "../../styles/Index.module.css";
import useSWR from "swr";
import axios from "axios";
import {useState} from "react";
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
        return { props: {session} }
    }

}
export default ({session}) => {
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/contacts/get`, fetcher)
    if (isLoading) return;
    dispatch(isFileActions.set(false))
    const title = "إضافة طلب جديد | الطلبات";
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages title={'إضافة طلب جديد'} routeBack={'/contacts'} />
                <div>
                    {
                        session.user.role === 'admin' && <IsFile />
                    }
                    <FormUser session={session} clubs={data.clubs} isAddContact={true} />
                </div>
            </section>
        </>
    )
}
