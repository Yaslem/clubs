import StylesM from "../../styles/clubs/Management.module.css";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faListCheck} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";

export default ({title, route, icon}) => {
    const router = useRouter()
    return (
        <Link href={router.pathname + route}>
            {
                icon
            }
            <span>{title}</span>
        </Link>
    )
}
