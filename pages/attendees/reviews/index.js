import Styles from "../../../styles/Index.module.css"
import HeaderPages from "../../../components/HeaderPages";
import Head from "next/head";
import {getServerSession} from "next-auth";
import {options} from "../../api/auth/[...nextauth]";
import {useRouter} from "next/router";
import axios from "axios";
import Table from "../../../components/Table";
import Alert from "../../../components/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import Filter from "../../../components/activities/Filter";
import Loading from "../../../components/Loading";
import {useDispatch, useSelector} from "react-redux";
import {reviewsActions} from "../../../redux/slices/reviewsSlice";
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
    const title = "التقييمات";
    const router = useRouter()
    const isEditReviews = useSelector(state => state.reviews.isEdit)
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/attendees/reviews?page=${router.query.page || 1}`, fetcher)
    const reviews = useSelector(state => state.reviews.reviews)
    const count = useSelector(state => state.reviews.count)
    const isShowReviews = useSelector(state => state.reviews.isShow)
    const countSearch = useSelector(state => state.reviews.countSearch)
    const result = useSelector(state => state.reviews.result)
    if(!isLoading){
        dispatch(reviewsActions.count(data.reviews.totalDocs))
    }
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                noindex={true}
                nofollow={true}
                description="عرض تحضير الفعاليات على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} title={'التقييمات'} routeBack={'attendees'} add={session.user.role === 'admin' ? 'إضافة التقييمات' : null} route={'/add'} />
                {
                    !isEditReviews && !isShowReviews && session.user.role !== "student" && <Filter url={'attendees'} isAttendees={true} />
                }
                {
                    isLoading
                        ? <Loading />
                        : reviews.status == true
                            ? reviews.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد فعاليات للتحضير فيها!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <p>{result}</p>
                                    <Table
                                        permissions={session.user.permissions}
                                        headers={["الاسم", "العنوان", "النادي", "الفعالية", "المدرب", "حضر", "التاريخ", "خيارات"]}
                                        isReview={true}
                                        isPaginate={false}
                                        data={reviews}
                                    />
                                </>
                            : data.success == false
                                ? <Alert type={'error'} title={'لا توجد تحضيرات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    permissions={session.user.permissions}
                                    headers={["الاسم", "العنوان", "النادي", "الفعالية", "المدرب", "حضر", "التاريخ", "خيارات"]}
                                    isReview={true}
                                    data={data.reviews}
                                />
                }
            </section>
        </>
    )
}
