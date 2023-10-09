import Styles from "../styles/Index.module.css"
import HeaderPages from "../components/HeaderPages";
import Head from "next/head";
import {getServerSession} from "next-auth";
import {options} from "./api/auth/[...nextauth]";
import {useRouter} from "next/router";
import axios from "axios";
import Table from "../components/Table";
import Alert from "../components/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import Loading from "../components/Loading";
import {useDispatch, useSelector} from "react-redux";
import {awardsAndActivitiesActions} from "../redux/slices/awardsAndActivitiesSlice";
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
        return { props: {session} }
    }

}
export default ({session}) => {
    const title = "الجوائز";
    const router = useRouter()
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/allAwards?page=${router.query.page || 1}`, fetcher)
    const count = useSelector(state => state.awardsAndActivities.count)
    if(!isLoading){
        dispatch(awardsAndActivitiesActions.count(data.awards.totalDocs))
    }
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                nofollow={true}
                description={`جوائز الطالب ${session.user.name} على موقع الأندية الطلابية بالجامعة الإسلامية.`}
            />
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={count} isBack={false} title={'الجوائز'} />
                {
                    isLoading
                        ? <Loading />
                        : data.awards.totalDocs == 0
                            ? <Alert type={'error'} title={'لا توجد جوائز!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                            : <Table
                                isAllAwards={true}
                                isShowUser={true}
                                permissions={session.user.permissions}
                                headers={["الفعالية", "الرقم الجامعي", "الجنسية", "النادي", "نوع الجائزة", "المنسق", "الحالة"]}
                                isAwardAndActivity={true}
                                awardClubName={null}
                                data={data.awards}
                            />
                }
            </section>
        </>
    )
}
