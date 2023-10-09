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
import Loading from "../../../components/Loading";
import {useDispatch, useSelector} from "react-redux";
import {postsActions} from "../../../redux/slices/postsSlice";
import IsFile from "../../../components/IsFile";
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
            && session.user.permissions.showPost.status
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
    const title = "المنشورات";
    const router = useRouter()
    const dispatch = useDispatch()
    const { data, mutate, isError, isLoading } = useSWR(`/posts/comments/all?page=${router.query.page || 1}`, fetcher)
    const count = useSelector(state => state.posts.count)
    if(!isLoading){
        dispatch(postsActions.count(data.comments.totalDocs))
    }
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={count} isBack={false} title={'التعليقات'} routeBack={'posts'} />
                <IsFile status={false} isPost={true} />
                {
                    isLoading
                        ? <Loading />
                        : data.success == false
                            ? <Alert type={'error'} title={'لا توجد تعليقات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                            : <Table
                                mutate={mutate}
                                permissions={session.user.permissions}
                                headers={["الكاتب", "عنوان المنشور", "النادي", "التاريخ", "الحالة", "خيارات"]}
                                isComment={true}
                                data={data.comments}
                            />
                }
            </section>
        </>
    )
}
