import Styles from '../styles/HeaderPages.module.css'
import {useRouter} from "next/router";
import Back from "./Back";
import Link from "next/link";
export default ({title, route, add, routeBack, isBack = true, isCount = false, count = 0, isAward, isUsersAward = false}) => {
    const router = useRouter();
    return(
        <section className={Styles.header}>
            {
                isBack && <Back isUsersAward={isUsersAward} routeBack={routeBack} />
            }
            <div>
                <h3>{title}</h3>
                {isCount && <span>{count}</span>}
                {add?.length > 0 ? isAward ? <Link href={route}>{add}</Link> : <Link href={router.pathname + route}>{add}</Link> : ''}
            </div>
        </section>
    )
}
