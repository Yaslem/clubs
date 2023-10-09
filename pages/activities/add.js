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
                || session.user.role === 'deputy'
                || session.user.role === 'manager'
                || session.user.role === 'officials')
            && session.user.permissions.addActivity.status
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
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/activities/get`, fetcher)
    if (isLoading) return;
    let dates= []
    let times= []
    var start = new Date(data.dates.start);
    var end = new Date(data.dates.end);
    var newend = end.setDate(end.getDate()+1);
    var end = new Date(newend);
    while(start < end){
        dates.push((new Date(start)).toISOString().split('T')[0]);
        var newDate = start.setDate(start.getDate() + 1);
        start = new Date(newDate);
    }
    let startTime = Number(data.times.start.split(':')[0])
    let endTime = Number(data.times.end.split(':')[0])
    // console.log(startTime + 1)
    while (startTime <= endTime){
        times.push(`${startTime}:00`)
        times.push(`${startTime}:30`)
        startTime += 1
    }
    dispatch(isFileActions.set(false))
    const title = "إضافة فعالية جديدة | الفعاليات";
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                noindex={true}
                nofollow={true}
                description="إضافة فعالية على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.index}>
                <HeaderPages title={'إضافة فعالية جديدة'} routeBack={'/activities'} />
                <div>
                    {
                        session.user.role === 'admin' && <IsFile />
                    }
                    <FormUser times={times} dates={dates} session={session} locations={data.locations} types={data.types} clubs={data.clubs} isAddActivity={true} repeat={3} />
                </div>
            </section>
        </>
    )
}
