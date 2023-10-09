import Styles from "../../styles/Index.module.css"
import HeaderPages from "../../components/HeaderPages";
import Head from "next/head";
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
import {reportsActions} from "../../redux/slices/reportsSlice";
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
            && session.user.permissions.showReport.status
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
    const title = "التقارير";
    const router = useRouter()
    const isEditReport = useSelector(state => state.reports.isEdit)
    const isShowReport = useSelector(state => state.reports.isShow)
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/reports?page=${router.query.page || 1}`, fetcher)
    const reports = useSelector(state => state.reports.reports)
    const count = useSelector(state => state.reports.count)
    const countSearch = useSelector(state => state.reports.countSearch)
    const result = useSelector(state => state.reports.result)
    if(!isLoading){
        dispatch(reportsActions.count(data.reports.totalDocs))
    }
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} isBack={false} title={'التقارير'} route={'/add'} routeBack={'reports'} add={'إضافة تقرير'} />
                {
                    !isEditReport && !isShowReport && <Filter url={'reports'} isReports={true} />
                }
                {
                    isLoading
                        ? <Loading />
                        : reports.status == true
                            ? reports.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد تقارير!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <p>{result}</p>
                                    <Table
                                        permissions={session.user.permissions}
                                        headers={["العنوان", "النادي", "عدد الحضور", "المكان", "التاريخ", "الحالة", "خيارات"]}
                                        isReport={true}
                                        data={reports}
                                        isPaginate={false}
                                    />
                                </>
                            : data.success == false
                                ? <Alert type={'error'} title={'لا توجد تقارير!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    permissions={session.user.permissions}
                                    headers={["العنوان", "النادي", "عدد الحضور", "المكان", "التاريخ", "الحالة", "خيارات"]}
                                    isReport={true}
                                    data={data.reports}
                                />
                }
            </section>
        </>
    )
}
