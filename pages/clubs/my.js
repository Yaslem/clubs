import Styles from "../../styles/Index.module.css"
import StylesCard from "../../styles/clubs/Card.module.css"
import StylesM from "../../styles/clubs/Management.module.css"
import Head from "next/head";
import HeaderPages from "../../components/HeaderPages";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import Card from "../../components/Clubs/Card";
import useSWR from "swr";
import axios from "axios";
import Loading from "../../components/Loading";
import IsFile from "../../components/IsFile";
import Alert from "../../components/Alert";
import {getServerSession} from "next-auth";
import {options} from "../../pages/api/auth/[...nextauth]";
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
    const router = useRouter()
    const { data, isError, isLoading } = useSWR(`/clubs/subscription/my?page=${router.query.page || 1}`, fetcher)
    const title = "أنديتي | الأندية";
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                description="الأندية الطلابية لطالب معين على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={!isLoading && data.clubs.length > 0 ? data.clubs.length : 0} title={'أنديتي'} routeBack={'/clubs'} isBack={true}/>
                <IsFile status={false} isClubs={true} />
                {
                    isLoading
                        ? <Loading />
                        : data.clubs.length == 0
                            ? <Alert type={'error'} title={'لا توجد أندية!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على أندية اشتركت فيها.'} />
                            : <section className={StylesCard.index}>
                                <Card isPrimaryClub={true} session={session} isMyClubs={true} clubId={session.user.club._id} image={session.user.club.cover} name={session.user.club.name} numberUsers={session.user.club.studentsCount} numberPosts={session.user.club.postsCount} numberActivities={session.user.club.activitiesCount} />
                                {
                                    data.clubs.map(club =>
                                        club.club?.name == 'فريق الإدارة' || club.club == null
                                            ? null
                                            : <Card session={session} isMyClubs={true} clubId={club.club._id} image={club.club.cover} name={club.club.name} numberUsers={club.club.studentsCount} numberPosts={club.club.postsCount} numberActivities={club.club.activitiesCount} />
                                    )
                                }
                            </section>
                }
            </section>
        </>
    )
}
