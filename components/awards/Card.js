import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Styles from "../../styles/awards/Card.module.css"
import {faCalendarDays, faChalkboardUser, faCubesStacked, faUserGraduate} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {useRouter} from "next/router";
import {attendeesActions} from "../../redux/slices/attendeesSlice";
import Close from "../../components/Close";
import {useDispatch, useSelector} from "react-redux";
import Form from "../../components/attendees/Form";
import swal from "sweetalert";
import axios from "axios";

export default ({isAward = false, isAttend = false, isCertificate = false, attendees = [], certificates = [], awards = [], session}) => {
    const router = useRouter()
    const isEditAttend = useSelector(state => state.attendees.isEdit)
    const dispatch = useDispatch()
    function getAwardsElements(){
        return (
            <section className={Styles.index}>
                {
                    awards.docs.map(award =>
                        award.activityId !== null
                            ? <div>
                                <div>
                                    <span>{award.activityId.title}</span>
                                </div>
                                <div>
                                    <ul>
                                        <li>
                                            <FontAwesomeIcon icon={faCubesStacked} />
                                            <span>{award.activityId.club.name.length >= 15 ? award.activityId.club.name.slice(0, 15) + '...' : award.activityId.club.name}</span>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faUserGraduate} />
                                            <span>{award.activityId.location.name}</span>
                                        </li>
                                    </ul>
                                    <hr/>
                                    <ul>
                                        <li>
                                            <FontAwesomeIcon icon={faChalkboardUser} />
                                            <span>{award.activityId.presenter.length >= 15 ? award.activityId.presenter.slice(0, 15) + '...' : award.activityId.presenter}</span>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faCalendarDays} />
                                            <span>{ award.activityId.createdAt.split('T')[0]}</span>
                                        </li>
                                    </ul>
                                </div>
                                <section>
                                    <Link style={{
                                        width: session.user.permissions.deleteAward.status ? "80%" : "100%"
                                    }} href={`${router.pathname}/${award._id}`}>عرض الطلاب</Link>
                                    {
                                        session.user.permissions.deleteAward.status &&
                                        <span onClick={() => {
                                            swal({
                                                title: 'هل أنت متأكد؟',
                                                text: `هل أنت متأكد من أنك تريد حذف الجائزة [${award.activityId.title}]`,
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
                                                    axios.delete(`/awards/delete?id=${award._id}`)
                                                        .then( async (res) => {
                                                            if(res.status === 201 ){
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
                                            });
                                        }}>
                                      <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={24}
                                          height={24}
                                          fill="none"
                                      >
                                        <path
                                            fill="#FD8A8A"
                                            fillOpacity={0.5}
                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                            opacity={0.4}
                                        />
                                        <path
                                            fill="#DC3535"
                                            fillOpacity={0.5}
                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                        />
                                      </svg>
                                    </span>
                                    }
                                </section>
                            </div>
                            : null
                    )
                }
            </section>
        )
    }
    function getCertificatesElements(){
        return (
            <section className={Styles.index}>
                {
                    certificates.docs.map(certificate =>
                        <div>
                            <div>
                                <span>{certificate.activityId.title}</span>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                        <FontAwesomeIcon icon={faCubesStacked} />
                                        <span>{certificate.activityId.club.name.length >= 15 ? certificate.activityId.club.name.slice(0, 15) + '...' : certificate.activityId.club.name}</span>
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={faUserGraduate} />
                                        <span>{certificate.activityId.location.name}</span>
                                    </li>
                                </ul>
                                <hr/>
                                <ul>
                                    <li>
                                        <FontAwesomeIcon icon={faChalkboardUser} />
                                        <span>{certificate.activityId.presenter.length >= 15 ? certificate.activityId.presenter.slice(0, 15) + '...' : certificate.activityId.presenter}</span>
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={faCalendarDays} />
                                        <span>{certificate.activityId.createdAt.split('T')[0]}</span>
                                    </li>
                                </ul>
                            </div>
                            <section>
                                <Link style={{
                                    width: session.user.permissions.deleteAward.status ? "80%" : "100%"
                                }} href={`${router.pathname}/${certificate._id}`}>عرض الطلاب</Link>
                                {
                                    session.user.permissions.deleteCertificate.status &&
                                    <span onClick={() => {
                                        swal({
                                            title: 'هل أنت متأكد؟',
                                            text: `هل أنت متأكد من أنك تريد حذف الشهادة [${certificate.activityId.title}]`,
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
                                                axios.delete(`/certificates/delete?id=${certificate._id}`)
                                                    .then( async (res) => {
                                                        if(res.status === 201 ){
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
                                        });
                                    }}>
                                      <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={24}
                                          height={24}
                                          fill="none"
                                      >
                                        <path
                                            fill="#FD8A8A"
                                            fillOpacity={0.5}
                                            d="M19.643 9.488c0 .068-.533 6.81-.837 9.646-.19 1.741-1.313 2.797-2.997 2.827-1.293.029-2.56.039-3.805.039-1.323 0-2.616-.01-3.872-.039-1.627-.039-2.75-1.116-2.931-2.827-.313-2.847-.836-9.578-.846-9.646a.794.794 0 0 1 .19-.558.71.71 0 0 1 .524-.234h13.87c.2 0 .38.088.523.234.134.158.2.353.181.558z"
                                            opacity={0.4}
                                        />
                                        <path
                                            fill="#DC3535"
                                            fillOpacity={0.5}
                                            d="M21 5.977a.722.722 0 0 0-.713-.733h-2.916a1.281 1.281 0 0 1-1.24-1.017l-.164-.73C15.738 2.618 14.95 2 14.065 2H9.936c-.895 0-1.675.617-1.913 1.546l-.152.682A1.283 1.283 0 0 1 6.63 5.244H3.714A.722.722 0 0 0 3 5.977v.38c0 .4.324.733.714.733h16.573A.729.729 0 0 0 21 6.357v-.38z"
                                        />
                                      </svg>
                                    </span>
                                }
                            </section>
                        </div>
                    )
                }
            </section>
        )
    }
    function getAttendeesElements(){
        return (
            <>
                {
                    isEditAttend &&
                        <>
                            <Close isAttend={true} action={attendeesActions.isEdit} />
                            <Form session={session}/>
                        </>
                }
                <section className={Styles.index}>
                    {
                        !isEditAttend &&
                            attendees.docs.map(attend =>
                                <div>
                                    <div>
                                        <span>{attend.title}</span>
                                    </div>
                                    <div>
                                        <ul>
                                            <li>
                                                <FontAwesomeIcon icon={faCubesStacked} />
                                                <span>{attend.club.name.length >= 15 ? attend.club.name.slice(0, 15) + '...' : attend.club.name}</span>
                                            </li>
                                            <li>
                                                <FontAwesomeIcon icon={faUserGraduate} />
                                                <span>23</span>
                                            </li>
                                        </ul>
                                        <ul>
                                            <li>
                                                <FontAwesomeIcon icon={faChalkboardUser} />
                                                <span>{attend.presenter.length >= 15 ? attend.presenter.slice(0, 15) + '...' : attend.presenter}</span>
                                            </li>
                                            <li>
                                                <FontAwesomeIcon icon={faCalendarDays} />
                                                <span>{ attend.createdAt.split('T')[0]}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <span onClick={ e => {
                                        dispatch(attendeesActions.isEdit(true))
                                        dispatch(attendeesActions.edit({
                                            id: attend._id,
                                        }))
                                    }}>تقييم</span>
                                </div>
                            )
                    }
                </section>
            </>
        )
    }
    return (<>
                {
                    isAward && getAwardsElements()
                }
                {
                    isCertificate && getCertificatesElements()
                }
                {
                    isAttend && getAttendeesElements()
                }
            </>)
}
