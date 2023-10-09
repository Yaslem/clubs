import Styles from '../styles/Header.module.css'
import {useDispatch, useSelector} from "react-redux";
import {faBars, faRightFromBracket, faRightToBracket, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {sideActions} from "../redux/slices/sideSlice";
import {useState} from "react";
import {signOut, useSession} from "next-auth/react";
import useDeviceSize from "./useDeviceSize";
import Link from "next/link";
import Image from 'next/image';
import {useRouter} from "next/router";

export default () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const {data: session} = useSession()
    const [isProfile, setIsProfile] = useState(false)
    const header = useSelector(state => state.header.title);
    const isHide = useSelector(state => state.side.isHide);
    const isOpen = useSelector(state => state.side.isOpen);
    const [width, height] = useDeviceSize();
    function getIsHide(){
        if(width <= 900){
            dispatch(sideActions.isHide(true))
            return <FontAwesomeIcon icon={faBars} onClick={() => dispatch(sideActions.isOpen(!isOpen))} />
        }else {
            dispatch(sideActions.isHide(false));
            return '';
        }
    }

    return(
        <>

            <header className={Styles.header}>
                <div>
                    {
                        getIsHide()
                    }
                    <h3>الأندية الطلابية{width <= 250 ? null : " - 1445 هـ"}</h3>
                </div>
                <div>
                    {
                        session?.user
                         ? <>
                                <Image onClick={e => setIsProfile(!isProfile)} src={`/uploads/files/${session.user.avatar}`} width={100} height={100}/>
                                {
                                    isProfile == true &&
                                        <ul>
                                            <li onClick={e => router.push(`/${session?.user.username}`)}>
                                                <FontAwesomeIcon icon={faUser} />
                                                <span>الملف الشخصي</span>
                                            </li>
                                            <hr />
                                            <li onClick={e => signOut()}>
                                                <FontAwesomeIcon icon={faRightFromBracket} />
                                                <span>تسجيل الخروج</span>
                                            </li>
                                        </ul>
                                }
                            </>
                         : <Link className={Styles.login} href={'/auth/signin'}>
                                <span>تسجيل الدخول</span>
                                <FontAwesomeIcon icon={faRightToBracket} />
                            </Link>
                    }
                </div>
            </header>
        </>
    );
}
