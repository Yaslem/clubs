import Styles from "../styles/IsFile.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarDay,
    faCalendarDays, faCalendarWeek, faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import useSWR from "swr";
import Table from "./Table";
import axios from "axios";
import Loading from "./Loading";
import Alert from "./Alert";
import useDeviceSize from "./useDeviceSize";
const fetcher = url => axios.get(url).then(res => res.data);

export default () => {
    const [isActive, setIsActive] = useState(1)
    const [width, height] = useDeviceSize();
    const [route, setRoute] = useState("toDay")
    const { data, isError, isLoading } = useSWR(`/${route}`, fetcher)

    return (
        <div>
            <ul className={Styles.index} style={{
                justifyContent: "space-between",
                flexDirection: width <= 500 ? "column" : "row",
                alignItems: width <= 500 ? "normal" : "center",
            }}>
                <li className={isActive == 1 && Styles.active} onClick={() => {
                    setIsActive(1)
                    setRoute("toDay")
                }}>
                    <FontAwesomeIcon icon={faCalendarDay} />
                    <span>فعاليات اليوم</span>
                </li>
                <li className={isActive == 2 && Styles.active} onClick={() => {
                    setIsActive(2)
                    setRoute("tomorrow")
                }}>
                    <FontAwesomeIcon icon={faCalendarDays} />
                    <span>فعاليات الغد</span>
                </li>
                <li className={isActive == 3 && Styles.active} onClick={() => {
                    setIsActive(3)
                    setRoute("week")
                }}>
                    <FontAwesomeIcon icon={faCalendarWeek} />
                    <span>فعاليات الأسبوع المقبل</span>
                </li>
            </ul>
            {
                isLoading
                    ? <Loading />
                    : data.success == false
                        ? <Alert type={'error'} title={'لا توجد فعاليات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                        : <Table
                            headers={["العنوان", "النادي", "من", "إلى", "اليوم", "التاريخ"]}
                            isToDay={true}
                            data={data.activities}
                        />
            }
        </div>
    )
}
