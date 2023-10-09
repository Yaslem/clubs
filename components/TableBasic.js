import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons";
import Styles from '@/styles/TableBasic.module.css';
import axios from "axios";
import swal from "sweetalert";
import {useDispatch, useSelector} from "react-redux";
import {typesActions} from "@/redux/slices/typesSlice";
import {useRouter} from "next/router";
export default ({values, url, titleAction}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const deleteItem = (id) => {
        axios.delete(`/${url}/delete/${id}`)
            .then(res => {
            if(res.status === 200){
                swal({
                    title: 'تم!',
                    text: 'تم الحذف بنجاح.',
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
            }else {
                swal({
                    title: 'خطأ!',
                    text: 'يوجد خطأ ما.',
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
            }
        })
            .catch(function (error) {
                swal({
                    title: 'خطأ!',
                    text: 'يوجد خطأ ما.',
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
            })
    }

    return(
        <div className={Styles.index}>
            <table>
                <thead>
                <tr>
                    <th>الاسم</th>
                    <th>خيارات</th>
                </tr>
                </thead>
                <tbody>
                {
                    values.data?.map((value, key) =>
                        <tr key={key}>
                            <td>{value.name.trim()}</td>
                            <td>
                                <span onClick={() => {
                                    dispatch(titleAction.edit([value.id, value.name]))
                                    router.push(router.pathname + `/edit`)
                                }}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                </span>
                                <span onClick={e => {
                                    swal({
                                        title: "هل أنت متأكد؟",
                                        text: `هل أنت متأكد من أنك تريد حذف النوع ${value.name.trim()}`,
                                        icon: "warning",
                                        buttons: {
                                            cancel: {
                                                text: "إلغاء",
                                                value: null,
                                                visible: true,
                                                className: "",
                                                closeModal: true,
                                            },
                                            confirm: {
                                                text: "موافق",
                                                value: true,
                                                visible: true,
                                                className: "",
                                                closeModal: true
                                            },
                                        },
                                        dangerMode: true,
                                    }).then((willDelete) => {
                                        if (willDelete) {
                                            deleteItem(value.id);
                                        }
                                    });
                                }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    )
}