import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan} from "@fortawesome/free-solid-svg-icons";
import Styles from "../styles/Close.module.css"
import {useDispatch} from "react-redux";
export default ({action, isShow = false, isAttend}) => {
    const dispatch = useDispatch()
    return (
        <div className={Styles.index} onClick={() => dispatch(action(false))}>
            <span>{isShow ? 'إلغاء المشاهدة' : isAttend ? 'إلغاء التقييم' : 'إلغاء التعديل'}</span>
            <FontAwesomeIcon icon={faBan} />
        </div>
    )
}
