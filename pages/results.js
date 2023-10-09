import Head from "next/head";
import Styles from "../styles/Index.module.css"
import HeaderPages from "../components/HeaderPages";
import Table from "../components/Table";
import useSWR from "swr";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faXmark} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {useRouter} from "next/router";
const fetcher = url => axios.get(url).then(res => res.data);
export default () => {
    const title = "نتائج الأندية";
    const router = useRouter()
    const { data, isError, isLoading } = useSWR(`/results`, fetcher)
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages title={'نتائج الأندية'} isBack={false}/>
                <Alert type={'warning'} title={'تنبيه!'} icon={<FontAwesomeIcon icon={faBell} />} msg={'ترقبوا نتائج الأندية الطلابية 1445 هـ قريبا بإذن الله.'} />
                {
                    isLoading
                        ? <Loading />
                        : data.results.totalDocs == 0
                            ? <Alert type={'error'} title={'لا توجد نتائج!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                            : <Table
                                isAll={true}
                                headers={["الرتبة", "النادي", "الشعار", "المدير", "النتيجة", "السنة", "خيارات"]}
                                isResults={true}
                                data={data.results}
                            />
                }
            </section>
        </>
    )
}
