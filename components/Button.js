import Link from "next/link";
import Styles from "../styles/Button.module.css"

export default ({title, icon, route}) => {
    return (
        <Link className={Styles.button} href={route}>
            <span>{title}</span>
            {icon}
        </Link>
    )
}
