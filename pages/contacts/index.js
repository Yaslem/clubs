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
import {contactsActions} from "../../redux/slices/contactsSlice";
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
    const title = "الطلبات";
    const router = useRouter()
    const isEditContact = useSelector(state => state.contacts.isEdit)
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/contacts?page=${router.query.page || 1}`, fetcher)
    const contacts = useSelector(state => state.contacts.contacts)
    const count = useSelector(state => state.contacts.count)
    const isShowContact = useSelector(state => state.contacts.isShow)
    const countSearch = useSelector(state => state.contacts.countSearch)
    const result = useSelector(state => state.contacts.result)
    if(!isLoading){
        dispatch(contactsActions.count(data.contacts.totalDocs))
    }
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} isBack={false} title={'الطلبات'} route={'/add'} routeBack={'contacts'} add={session.user.permissions.addContact.status ? 'إضافة طلب' : null} />
                {
                    !isShowContact && !isEditContact && <Filter url={'contacts'} isContacts={true} />
                }
                {
                    isLoading
                        ? <Loading />
                        : contacts.status == true
                            ? contacts.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد طلبات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <p>{result}</p>
                                    <Table
                                        permissions={session.user.permissions}
                                        headers={["العنوان", "الاسم", "نوع الطلب", "الجهة", "الحالة", "خيارات"]}
                                        isContact={true}
                                        data={contacts}
                                        isPaginate={false}
                                    />
                                </>
                            : data.success == false
                                ? <Alert type={'error'} title={'لا توجد طلبات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    permissions={session.user.permissions}
                                    headers={["العنوان", "الاسم", "نوع الطلب", "الجهة", "الحالة", "خيارات"]}
                                    isContact={true}
                                    data={data.contacts}
                                />
                }
            </section>
        </>
    )
}
