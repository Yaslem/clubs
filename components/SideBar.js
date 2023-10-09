import Link from "next/link";
import Styles from "../styles/SideBar.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAward,
    faBars, faClipboardUser, faCubesStacked,
    faFileContract, faFileSignature, faGear, faGraduationCap,
    faHouse, faObjectGroup,
    faPaste, faPeopleGroup, faScrewdriverWrench, faSquarePollVertical, faTags, faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import {sideActions} from "../redux/slices/sideSlice";
import useDeviceSize from "./useDeviceSize";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {widthActions} from "../redux/slices/widthSlice";

export default () => {
    const {data: session} = useSession()
    const dispatch = useDispatch();
    const router = useRouter();
    const sideBar = useSelector(state => state.width.sideBar)
    const isActive = useSelector(state => state.side.isActive);
    const isHide = useSelector(state => state.side.isHide);
    const isOpen = useSelector(state => state.side.isOpen);
    const [width, height] = useDeviceSize();


    function getActive(pathname){
        if(router.pathname.split('/').includes(pathname)){
            return Styles.true
        }else {
            return '';
        }
    }

    function getIsHide(){
        if(width <= 900){
            return  <FontAwesomeIcon icon={faBars} onClick={() => {
                dispatch(widthActions.setSideBar(sideBar == 80 ? 200 : 80))
                dispatch(sideActions.isOpen(!isOpen))
            }} />
        }else {
            dispatch(sideActions.isOpen(false));
            return null;
        }
    }

    function getStyle(){
        if(isOpen) {
            return `${Styles.aside} ${Styles.hide}`;
        }else {
            return `${Styles.aside}`;
        }
    }

    return (
        width <= 900
            ? <aside className={getStyle()}>
                <section>
                    <div>
                        <img src={'/uploads/files/default/site-logo.png'} alt={'logo'}/>
                        <FontAwesomeIcon icon={faBars} onClick={() => {
                            dispatch(widthActions.setSideBar(sideBar == 80 ? 200 : 80))
                            dispatch(sideActions.isOpen(!isOpen))
                        }} />
                    </div>
                    <div>
                        <ul>
                            <Link href={'/'} onClick={() => dispatch(sideActions.isOpen(true))}>
                                <li className={router.pathname == '/' && Styles.true}>
                                <span>
                                    <FontAwesomeIcon icon={faHouse} />
                                </span>
                                    <span>الرئيسية</span>
                                </li>
                            </Link>
                            {
                                session &&
                                <>
                                    {
                                        session.user.role !== 'admin' && session.user.role !== 'coordinator' && session.user.role !== 'president'
                                            ? <Link href={`/clubs/${session.user.club.name.split(' ').join('-')}`}>
                                                <li className={getActive(`/clubs/${session.user.club.name.split(' ').join('-')}`)}>
                                                <span>
                                                    <FontAwesomeIcon icon={faPeopleGroup} />
                                                </span>
                                                    <span>{session.user.club.name.length >= 10 ? session.user.club.name.slice(0, 10) + '...' : session.user.club.name}</span>
                                                </li>
                                            </Link>
                                            : null
                                    }
                                </>
                            }
                            {
                                session
                                    ? <>
                                        {
                                            (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showActivity.status
                                                ? <Link href={'/activities'} onClick={() => dispatch(sideActions.isOpen(true))}>
                                                    <li className={getActive('activities')}>
                                                        <span>
                                                            <FontAwesomeIcon icon={faFileContract} />
                                                        </span>
                                                        <span>الفعاليات</span>
                                                    </li>
                                                </Link>
                                                : null
                                        }
                                        {
                                            (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showDesign.status
                                                ? <Link href={'/designs'} onClick={() => dispatch(sideActions.isOpen(true))}>
                                                    <li className={getActive('designs')}>
                                                        <span>
                                                            <FontAwesomeIcon icon={faObjectGroup} />
                                                        </span>
                                                        <span>التصاميم</span>
                                                    </li>
                                                </Link>
                                                : null
                                        }
                                        {
                                            (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showDiscourse.status
                                                ? <Link href={'/discourses'} onClick={() => dispatch(sideActions.isOpen(true))}>
                                                    <li className={getActive('discourses')}>
                                                        <span>
                                                            <FontAwesomeIcon icon={faTags} />
                                                        </span>
                                                        <span>الخطابات</span>
                                                    </li>
                                                </Link>
                                                : null
                                        }
                                        {
                                            (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showPost.status
                                                ? <Link href={'/posts'} onClick={() => dispatch(sideActions.isOpen(true))}>
                                                    <li className={getActive('posts')}>
                                                        <span>
                                                            <FontAwesomeIcon icon={faPaste} />
                                                        </span>
                                                        <span>المنشورات</span>
                                                    </li>
                                                </Link>
                                                : null
                                        }
                                    </>
                                    : null
                            }
                            <Link href={'/clubs'} onClick={() => dispatch(sideActions.isOpen(true))}>
                                <li className={getActive('clubs')}>
                                <span>
                                    <FontAwesomeIcon icon={faCubesStacked} />
                                </span>
                                    <span>الأندية</span>
                                </li>
                            </Link>
                            <Link href={'/contacts'}>
                                <li className={getActive('contacts')}>
                                    <span>
                                        <FontAwesomeIcon icon={faFileSignature} />
                                    </span>
                                    <span>نظام تواصل</span>
                                </li>
                            </Link>
                            {
                                session &&
                                <>
                                    {
                                        (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showStudent.status
                                            ? <Link href={'/students'}>
                                                <li className={getActive('students')}>
                                                    <span>
                                                        <FontAwesomeIcon icon={faUsers} />
                                                    </span>
                                                    <span>الطلاب</span>
                                                </li>
                                            </Link>
                                            : null
                                    }
                                </>
                            }
                            {
                                session &&
                                (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showCertificate.status
                                    ? <Link href={'/certificates'}>
                                        <li className={getActive('certificates')}>
                                            <span>
                                                <FontAwesomeIcon icon={faGraduationCap} />
                                            </span>
                                            <span>الشهادات</span>
                                        </li>
                                    </Link>
                                    : <Link href={'/all-certificates'}>
                                        <li className={getActive('all-certificates')}>
                                            <span>
                                                <FontAwesomeIcon icon={faGraduationCap} />
                                            </span>
                                            <span>الشهادات</span>
                                        </li>
                                    </Link>
                            }
                            {
                                session &&
                                <>
                                    {
                                        (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showReport.status
                                            ? <Link href={'/reports'}>
                                                <li className={getActive('reports')}>
                                                    <span>
                                                        <FontAwesomeIcon icon={faGear} />
                                                    </span>
                                                    <span>التقارير</span>
                                                </li>
                                            </Link>
                                            : null
                                    }
                                </>
                            }
                            <Link href={'/attendees'}>
                                <li className={getActive('attendees')}>
                                    <span>
                                        <FontAwesomeIcon icon={faClipboardUser} />
                                    </span>
                                    <span>التحضير</span>
                                </li>
                            </Link>
                            {
                                session &&
                                (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showAward.status
                                    ? <Link href={'/awards'}>
                                        <li className={getActive('awards')}>
                                            <span>
                                                <FontAwesomeIcon icon={faAward} />
                                            </span>
                                            <span>الجوائز</span>
                                        </li>
                                    </Link>
                                    : <Link href={'/all-awards'}>
                                        <li className={getActive('all-awards')}>
                                            <span>
                                                <FontAwesomeIcon icon={faAward} />
                                            </span>
                                            <span>الجوائز</span>
                                        </li>
                                    </Link>
                            }
                            {
                                session &&
                                <>
                                    {
                                        session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                                            ? <Link href={'/tools'}>
                                                <li className={getActive('tools')}>
                                                    <span>
                                                        <FontAwesomeIcon icon={faScrewdriverWrench} />
                                                    </span>
                                                    <span>الأدوات</span>
                                                </li>
                                            </Link>
                                            : null
                                    }
                                </>
                            }
                            <Link href={'/results'}>
                                <li className={getActive('results')}>
                                    <span>
                                        <FontAwesomeIcon icon={faSquarePollVertical} />
                                    </span>
                                    <span>نتائج الأندية</span>
                                </li>
                            </Link>
                        </ul>
                    </div>
                </section>
            </aside>
            : <aside style={{
                width: `${sideBar}px`
            }} className={getStyle()}>
                <section>
                    <div style={sideBar == 80 ? {
                        flexDirection: "column",
                        gap: "10px",
                    } : null}>
                        <img src={'/uploads/files/default/site-logo.png'} alt={'logo'}/>
                        <FontAwesomeIcon icon={faBars} onClick={() => {
                            dispatch(widthActions.setSideBar(sideBar == 80 ? 200 : 80))
                            dispatch(sideActions.isOpen(!isOpen))
                        }} />
                        {
                            getIsHide()
                        }
                    </div>
                    <div>
                        <ul>
                            <Link href={'/'} onClick={() => dispatch(sideActions.isOpen(true))}>
                                <li style={sideBar == 80 ? {
                                    width: "38px",
                                    justifyContent: "center",
                                    gap: "0"
                                } : null} className={router.pathname == '/' && Styles.true}>
                                <span>
                                    <FontAwesomeIcon style={sideBar == 80 ? {
                                        fontSize: "20px"
                                    } : null} icon={faHouse} />
                                </span>
                                    {
                                        sideBar == 80
                                            ? null
                                            : <span>الرئيسية</span>
                                    }
                                </li>
                            </Link>
                            {
                                session &&
                                <>
                                    {
                                        session.user.role !== 'admin' && session.user.role !== 'coordinator' && session.user.role !== 'president'
                                            ? <Link href={`/clubs/${session.user.club.name.split(' ').join('-')}`}>
                                                <li style={sideBar == 80 ? {
                                                    width: "38px",
                                                    justifyContent: "center",
                                                    gap: "0"
                                                } : null} className={getActive(`/clubs/${session.user.club.name.split(' ').join('-')}`)}>
                                                <span>
                                                    <FontAwesomeIcon icon={faPeopleGroup} />
                                                </span>
                                                    {
                                                        sideBar == 80
                                                            ? null
                                                            : <span>{session.user.club.name.length >= 10 ? session.user.club.name.slice(0, 10) + '...' : session.user.club.name}</span>
                                                    }
                                                </li>
                                            </Link>
                                            : null
                                    }
                                </>
                            }
                            {
                                session
                                    ? <>
                                        {
                                            (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showActivity.status
                                                ? <Link href={'/activities'} onClick={() => dispatch(sideActions.isOpen(true))}>
                                                    <li style={sideBar == 80 ? {
                                                        width: "38px",
                                                        justifyContent: "center",
                                                        gap: "0"
                                                    } : null} className={getActive('activities')}>
                                                <span>
                                                    <FontAwesomeIcon icon={faFileContract} />
                                                </span>
                                                        {
                                                            sideBar == 80
                                                                ? null
                                                                : <span>الفعاليات</span>
                                                        }
                                                    </li>
                                                </Link>
                                                : null
                                        }
                                        {
                                            (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showDesign.status
                                                ? <Link href={'/designs'} onClick={() => dispatch(sideActions.isOpen(true))}>
                                                    <li style={sideBar == 80 ? {
                                                        width: "38px",
                                                        justifyContent: "center",
                                                        gap: "0"
                                                    } : null} className={getActive('designs')}>
                                                <span>
                                                    <FontAwesomeIcon icon={faObjectGroup} />
                                                </span>
                                                        {
                                                            sideBar == 80
                                                                ? null
                                                                : <span>التصاميم</span>
                                                        }
                                                    </li>
                                                </Link>
                                                : null
                                        }
                                        {
                                            (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showDiscourse.status
                                                ? <Link href={'/discourses'} onClick={() => dispatch(sideActions.isOpen(true))}>
                                                    <li style={sideBar == 80 ? {
                                                        width: "38px",
                                                        justifyContent: "center",
                                                        gap: "0"
                                                    } : null} className={getActive('discourses')}>
                                                <span>
                                                    <FontAwesomeIcon icon={faTags} />
                                                </span>
                                                        {
                                                            sideBar == 80
                                                                ? null
                                                                : <span>الخطابات</span>
                                                        }
                                                    </li>
                                                </Link>
                                                : null
                                        }
                                        {
                                            (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showPost.status
                                                ? <Link href={'/posts'} onClick={() => dispatch(sideActions.isOpen(true))}>
                                                    <li style={sideBar == 80 ? {
                                                        width: "38px",
                                                        justifyContent: "center",
                                                        gap: "0"
                                                    } : null} className={getActive('posts')}>
                                                <span>
                                                    <FontAwesomeIcon icon={faPaste} />
                                                </span>
                                                        {
                                                            sideBar == 80
                                                                ? null
                                                                : <span>المنشورات</span>
                                                        }
                                                    </li>
                                                </Link>
                                                : null
                                        }
                                    </>
                                    : null
                            }
                            <Link href={'/clubs'} onClick={() => dispatch(sideActions.isOpen(true))}>
                                <li style={sideBar == 80 ? {
                                    width: "38px",
                                    justifyContent: "center",
                                    gap: "0"
                                } : null} className={getActive('clubs')}>
                                <span>
                                    <FontAwesomeIcon icon={faCubesStacked} />
                                </span>
                                    {
                                        sideBar == 80
                                            ? null
                                            : <span>الأندية</span>
                                    }
                                </li>
                            </Link>
                            <Link href={'/contacts'}>
                                <li style={sideBar == 80 ? {
                                    width: "38px",
                                    justifyContent: "center",
                                    gap: "0"
                                } : null} className={getActive('contacts')}>
                                <span>
                                    <FontAwesomeIcon icon={faFileSignature} />
                                </span>
                                    {
                                        sideBar == 80
                                            ? null
                                            : <span>نظام تواصل</span>
                                    }
                                </li>
                            </Link>
                            {
                                session &&
                                <>
                                    {
                                        (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showStudent.status
                                            ? <Link href={'/students'}>
                                                <li style={sideBar == 80 ? {
                                                    width: "38px",
                                                    justifyContent: "center",
                                                    gap: "0"
                                                } : null} className={getActive('students')}>
                                                <span>
                                                    <FontAwesomeIcon icon={faUsers} />
                                                </span>
                                                    {
                                                        sideBar == 80
                                                            ? null
                                                            : <span>الطلاب</span>
                                                    }
                                                </li>
                                            </Link>
                                            : null
                                    }
                                </>
                            }
                            {
                                session &&
                                (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showCertificate.status
                                    ? <Link href={'/certificates'}>
                                        <li style={sideBar == 80 ? {
                                            width: "38px",
                                            justifyContent: "center",
                                            gap: "0"
                                        } : null} className={getActive('certificates')}>
                                            <span>
                                                <FontAwesomeIcon icon={faGraduationCap} />
                                            </span>
                                            {
                                                sideBar == 80
                                                    ? null
                                                    : <span>الشهادات</span>
                                            }
                                        </li>
                                    </Link>
                                    : <Link href={'/all-certificates'}>
                                        <li style={sideBar == 80 ? {
                                            width: "38px",
                                            justifyContent: "center",
                                            gap: "0"
                                        } : null} className={getActive('awards')}>
                                            <span>
                                                <FontAwesomeIcon icon={faGraduationCap} />
                                            </span>
                                            {
                                                sideBar == 80
                                                    ? null
                                                    : <span>الشهادات</span>
                                            }
                                        </li>
                                    </Link>
                            }
                            {
                                session &&
                                <>
                                    {
                                        (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showReport.status
                                            ? <Link href={'/reports'}>
                                                <li style={sideBar == 80 ? {
                                                    width: "38px",
                                                    justifyContent: "center",
                                                    gap: "0"
                                                } : null}>
                                                <span>
                                                    <FontAwesomeIcon icon={faGear} />
                                                </span>
                                                    {
                                                        sideBar == 80
                                                            ? null
                                                            : <span>التقارير</span>
                                                    }
                                                </li>
                                            </Link>
                                            : null
                                    }
                                </>
                            }
                            <Link href={'/attendees'}>
                                <li style={sideBar == 80 ? {
                                    width: "38px",
                                    justifyContent: "center",
                                    gap: "0"
                                } : null} className={getActive('attendees')}>
                                <span>
                                    <FontAwesomeIcon icon={faClipboardUser} />
                                </span>
                                    {
                                        sideBar == 80
                                            ? null
                                            : <span>التحضير</span>
                                    }
                                </li>
                            </Link>
                            {
                                session &&
                                (session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president' || session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showAward.status
                                    ? <Link href={'/awards'}>
                                        <li style={sideBar == 80 ? {
                                            width: "38px",
                                            justifyContent: "center",
                                            gap: "0"
                                        } : null} className={getActive('awards')}>
                                            <span>
                                                <FontAwesomeIcon icon={faAward} />
                                            </span>
                                            {
                                                sideBar == 80
                                                    ? null
                                                    : <span>الجوائز</span>
                                            }
                                        </li>
                                    </Link>
                                    : <Link href={'/all-awards'}>
                                        <li style={sideBar == 80 ? {
                                            width: "38px",
                                            justifyContent: "center",
                                            gap: "0"
                                        } : null} className={getActive('awards')}>
                                            <span>
                                                <FontAwesomeIcon icon={faAward} />
                                            </span>
                                            {
                                                sideBar == 80
                                                    ? null
                                                    : <span>الجوائز</span>
                                            }
                                        </li>
                                    </Link>
                            }
                            {
                                session &&
                                <>
                                    {
                                        session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                                            ? <Link href={'/tools'}>
                                                <li style={sideBar == 80 ? {
                                                    width: "38px",
                                                    justifyContent: "center",
                                                    gap: "0"
                                                } : null} className={getActive('tools')}>
                                                <span>
                                                    <FontAwesomeIcon icon={faScrewdriverWrench} />
                                                </span>
                                                    {
                                                        sideBar == 80
                                                            ? null
                                                            : <span>الأدوات</span>
                                                    }
                                                </li>
                                            </Link>
                                            : null
                                    }
                                </>
                            }
                            <Link href={'/results'}>
                                <li style={sideBar == 80 ? {
                                    width: "38px",
                                    justifyContent: "center",
                                    gap: "0"
                                } : null} className={getActive('results')}>
                                <span>
                                    <FontAwesomeIcon icon={faSquarePollVertical} />
                                </span>
                                    {
                                        sideBar == 80
                                            ? null
                                            : <span>نتائج الأندية</span>
                                    }
                                </li>
                            </Link>
                        </ul>
                    </div>
                </section>
            </aside>
    )
}
