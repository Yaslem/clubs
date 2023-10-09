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
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {postsActions} from "../../redux/slices/postsSlice";
import IsFile from "../../components/IsFile";
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
    const isEditPost = useSelector(state => state.posts.isEdit)
    const isShowPost = useSelector(state => state.posts.isShow)
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/posts?page=${router.query.page || 1}`, fetcher)
    const posts = useSelector(state => state.posts.posts)
    const count = useSelector(state => state.posts.count)
    const countSearch = useSelector(state => state.posts.countSearch)
    const result = useSelector(state => state.posts.result)
    if(!isLoading){
        dispatch(postsActions.count(data.posts.totalDocs))
    }
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={countSearch > 0 ? countSearch : count} isBack={false} title={'المنشورات'} route={'/add'} routeBack={'posts'} add={'إضافة منشور'} />
                {
                    !isEditPost && !isShowPost && <Filter url={'posts'} isPosts={true} />
                }
                <IsFile isPost={true} />
                {
                    isLoading
                        ? <Loading />
                        : posts.status == true
                            ? posts.totalDocs == 0
                                ? <Alert type={'error'} title={'لا توجد منشورات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <>
                                    <p>{result}</p>
                                    <Table
                                        permissions={session.user.permissions}
                                        headers={["العنوان", "الكاتب", "النادي", "التاريح", "خيارات"]}
                                        isPost={true}
                                        data={posts}
                                        isPaginate={false}
                                    />
                                </>
                            : data.success == false
                                ? <Alert type={'error'} title={'لا توجد منشورات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                : <Table
                                    permissions={session.user.permissions}
                                    headers={["العنوان", "الكاتب", "النادي", "التاريح", "خيارات"]}
                                    isPost={true}
                                    data={data.posts}
                                />
                }
            </section>
        </>
    )
}
