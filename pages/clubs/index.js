import Styles from "../../styles/Index.module.css"
import StylesCard from "../../styles/clubs/Card.module.css"
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
    return { props: {session} }
}
export default ({session}) => {
    const router = useRouter()
    const { data, isError, isLoading } = useSWR(`/clubs/get?page=${router.query.page || 1}`, fetcher)

    const title = "الأندية";
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                description="جميع الأندية الطلابية على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.index}>
                <HeaderPages isCount={true} count={!isLoading && data.clubs.length} title={'الأندية'} add={session ? session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' ? 'إدارة الأندية' : session.user.role === 'manager' ? "إدارة النادي" : null : null} route={'/management'} isBack={false}/>
                {
                    session &&
                    <IsFile isClubs={true} />
                }
                {
                    isLoading
                        ? <Loading />
                        : data.clubs.length == 0
                            ? <Alert type={'error'} title={'لا توجد أندية!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على أندية متاحة.'} />
                            : <section className={StylesCard.index}>
                                {
                                    session
                                        ? data.clubs.map(club =>
                                            club.name == 'فريق الإدارة' || club._id == session.user.club._id
                                                ? null
                                                : <Card session={session} clubId={club._id} image={club.cover} name={club.name} numberUsers={club.studentsCount} numberPosts={club.postsCount} numberActivities={club.activitiesCount} />
                                        )
                                        : data.clubs.map(club =>
                                            club.name == 'فريق الإدارة'
                                                ? null
                                                : <Card session={session} clubId={club._id} image={club.cover} name={club.name} numberUsers={club.studentsCount} numberPosts={club.postsCount} numberActivities={club.activitiesCount} />
                                        )
                                }
                        </section>
                }
            </section>
        </>
    )
}
