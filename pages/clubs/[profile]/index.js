import Styles from "../../../styles/Index.module.css"
import StylesProfile from "../../../styles/clubs/Profile.module.css"
import Head from "next/head";
import Image from 'next/image';
import HeaderPages from "../../../components/HeaderPages";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBullseye, faCalendarDay, faCalendarDays, faCalendarWeek, faChalkboardUser, faCircleInfo,
    faClock, faCubesStacked, faFileInvoice, faHeart, faHouse, faInfo, faLink,
    faLocationDot, faMessage, faNoteSticky, faPaste, faUsersGear, faXmark
} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import useSWR from "swr";
import axios from "axios";
import Loading from "../../../components/Loading";
import {useState} from "react";
import Pagination from "../../../components/Pagination";
import Alert from "../../../components/Alert";
import useDeviceSize from "../../../components/useDeviceSize";
import swal from "sweetalert";
const fetcher = url => axios.get(url).then(res => res.data);
export async function getServerSideProps(context) {
    const name = context.query.profile
    const res = await axios.get(`/clubs/profile?name=${name.split('-').join(' ')}`)
    const club = res.data.club
    return { props: {club} }
}
export default ({club}) => {
    const router = useRouter()
    const [width, height] = useDeviceSize();
    const [active, setActive] = useState(1)
    const [isActive, setIsActive] = useState(1)
    const [url, setUrl] = useState('activities')
    const { data, isError, isLoading } = useSWR(`/clubs/${url}?club=${club._id}&page=${router.query.page || 1}`, fetcher)

    const title = club.name;
    return (
        <>
            <Head>
                <title>{`${title} | ${process.env.SITE_TITLE}`}</title>
            </Head>
            <section className={Styles.index}>
                <HeaderPages title={'الأندية'} isBack={true} routeBack={'/clubs'}/>
                <section className={StylesProfile.index}>
                    <div>
                        <div>
                            <Image src={`/uploads/files/${club.cover}`}  width={100} height={100}/>
                            <div>
                                <div>
                                    <Image src={`/uploads/files/${club.avatar}`} width={100} height={100}/>
                                    <div>
                                        <h6>{club.name}</h6>
                                        <span>عدد الأعضاء : {club.studentsCount}</span>
                                    </div>
                                </div>
                                <div></div>
                            </div>
                        </div>
                        <div>
                            <ul>
                                <li className={active == 1 && StylesProfile.active} onClick={e => {
                                    setUrl("activities")
                                    setActive(1)
                                }}>
                                    <FontAwesomeIcon icon={faHouse} />
                                    <span>الرئيسية</span>
                                </li>
                                <li className={active == 2 && StylesProfile.active} onClick={e => setActive(2)}>
                                    <FontAwesomeIcon icon={faInfo} />
                                    <span>عن النادي</span>
                                </li>
                                <li className={active == 3 && StylesProfile.active} onClick={e => setActive(3)}>
                                    <FontAwesomeIcon icon={faFileInvoice} />
                                    <span>الرؤية</span>
                                </li>
                                <li className={active == 4 && StylesProfile.active} onClick={e => setActive(4)}>
                                    <FontAwesomeIcon icon={faNoteSticky} />
                                    <span>الرسالة</span>
                                </li>
                                <li className={active == 5 && StylesProfile.active} onClick={e => setActive(5)}>
                                    <FontAwesomeIcon icon={faBullseye} />
                                    <span>الأهداف</span>
                                </li>
                            </ul>
                            <section onClick={e => {
                                setUrl("administrative")
                                setActive(6)
                            }}>
                                <FontAwesomeIcon icon={faUsersGear} />
                                <span>إدارة النادي</span>
                            </section>
                        </div>
                    </div>
                    <div>
                        {
                            active === 1
                            ? <section>
                                <div>
                                    <ul>
                                        <li>
                                            <FontAwesomeIcon icon={faCircleInfo} />
                                            <div>
                                                <span>عن النادي</span>
                                                <p>{club.description === "null" ? "لا يوجد تعريف للنادي." : club.description}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faFileInvoice} />
                                            <div>
                                                <span>الرؤية</span>
                                                <p>{club.vision === "null" ? "لا توجد رؤية للنادي." : club.vision}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faNoteSticky} />
                                            <div>
                                                <span>الرسالة</span>
                                                <p>{club.message === "null" ? "لا توجد رسالة للنادي." : club.message}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                {
                                    isLoading
                                        ? <Loading />
                                        : <div>
                                            <div>
                                                <div className={isActive === 1 && StylesProfile.active} onClick={e => {
                                                    // router.push(`/clubs/${router.query.profile}`)
                                                    setUrl("activities")
                                                    setIsActive(1)
                                                }}>
                                                    <FontAwesomeIcon icon={faCalendarDay} />
                                                    <span>الفعاليات</span>
                                                </div>
                                                <div className={isActive === 2 && StylesProfile.active} onClick={e => {
                                                    // router.push(`/clubs/${router.query.profile}`)
                                                    setUrl("posts")
                                                    setIsActive(2)
                                                }}>
                                                    <FontAwesomeIcon icon={faPaste} />
                                                    <span>المنشورات</span>
                                                </div>
                                                <div className={isActive === 3 && StylesProfile.active} onClick={e => {
                                                    router.push(`/clubs/${router.query.profile}`)
                                                    setUrl("weeks")
                                                    setIsActive(3)
                                                }}>
                                                    <FontAwesomeIcon icon={faCalendarWeek} />
                                                    <span>هذا الأسبوع</span>
                                                </div>
                                            </div>
                                            {
                                                isActive === 1
                                                    ? isLoading
                                                        ? <Loading />
                                                        : data.activities.totalDocs === 0
                                                            ? <Alert type={'error'} title={'لا توجد فعاليات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                                            : <>
                                                                <div>
                                                                    {
                                                                        data.activities.docs.map(activity =>
                                                                            <div>
                                                                                <div>
                                                                                    <span>{activity.title}</span>
                                                                                </div>
                                                                                <div>
                                                                                    <ul>
                                                                                        <li>
                                                                                            <div>
                                                                                                <FontAwesomeIcon icon={faCubesStacked} />
                                                                                                <span>{activity.club.name.length > 20 ? activity.club.name.slice(0, 19) + "..." : activity.club.name}</span>
                                                                                            </div>
                                                                                            <div>
                                                                                                <FontAwesomeIcon icon={faLocationDot} />
                                                                                                <span>{activity.location.name.length > 20 ? activity.location.name.slice(0, 19) + '...' : activity.location.name}</span>
                                                                                            </div>
                                                                                        </li>
                                                                                        <hr/>
                                                                                        <li>
                                                                                            <div>
                                                                                                <FontAwesomeIcon icon={faClock} />
                                                                                                <span>من {activity.from}</span>
                                                                                            </div>
                                                                                            <div>
                                                                                                <FontAwesomeIcon icon={faClock} />
                                                                                                <span>إلى {activity.to}</span>
                                                                                            </div>
                                                                                        </li>
                                                                                        <hr/>
                                                                                        <li>
                                                                                            <div>
                                                                                                <FontAwesomeIcon icon={faChalkboardUser} />
                                                                                                <span>{activity.presenter.length > 20 ? activity.presenter.slice(0, 19) + '...' : activity.presenter}</span>
                                                                                            </div>
                                                                                            <div>
                                                                                                <FontAwesomeIcon icon={faCalendarDays} />
                                                                                                <span>{activity.date.split('T')[0]}</span>
                                                                                            </div>
                                                                                        </li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                                {
                                                                    data.activities.totalPages > 1 && <Pagination isClub={true} url={`/clubs/${router.query.profile}`} page={data.activities.page} hasNextPage={data.activities.hasNextPage} hasPrevPage={data.activities.hasPrevPage} nextPage={data.activities.nextPage} prevPage={data.activities.prevPage} />
                                                                }
                                                            </>
                                                    : null
                                            }
                                            {
                                                isActive == 2
                                                    ? data.posts.totalDocs == 0
                                                        ? <Alert type={'error'} title={'لا توجد فعاليات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                                        : <>
                                                            <div>
                                                                {
                                                                    data.posts.docs.map(post =>
                                                                        <section className={StylesProfile.posts}>
                                                                            {
                                                                                post.image != "NULL"
                                                                                    ? <Image style={{
                                                                                        cursor: "pointer"
                                                                                    }} onClick={e => router.push(`/clubs/${club.name.split(' ').join('-')}/post?title=${post.title.split(' ').join('-')}&clubId=${club._id}`)} src={`/uploads/files/${post.image}`} width={100} height={100}/>
                                                                                    : null
                                                                            }
                                                                            <section>
                                                                                <div style={{
                                                                                    cursor: "pointer"
                                                                                }} onClick={e => router.push(`/clubs/${club.name.split(' ').join('-')}/post?title=${post.title.split(' ').join('-')}&clubId=${club._id}`)}>
                                                                                    <h5>{post.title}</h5>
                                                                                    <p>{post.body.length >= 135 ? post.body.slice(0, 135) + '...' : post.body}</p>
                                                                                </div>
                                                                                <hr/>
                                                                                <div style={{
                                                                                    cursor: "pointer"
                                                                                }} onClick={e => router.push(`/clubs/${club.name.split(' ').join('-')}/post?title=${post.title.split(' ').join('-')}&clubId=${club._id}`)}>
                                                                                    <Image src={`/uploads/files/${post.user.avatar}`} width={100} height={100}/>
                                                                                    <div>
                                                                                        <h4>{post.user.name}</h4>
                                                                                        <span>{post.createdAt.split('T')[0]}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <hr/>
                                                                                <div>
                                                                                    <div onClick={async e => {
                                                                                        try {
                                                                                            await navigator.clipboard.writeText(`${process.env.BASE_URL}/clubs/${club.name.split(' ').join('-')}/post?title=${post.title.split(' ').join('-')}&clubId=${club._id}`);
                                                                                            await swal({
                                                                                                title: 'تم!',
                                                                                                text: "تم نسخ رابط المنشور بنجاح.",
                                                                                                icon: "success",
                                                                                                button: false,
                                                                                                timer: 2000,
                                                                                            });
                                                                                        } catch (err) {
                                                                                            await swal({
                                                                                                title: 'خطأ!',
                                                                                                text: "عفوا، حدث خطأ ما أثناء عملية النسح.",
                                                                                                icon: "error",
                                                                                                button: false,
                                                                                                timer: 2000,
                                                                                            });
                                                                                        }
                                                                                    }}>
                                                                                        <FontAwesomeIcon icon={faLink} />
                                                                                    </div>
                                                                                    <div>
                                                                                        <div>
                                                                                            <FontAwesomeIcon icon={faHeart} />
                                                                                            <span>0</span>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            cursor: "pointer"
                                                                                        }} onClick={e => router.push(`/clubs/${club.name.split(' ').join('-')}/post?title=${post.title.split(' ').join('-')}&clubId=${club._id}`)}>
                                                                                            <FontAwesomeIcon icon={faMessage} />
                                                                                            <span>0</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </section>
                                                                        </section>
                                                                    )
                                                                }
                                                            </div>
                                                            {
                                                                data.posts.totalPages > 1 && <Pagination isClub={true} url={`/clubs/${router.query.profile}`} page={data.activities.page} hasNextPage={data.activities.hasNextPage} hasPrevPage={data.activities.hasPrevPage} nextPage={data.activities.nextPage} prevPage={data.activities.prevPage} />
                                                            }
                                                        </>
                                                    : null
                                            }
                                            {
                                                isActive === 3
                                                    ? data.activities.totalDocs === 0
                                                        ? <Alert type={'error'} title={'لا توجد فعاليات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                                        : <>
                                                            <div>
                                                                {
                                                                    data.activities.docs.map(activity =>
                                                                        <div>
                                                                            <div>
                                                                                <span>{activity.title}</span>
                                                                            </div>
                                                                            <div>
                                                                                <ul>
                                                                                    <li>
                                                                                        <div>
                                                                                            <FontAwesomeIcon icon={faCubesStacked} />
                                                                                            <span>{activity.club.name}</span>
                                                                                        </div>
                                                                                        <div>
                                                                                            <FontAwesomeIcon icon={faLocationDot} />
                                                                                            <span>{activity.location.name}</span>
                                                                                        </div>
                                                                                    </li>
                                                                                    <hr/>
                                                                                    <li>
                                                                                        <div>
                                                                                            <FontAwesomeIcon icon={faClock} />
                                                                                            <span>من {activity.from}</span>
                                                                                        </div>
                                                                                        <div>
                                                                                            <FontAwesomeIcon icon={faClock} />
                                                                                            <span>إلى {activity.to}</span>
                                                                                        </div>
                                                                                    </li>
                                                                                    <hr/>
                                                                                    <li>
                                                                                        <div>
                                                                                            <FontAwesomeIcon icon={faChalkboardUser} />
                                                                                            <span>{activity.presenter}</span>
                                                                                        </div>
                                                                                        <div>
                                                                                            <FontAwesomeIcon icon={faCalendarDays} />
                                                                                            <span>{activity.date.split('T')[0]}</span>
                                                                                        </div>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                            {
                                                                data.activities.totalPages > 1 && <Pagination isClub={true} url={`/clubs/${router.query.profile}`} page={data.activities.page} hasNextPage={data.activities.hasNextPage} hasPrevPage={data.activities.hasPrevPage} nextPage={data.activities.nextPage} prevPage={data.activities.prevPage} />
                                                            }
                                                        </>
                                                    : null
                                            }
                                        </div>
                                }
                            </section>
                            : <div style={{
                                width: "100%",
                                backgroundColor: isLoading ? "#ffffff00" : "white",
                                border: isLoading ? "0" : "var(--border-primary)"
                                }}>
                                 <ul>
                                        {
                                            active === 2 &&
                                            <li>
                                                <FontAwesomeIcon icon={faCircleInfo} />
                                                <div>
                                                    <span>عن النادي</span>
                                                    <p>{club.description === "null" ? "لا يوجد تعريف للنادي." : club.description}</p>
                                                </div>
                                            </li>
                                        }
                                        {
                                            active === 3 &&
                                            <li>
                                                <FontAwesomeIcon icon={faFileInvoice} />
                                                <div>
                                                    <span>الرؤية</span>
                                                    <p>{club.vision === "null" ? "لا توجد رؤية للنادي." : club.vision}</p>
                                                </div>
                                            </li>
                                        }
                                        {
                                            active === 4 &&
                                            <li>
                                                <FontAwesomeIcon icon={faNoteSticky} />
                                                <div>
                                                    <span>الرسالة</span>
                                                    <p>{club.message === "null" ? "لا توجد رسالة للنادي." : club.message}</p>
                                                </div>
                                            </li>
                                        }
                                        {
                                            active === 5
                                                ? club.goals === "null"
                                                    ? <li>
                                                        <FontAwesomeIcon icon={faBullseye} />
                                                        <div>
                                                            <span>الأهداف</span>
                                                            <p>لا توجد أهداف للنادي</p>
                                                        </div>
                                                    </li>
                                                    : club.goals.split('،').map((goal, kye) =>
                                                        <li>
                                                            <FontAwesomeIcon icon={faBullseye} />
                                                            <div>
                                                                <span>الهدف {kye + 1}</span>
                                                                <p>{goal}</p>
                                                            </div>
                                                        </li>
                                                    )
                                                : null
                                        }
                                     {
                                         active === 6
                                             ? isLoading
                                                ? <Loading />
                                                : <div>
                                                     {
                                                         data.club.manager !== null
                                                            ? <>
                                                                 <div>
                                                                     <img src={`/uploads/files/${data.club.manager.avatar}`}/>
                                                                     <div>
                                                                         <h4>{data.club.manager.name}</h4>
                                                                         <span>رئيس النادي</span>
                                                                     </div>
                                                                 </div>
                                                                 <hr/>
                                                                 <div>
                                                                     {
                                                                         data.administrative.map(administrative =>
                                                                             <>
                                                                                 <div>
                                                                                     <img src={`/uploads/files/${administrative.user.avatar}`}/>
                                                                                     <div>
                                                                                         <h4>{administrative.user.name}</h4>
                                                                                         <span>مسؤول {administrative.administrative.name}</span>
                                                                                     </div>
                                                                                 </div>
                                                                                 {
                                                                                     administrative.deputy !== null
                                                                                         ? <div>
                                                                                             <img src={`/uploads/files/${administrative.deputy.avatar}`}/>
                                                                                             <div>
                                                                                                 <h4>{administrative.deputy.name}</h4>
                                                                                                 <span>نائب مسؤول {administrative.administrative.name}</span>
                                                                                             </div>
                                                                                         </div>
                                                                                         : null
                                                                                 }
                                                                             </>
                                                                         )
                                                                     }
                                                                 </div>
                                                             </>
                                                            : <span>لا توجد إدارة للنادي</span>
                                                     }
                                                 </div>
                                             : null
                                     }
                                    </ul>
                             </div>
                        }
                    </div>
                </section>
            </section>
        </>
    )
}
