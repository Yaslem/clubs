import Styles from "../../styles/Index.module.css"
import HeaderPages from "../../components/HeaderPages";
import {getServerSession} from "next-auth";
import {options} from "../api/auth/[...nextauth]";
import {useRouter} from "next/router";
import axios from "axios";
import Table from "../../components/Table";
import Alert from "../../components/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import Filter from "../../components/activities/Filter";
import Loading from "../../components/Loading";
import {useDispatch, useSelector} from "react-redux";
import {activitiesActions} from "../../redux/slices/activitiesSlice";
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
            && session.user.permissions.showActivity.status
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
    console.log(session)
    const title = "الفعاليات";
    const router = useRouter()
    const isEditActivity = useSelector(state => state.activities.isEdit)
    const isShowActivity = useSelector(state => state.activities.isShow)
    const dispatch = useDispatch()
    const { data, mutate, isError, isLoading } = useSWR(`/activities?page=${router.query.page || 1}`, fetcher)
    const activities = useSelector(state => state.activities.activities)
    const count = useSelector(state => state.activities.count)
    const countSearch = useSelector(state => state.activities.countSearch)
    const result = useSelector(state => state.activities.result)
    if(!isLoading){
        dispatch(activitiesActions.count(data.activities.totalDocs))
    }
    console.log(countSearch)
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                description="فعاليات الأندية الطلابية على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} isBack={false} title={'الفعاليات'} route={'/add'} routeBack={'activities'} add={session.user.permissions.addActivity.status ? 'إضافة فعالية' : null} />
                {
                    !isEditActivity && !isShowActivity && <Filter url={'activities'} isActivities={true} />
                }
                {
                    isLoading
                        ? <Loading />
                        : activities.status == true
                            ? activities.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد فعاليات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    {!isEditActivity && !isShowActivity && <p>{result}</p>}
                                    <Table
                                        permissions={session.user.permissions}
                                        headers={["العنوان", "النادي", "من", "إلى", "اليوم", "التاريخ", "الحالة", "حالة التحضير", "خيارات"]}
                                        isActivity={true}
                                        data={activities}
                                        isPaginate={false}
                                    />
                                </>
                            : data.success == false
                                ? <Alert type={'error'} title={'لا توجد فعاليات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    mutate={mutate}
                                    permissions={session.user.permissions}
                                    headers={["العنوان", "النادي", "من", "إلى", "اليوم", "التاريخ", "الحالة", "حالة التحضير", "خيارات"]}
                                    isActivity={true}
                                    data={data.activities}
                                />
                }
            </section>
        </>
    )
}
