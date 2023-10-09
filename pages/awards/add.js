import {getServerSession} from "next-auth";
import {options} from "../api/auth/[...nextauth]";
import {useDispatch} from "react-redux";
import {isFileActions} from "../../redux/slices/isFileSlice";
import Head from "next/head";
import HeaderPages from "../../components/HeaderPages";
import IsFile from "../../components/IsFile";
import Styles from "../../styles/Index.module.css";
import useSWR from "swr";
import axios from "axios";
import {useState} from "react";
import FormAdd from "../../components/FormAdd";
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
            && session.user.permissions.addAward.status
        ){
            return { props: {session} }
        }else {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
    }

}
export default ({session}) => {
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/awards/get`, fetcher)
    if (isLoading) return;
    dispatch(isFileActions.set(false))
    const title = "إضافة جائزة | الجوائز";
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                nofollow={true}
                description="إضافة الجوائز على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.index}>
                <HeaderPages title={'إضافة جائزة'} routeBack={'/awards'} />
                <div>
                    {
                        session.user.role === 'admin' && <IsFile />
                    }
                    <FormAdd isAwardAndActivity={true} clubs={data.clubs} />
                </div>
            </section>
        </>
    )
}
