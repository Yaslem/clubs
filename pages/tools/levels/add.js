import Head from "next/head";
import Styles from "../../../styles/Index.module.css";
import HeaderPages from "../../../components/HeaderPages";
import FormAdd from "../../../components/FormAdd";
import {getServerSession} from "next-auth";
import {options} from "../../api/auth/[...nextauth]";
import IsFile from "../../../components/IsFile";
import {useDispatch} from "react-redux";
import {isFileActions} from "../../../redux/slices/isFileSlice";
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
export default ({session}) => {
    const dispatch = useDispatch()
    dispatch(isFileActions.set(false))
    const title = "إضافة مستوى | قائمة المستويات | الأدوات";
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages title={'إضافة مستوى'} routeBack={'/tools/levels'} />

                <div>
                    {
                        session.user.role === 'admin' && <IsFile />
                    }
                    <FormAdd isLevel={true} />
                </div>

            </section>
        </>
    )
}
