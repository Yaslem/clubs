import Styles from "../styles/profile/index.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCameraRotate, faUnlockKeyhole, faUserPen} from "@fortawesome/free-solid-svg-icons";
import {useDispatch} from "react-redux";
import {profilesActions} from "../redux/slices/profilesSlice";
import axios from "axios";
import Image from 'next/image';
import swal from "sweetalert";
import {signOut} from "next-auth/react";
export default ({session}) => {
    const dispatch = useDispatch()
    function getType(type){
        switch (type){
            case "student":
                return "طالب"
                break;
            case "admin":
                return "مدير الموقع"
                break;
            case "manager":
                return "مدير"
                break;
            case "president":
                return "المشرف"
                break;
            case "officials":
                return "مسؤول"
                break;
            case "deputy":
                return "نائب"
                break;
            case "coordinator":
                return "منسق"
                break;
        }
    }
    return (
        <div className={Styles.profile}>
            <div>
                <div>
                    <Image src={`/uploads/files/${session.user.avatar}`} width={100} height={100}/>
                    <span className={Styles.editPhoto}>
                        <FontAwesomeIcon icon={faCameraRotate} />
                    </span>
                    <input
                        accept={"image/*"}
                        onChange={e => {
                            const formData = new FormData();
                            formData.append('avatar', e.target.files[0]);
                            axios.put(`/profiles/setAvatar`, formData).then( async (res) => {
                                if(res.status === 201){
                                    await swal({
                                        title: 'تم!',
                                        text: res.data.mess,
                                        icon: "success",
                                        button: false,
                                        timer: 2000,
                                    });
                                    await signOut()
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
                        }}
                        type={"file"}/>
                </div>
                <div>
                    <span>{session.user.username}</span>
                    <span>{session.user.email}</span>
                </div>
                <section onClick={e => {
                    axios.get('/auth/get').then(res => {
                        dispatch(profilesActions.get(res.data))
                        dispatch(profilesActions.isEdit(true))
                    });
                }}>
                    <span>تعديل الحساب</span>
                    <FontAwesomeIcon icon={faUserPen} />
                </section>
                <section onClick={e => {
                    dispatch(profilesActions.isEditPassword(true))
                }}>
                    <span>تغيير كلمة المرور</span>
                    <FontAwesomeIcon icon={faUnlockKeyhole} />
                </section>
            </div>
            <div>
                <ul className={Styles.pro}>
                    <li>
                        <div>
                            <span>الاسم</span>
                            <span>{session.user.name}</span>
                        </div>
                        <div>
                            <span>الهوية</span>
                            <span>{session.user.idNumber}</span>
                        </div>
                    </li>
                    <hr />
                    <li>
                        <div>
                            <span>النادي</span>
                            <span>{session.user.club.name}</span>
                        </div>
                        <div>
                            <span>الكلية</span>
                            <span>{session.user.college.name}</span>
                        </div>
                    </li>
                    <hr />
                    <li>
                        <div>
                            <span>المستوى</span>
                            <span>{session.user.level.name}</span>
                        </div>
                        <div>
                            <span>الدولة</span>
                            <span>{session.user.country.name}</span>
                        </div>
                    </li>
                    <hr />
                    <li>
                        <div>
                            <span>رقم الواتساب</span>
                            <span>{session.user.whatsapp}</span>
                        </div>
                        <div>
                            <span>نوع الحساب</span>
                            <span>{getType(session.user.role)}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}
