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
import {designsActions} from "../../redux/slices/designsSlice";
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
            && session.user.permissions.showDesign.status
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
    const title = "التصاميم";
    const router = useRouter()
    const isEditDesign = useSelector(state => state.designs.isEdit)
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/designs?page=${router.query.page || 1}`, fetcher)
    const designs = useSelector(state => state.designs.designs)
    const count = useSelector(state => state.designs.count)
    const isShowDesign = useSelector(state => state.designs.isShow)
    const countSearch = useSelector(state => state.designs.countSearch)
    const result = useSelector(state => state.designs.result)
    if(!isLoading){
        dispatch(designsActions.count(data.designs.totalDocs))
    }
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} isBack={false} title={'التصاميم'} route={'/add'} routeBack={'designs'} add={session.user.permissions.addContact.status ? 'طلب تصميم' : null} />
                {
                    !isEditDesign && !isShowDesign  && <Filter url={'designs'} isDesigns={true} />
                }
                {
                    isLoading
                        ? <Loading />
                        : designs.status == true
                            ? designs.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد تصميمات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <p>{result}</p>
                                    <Table
                                        permissions={session.user.permissions}
                                        headers={["العنوان", "النادي", "من", "إلى", "النوع", "اليوم", "التاريخ", "حالة الفعالية", "حالة التصميم", session.user.permissions.editDesign.status || session.user.permissions.deleteDesign.status ? "خيارات" : null]}
                                        isDesign={true}
                                        data={designs}
                                        isPaginate={false}
                                    />
                                </>
                            : data.success == false
                                ? <Alert type={'error'} title={'لا توجد تصميمات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    permissions={session.user.permissions}
                                    headers={["العنوان", "النادي", "من", "إلى", "النوع", "اليوم", "التاريخ", "حالة الفعالية", "حالة التصميم", session.user.permissions.editDesign.status || session.user.permissions.deleteDesign.status ? "خيارات" : null]}
                                    isDesign={true}
                                    data={data.designs}
                                />
                }
            </section>
        </>
    )
}