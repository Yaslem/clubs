import {getServerSession} from "next-auth";
import {options} from "./api/auth/[...nextauth]";
import Head from "next/head";
import StylesIndex from "../styles/Index.module.css"
import FormUser from "../components/FormUser";
import HeaderPages from "../components/HeaderPages";
import Show from "../components/Show";
import {useSelector} from "react-redux";
import Close from "../components/Close";
import {profilesActions} from "../redux/slices/profilesSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import Alert from "../components/Alert";
import {NextSeo} from "next-seo";
export async function getServerSideProps(context) {
    const { profile } = context.params;
    const session = await getServerSession(context.req, context.res, options)
    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        }
    }else {
        if (session.user.username != profile) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
    }
    return { props: { session } };
}
export default ({session}) => {
    const isEditProfile = useSelector(state => state.profiles.isEdit)
    const isEditPassword = useSelector(state => state.profiles.isEditPassword)
    const data = useSelector(state => state.profiles.data)
    return (
        <>
            <NextSeo
                title={`${session.user.name} - ${session.user.username} | ${process.env.SITE_TITLE}`}
                nofollow={true}
                description={`الملف الشخصي للطالب ${session.user.name} على موقع الأندية الطلابية بالجامعة الإسلامية.`}
            />
            <section className={StylesIndex.index}>
                <HeaderPages title={'الملف الشخصي'} isBack={false} />
                {
                    !isEditProfile && !isEditPassword && <Show session={session} />
                }
                {
                    isEditProfile &&
                    <>
                        <Close action={profilesActions.isEdit} />
                        <Alert type={'warning'} title={'تنبيه!'} icon={<FontAwesomeIcon icon={faBell} />} msg={'لتعديل الرقم الجامعي، أو رقم الهوية/الإقامة، أو تغيير النادي الأساسي، رجاء التواصل مع فريق الإشراف على الأندية عن طريق نظام تواصل.'} />
                        <FormUser levels={data?.levels} colleges={data?.colleges} countries={data?.countries} clubs={data?.clubs} session={session} isProfile={true} repeat={3} />
                    </>
                }
                {
                    isEditPassword &&
                    <>
                        <Close action={profilesActions.isEditPassword} />
                        <FormUser session={session} isEditPassword={true} repeat={3} />
                    </>
                }
            </section>
        </>
    )
}
