import Styles from "../../styles/Index.module.css"
import HeaderPages from "../../components/HeaderPages";
import Head from "next/head";
import {getServerSession} from "next-auth";
import {options} from "../api/auth/[...nextauth]";
import {useRouter} from "next/router";
import axios from "axios";
import Alert from "../../components/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import Loading from "../../components/Loading";
import {useDispatch, useSelector} from "react-redux";
import Card from "../../components/awards/Card";
import {awardsAndActivitiesActions} from "../../redux/slices/awardsAndActivitiesSlice";
import Pagination from "../../components/Pagination";
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
            && session.user.permissions.showAward.status
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
    const title = "الجوائز";
    const router = useRouter()
    const isEditAwardsAndActivities = useSelector(state => state.awardsAndActivities.isEdit)
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/awards?page=${router.query.page || 1}`, fetcher)
    const awardsAndActivities = useSelector(state => state.awardsAndActivities.awardsAndActivities)
    const count = useSelector(state => state.awardsAndActivities.count)
    const isShowAwardsAndActivities = useSelector(state => state.awardsAndActivities.isShow)
    const countSearch = useSelector(state => state.awardsAndActivities.countSearch)
    const result = useSelector(state => state.awardsAndActivities.result)
    if(!isLoading){
        dispatch(awardsAndActivitiesActions.count(data.awards.totalDocs))
    }
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                nofollow={true}
                description="جوائز الطلاب على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} isBack={false} title={'الجوائز'} route={'/add'} routeBack={'/awards'} add={'إضافة جائزة'} />
                {
                    isLoading
                        ? <Loading />
                        : awardsAndActivities.status == true
                            ? awardsAndActivities.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد جوائز!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <p>{result}</p>
                                    <p>hello</p>
                                </>
                            : data.success == false
                                ? <Alert type={'error'} title={'لا توجد جوائز!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <Card session={session} isAward={true} awards={data.awards} />
                                    {
                                        data.awards.totalPages > 1 && <Pagination page={data.awards.page} hasNextPage={data.awards.hasNextPage} hasPrevPage={data.awards.hasPrevPage} nextPage={data.awards.nextPage} prevPage={data.awards.prevPage} />
                                    }
                                </>
                }
            </section>
        </>
    )
}
