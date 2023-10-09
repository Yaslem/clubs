import StylesCard from "../../styles/clubs/Card.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from 'next/image';
import {
    faBan,
    faCheck,
    faNewspaper,
    faPersonChalkboard,
    faPlus,
    faUserGraduate
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import axios from "axios";
import swal from "sweetalert";
import useSWR from "swr";
const fetcher = url => axios.get(url).then(res => res.data);

export default ({clubId, session, name, image, numberUsers, numberPosts, numberActivities, isMyClubs = false, isPrimaryClub = false}) => {
    const { data, isError, isLoading } = useSWR(`/clubs/subscription/get`, fetcher)

    function addSubscription(club){
        axios.post(`clubs/subscription/add`, {
            club: club,
        }).then(async res => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
            }
        })
    }
    function deleteSubscription(club) {
        axios.post(`clubs/subscription/delete`, {
            club: club,
        }).then(async res => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
            }else {
                await swal({
                    title: 'خطأ!',
                    text: res.data.mess,
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
            }
        })
    }

    function getSubscription(subscriptions, clubId){
        let status = false
        subscriptions.map(subscription => {
            if(subscription.club == clubId){
                status = true
            }
        })
        return status
    }
    return (
        <div>
            {
                isLoading
                    ? <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={30}
                            height={30}
                            fill="none"
                            className={StylesCard.loader}
                            viewBox="0 0 16 16"
                        >
                            <g fill="#fff" fillRule="evenodd" clipRule="evenodd">
                                <path
                                    d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"
                                    opacity={0.2}
                                />
                                <path d="M7.25.75A.75.75 0 0 1 8 0a8 8 0 0 1 8 8 .75.75 0 0 1-1.5 0A6.5 6.5 0 0 0 8 1.5a.75.75 0 0 1-.75-.75z" />
                            </g>
                        </svg>
                    </div>
                    : session
                        ? getSubscription(data.subscriptions, clubId)
                            ? isMyClubs
                                ? <div style={{backgroundColor: "#FF6D60"}} onClick={ e => {
                                    swal({
                                        title: 'هل أنت متأكد؟',
                                        text: `هل أنت متأكد من أنك تريد إلغاء الاشتراك في عضوية [${name}]`,
                                        icon: 'warning',
                                        buttons: {
                                            cancel: {
                                                text: 'إلغاء',
                                                value: null,
                                                visible: true,
                                                className: '',
                                                closeModal: true,
                                            },
                                            confirm: {
                                                text: 'موافق',
                                                value: true,
                                                visible: true,
                                                className: '',
                                                closeModal: true
                                            },
                                        },
                                        dangerMode: true,
                                    }).then((willDelete) => {
                                        if (willDelete) {
                                            deleteSubscription(clubId)
                                        }
                                    });
                                }}>
                                    <span>إلغاء الاشتراك</span>
                                    <span><FontAwesomeIcon icon={faBan} /></span>
                                </div>
                                : <div style={{backgroundColor: "rgb(37, 145, 121)"}}>
                                    <span>تم الاشتراك بنجاح</span>
                                    <span><FontAwesomeIcon icon={faCheck} /></span>
                                </div>
                            : isPrimaryClub
                                ? <div style={{backgroundColor: "rgb(37, 145, 121)"}}>
                                    <span>ناديك الأساسي</span>
                                </div>
                                : <div onClick={ e => {
                                    swal({
                                        title: 'هل أنت متأكد؟',
                                        text: `هل أنت متأكد من أنك تريد الاشتراك في عضوية [${name}]`,
                                        icon: 'warning',
                                        buttons: {
                                            cancel: {
                                                text: 'إلغاء',
                                                value: null,
                                                visible: true,
                                                className: '',
                                                closeModal: true,
                                            },
                                            confirm: {
                                                text: 'موافق',
                                                value: true,
                                                visible: true,
                                                className: '',
                                                closeModal: true
                                            },
                                        },
                                        dangerMode: true,
                                    }).then((willDelete) => {
                                        if (willDelete) {
                                            addSubscription(clubId)
                                        }
                                    });
                                }}>
                                <span>اشترك الآن</span>
                                <span><FontAwesomeIcon icon={faPlus} /></span>
                            </div>
                        : <div></div>
            }
            <Image src={`/uploads/files/${image}`} width={100} height={100}/>
            <h5>{name}</h5>
            <div>
                    <span>
                        <FontAwesomeIcon icon={faUserGraduate} />
                        <span>{numberUsers}</span>
                    </span>
                <span>
                        <FontAwesomeIcon icon={faNewspaper} />
                        <span>{numberPosts}</span>
                    </span>
                <span>
                        <FontAwesomeIcon icon={faPersonChalkboard} />
                        <span>{numberActivities}</span>
                    </span>
            </div>
            <Link href={`/clubs/${name.split(' ').join('-')}`}>صفحة النادي</Link>
        </div>
    )
}
