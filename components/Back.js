import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import Styles from '../styles/Back.module.css';
import {useRouter} from "next/router";

export default ({routeBack, isUsersAward = false}) => {
    const router = useRouter();
    return(
        <div className={Styles.back} onClick={() => isUsersAward || routeBack === "/activities" ? router.back() : router.push(process.env.BASE_URL + routeBack)}>
            <FontAwesomeIcon icon={faArrowLeft} rotation={180} />
        </div>
    )
}
