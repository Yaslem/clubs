import Link from "next/link";
import Styles from "../styles/tools/Card.module.css"

export default ({icon, title, mess, router}) => {
    return (
        <div className={Styles.card}>
            {icon}
            <h4>{title}</h4>
            <p>{mess}</p>
            <Link href={router}>عرض</Link>
        </div>
    )
}
