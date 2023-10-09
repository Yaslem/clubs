import Styles from "../styles/Comments.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import axios from "axios";
import swal from "sweetalert";
import Close from "./Close";
import {commentsActions} from "../redux/slices/commentsSlice";
import {useDispatch, useSelector} from "react-redux";

export default ({image, club, user, date, body, route, replyId, key}) => {
    const isEdit = useSelector(state => state.comments.isEdit)
    const dispatch = useDispatch()
    const [bodyEdit, setBodyEdit] = useState(body)
    const [isEditComment, setIsEditComment] = useState('')
    const [errorBody, setErrorBody] = useState('')
    const [loading, setLoading] = useState(false)
    function handlerSubmitEditComment(e){
        e.preventDefault()
        setLoading(true)
        if(bodyEdit.length == 0){
            setErrorBody('محتوى الرد مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorBody('')
        }
        setLoading(true)
        axios.put(`/contacts/replies/edit`, {
            replyId: replyId,
            body: bodyEdit,
        })
            .then( async (res) => {
                if(res.status === 201 ){
                    await swal({
                        title: 'تم!',
                        text: res.data.mess,
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                }else {
                    await swal({
                        title: 'خطأ!',
                        text: res.data.mess,
                        icon: "error",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                }
            })
    }
    return (
        <div className={Styles.index}>
            <div>
                <div>
                    <div>
                        <img src={image}/>
                        <div>
                            <span>{user.length >= 15 ? user.slice(0, 15) + '...' : user}</span>
                            <span>{'من ' + club}</span>
                        </div>
                    </div>
                    <div>{date}</div>
                </div>
                {
                    isEdit && isEditComment == key
                        ? <div>
                            <form onSubmit={handlerSubmitEditComment}>
                                <Close action={commentsActions.isEdit} />
                                <textarea defaultValue={bodyEdit} onChange={e => setBodyEdit(e.target.value)} placeholder={'اكتب محتوى التعليق'}></textarea>
                                {
                                    errorBody.length > 0 &&
                                    <div className={Styles.error}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="#E06469"
                                            stroke="#E06469"
                                            className="cf-icon-svg"
                                            viewBox="-1.7 0 20.4 20.4"
                                        >
                                            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
                                        </svg>
                                        <span>{errorBody}</span>
                                    </div>
                                }
                                {
                                    loading == true
                                        ?(
                                            <button style={{
                                                width: 'fit-content',
                                            }}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={30}
                                                    height={30}
                                                    fill="none"
                                                    className={Styles.loader}
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
                                            </button>
                                        ): <button>تعديل</button>
                                }
                            </form>
                        </div>
                        : <div>
                            <p>{body}</p>
                        </div>
                }
            </div>
        </div>
    )
}
