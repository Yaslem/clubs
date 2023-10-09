import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCubesStacked, faFileExcel, faIdBadge, faMessage, faPaste, faPenClip} from "@fortawesome/free-solid-svg-icons";
import Styles from "../styles/IsFile.module.css"
import {useState} from "react";
import {useDispatch} from "react-redux";
import {isFileActions} from "../redux/slices/isFileSlice";
import {useRouter} from "next/router";

export default ({isFile = true, status = true, isClubs = false, isPost = false}) => {
    const route = useRouter()
    const dispatch = useDispatch()
    const [isActive, setIsActive] = useState(status)
    return (
        <ul className={Styles.index}>
            {
                isClubs
                    ? <>
                        <li className={isActive && Styles.active} onClick={() => {
                            setIsActive(true)
                            route.push('/clubs')
                        }}>
                            <FontAwesomeIcon icon={faCubesStacked} />
                            <span>جميع الأندية</span>
                        </li>
                        {
                            isFile &&
                            <li className={!isActive && Styles.active} onClick={() => {
                                setIsActive(false)
                                route.push('/clubs/my')
                            }}>
                                <FontAwesomeIcon icon={faIdBadge} />
                                <span>أنديتك</span>
                            </li>
                        }
                    </>
                    : isPost
                        ? <>
                            <li className={isActive && Styles.active} onClick={() => {
                                setIsActive(true)
                                route.push('/posts')
                            }}>
                                <FontAwesomeIcon icon={faPaste} />
                                <span>المنشورات</span>
                            </li>
                            {
                                isFile &&
                                <li className={!isActive && Styles.active} onClick={() => {
                                    setIsActive(false)
                                    route.push('/posts/comments')
                                }}>
                                    <FontAwesomeIcon icon={faMessage} />
                                    <span>التعليقات</span>
                                </li>
                            }
                        </>
                        : <>
                            <li className={isActive && Styles.active} onClick={() => {
                                setIsActive(true)
                                dispatch(isFileActions.set(false))
                            }}>
                                <FontAwesomeIcon icon={faPenClip} />
                                <span>إدخال</span>
                            </li>
                            {
                                isFile &&
                                <li className={!isActive && Styles.active} onClick={() => {
                                    setIsActive(false)
                                    dispatch(isFileActions.set(true))
                                }}>
                                    <FontAwesomeIcon icon={faFileExcel} />
                                    <span>ملف إكسل</span>
                                </li>
                            }
                        </>
            }
        </ul>
    )
}
