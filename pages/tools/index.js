import HeaderPages from "../../components/HeaderPages";
import Styles from "../../styles/Index.module.css"
import StylesIndex from "../../styles/tools/Index.module.css"
import Head from "next/head";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAward, faCalendar,
    faCalendarDays,
    faClock,
    faEarthAfrica, faGraduationCap, faLayerGroup,
    faLocationDot,
    faNewspaper, faSquarePollVertical, faWindowRestore
} from "@fortawesome/free-solid-svg-icons";
import Card from "../../components/Card";
import {useRouter} from "next/router";
import {getServerSession} from "next-auth";
import {options} from "./../api/auth/[...nextauth]";
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
        if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
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
export default () => {
    const router = useRouter()
    return (
        <>
            <Head>
                <title>{`الأدوات | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages isBack={false} title={'الأدوات'} />
                <div className={StylesIndex.index}>
                    <Card router={router.pathname + '/locations'} mess={'يمكنك إضافة موقع جديد من مواقع الفعاليات'} title={'مواقع الفعاليات'} icon={<FontAwesomeIcon icon={faLocationDot} />} />
                    <Card router={router.pathname + '/types'} mess={'يمكنك إضافة نوع جديد من أنواع الفعاليات'} title={'أنواع الفعاليات'} icon={<FontAwesomeIcon icon={faNewspaper} />} />
                    <Card router={router.pathname + '/dates'} mess={'يمكنك إضافة تاريخ بدء وانتهاء الحجوزات'} title={'تواريخ حجز الفعاليات'} icon={<FontAwesomeIcon icon={faCalendarDays} />} />
                    <Card router={router.pathname + '/times'} mess={'يمكنك إضافة وقت بدء وانتهاء الحجوزات'} title={'أوقات حجز الفعاليات'} icon={<FontAwesomeIcon icon={faClock} />} />
                    <Card router={router.pathname + '/awards'} mess={'يمكنك إضافة من هنا إضافة أنواع الجوائز'} title={'أنواع جوائز الفعاليات'} icon={<FontAwesomeIcon icon={faAward} />} />
                    <Card router={router.pathname + '/countries'} mess={'من هنا يمكنك إضافة دولة أو حذفها'} title={'قائمة الدول'} icon={<FontAwesomeIcon icon={faEarthAfrica} />} />
                    <Card router={router.pathname + '/colleges'} mess={'من هنا يمكنك إضافة كلية أو حذفها'} title={'قائمة الكليات'} icon={<FontAwesomeIcon icon={faGraduationCap} />} />
                    <Card router={router.pathname + '/levels'} mess={'من هنا يمكنك إضافة مستوى أو حذفه'} title={'قائمة المستويات'} icon={<FontAwesomeIcon icon={faLayerGroup} />} />
                    <Card router={router.pathname + '/administrative'} mess={'من هنا يمكنك إضافة وظيفة إدارية أو حذفها'} title={'قائمة الهيكل الإداري'} icon={<FontAwesomeIcon icon={faWindowRestore} />} />
                    <Card router={router.pathname + '/years'} mess={'من هنا يمكنك إضافة سنوات النشاط في الأندية الطلابية'} title={'سنوات النشاط'} icon={<FontAwesomeIcon icon={faCalendar} />} />
                    <Card router={router.pathname + '/results'} mess={'من هنا يمكنك إضافة نتائج الأندية الطلابية'} title={'نتائج الأندية'} icon={<FontAwesomeIcon icon={faSquarePollVertical} />} />
                </div>
            </section>
        </>
    )
}
