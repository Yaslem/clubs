import Styles from "../../../styles/Index.module.css"
import StylesProfile from "../../../styles/clubs/Profile.module.css"
import Head from "next/head";
import HeaderPages from "../../../components/HeaderPages";
import axios from "axios";
import {useEffect, useRef, useState} from "react";
import Show from "../../../components/activities/Show";
import {postsActions} from "../../../redux/slices/postsSlice";
import {useDispatch} from "react-redux";
import useSWR from "swr";
import ShowPost from "../../../components/ShowPost";
const fetcher = url => axios.get(url).then(res => res.data);
export async function getServerSideProps(context) {
    const clubId = context.query.clubId
    const club = context.query.profile.split('-').join(' ')
    const res = await axios.get(`/clubs/post?clubId=${clubId}`)
    const post = res.data.post
    return { props: {club, post} }
}
export default ({club, post}) => {
    const dispatch = useDispatch()
    const { data, isError, isLoading } = useSWR(`/posts/comments?postId=${post._id}`, fetcher)
    const title = post.title;
    dispatch(postsActions.show({
        id: post._id,
        title: post.title,
        club: post.club.name,
        user: post.user.name,
        body: post.body,
        createdAt: post.createdAt.split('T')[0],
        image: post.image,
    }))
    return (
        <>
            <Head>
                <title>{`${title} | ${club} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages title={club} isBack={true} routeBack={`/clubs/${club.split(' ').join('-')}`}/>
                <section className={StylesProfile.index}>
                    <ShowPost isLoading={isLoading} data={data} />
                </section>
            </section>
        </>
    )
}
