import Styles from "../styles/profile/index.module.css";
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBell,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import Alert from "./Alert";
import {useState} from "react";
import axios from "axios";
import Loading from "./Loading";
import swal from "sweetalert";
import Comments from "./Comments";
import {useSession} from "next-auth/react";
export default ({isLoading, data}) => {
    const {data: session} = useSession()
    const post = useSelector(state => state.posts.show)
    const [body, setBody] = useState('')
    const [errorBody, setErrorBody] = useState('')
    const [loading, setLoading] = useState(false)
    function handlerSubmitAddComment(e){
        e.preventDefault()
        setLoading(true)
        if(body.length == 0){
            setErrorBody('محتوى الرد مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorBody('')
        }
        setLoading(true)
        axios.post(`/posts/comments/add`, {
            postId: post.id,
            user: session.user.id,
            body: body,
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
                    e.target.reset()
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
        <>
            <section className={Styles.posts}>
                <div>
                    <div>
                        <img src={'/img/av.jpg'}/>
                        <div>
                            <span>{post.user}</span>
                            <span>{post.club}</span>
                        </div>
                    </div>
                    <div>
                        <span>{post.createdAt}</span>
                    </div>
                </div>
                <div>
                    <div>
                        <h5>{post.title}</h5>
                    </div>
                    <div>
                        <p>{post.body}</p>
                    </div>
                    {
                        post.image != null
                            ? <div style={{
                                width: "100%",
                                overflow: "hidden",
                                borderRadius: "var(--border-radius)",
                                border: "var(--border-primary)",
                            }}>
                                <img style={{
                                    width: "100%",
                                    height: "auto",
                                    overflow: "hidden",
                                    objectFit: "cover"
                                }} src={`/uploads/files/${post.image}`} />
                            </div>
                            : null
                    }
                </div>
                <div>
                    {
                        session
                            ? <form onSubmit={handlerSubmitAddComment}>
                                <span>إضافة تعليق</span>
                                <textarea onChange={e => setBody(e.target.value)} placeholder={'اكتب محتوى التعليق'}></textarea>
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
                                <Alert type={'warning'} title={'تنبيه!'} icon={<FontAwesomeIcon icon={faBell} />} msg={'لن يظهر تعليقك على المنشور إلا إذا وافقت عليه إدارة النادي.'} />
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
                                        ): <button>إضافة</button>
                                }
                            </form>
                            : <Alert type={'warning'} title={'تنبيه!'} icon={<FontAwesomeIcon icon={faBell} />} msg={'يجب تسجيل الدخول حتى تستطيع التعليق على هذا المنشور.'} />
                    }
                </div>
                {
                    session
                        ? <div>
                            <span>التعليقات</span>
                            {
                                isLoading
                                    ? <Loading />
                                    : data.success == false
                                        ? <Alert type={'error'} title={'لا توجد تعليقات!'} icon={<FontAwesomeIcon icon={faXmark} />} msg={'عفوا، لم نتمكن من العثور على بيانات.'} />
                                        : data.comments.map((comment, key) =>
                                            <Comments key={key} commentId={comment._id} user={comment.user.name} club={comment.user.club.name} date={comment.createdAt.split('T')[0]} route={''} image={'/img/av.jpg'} body={comment.body} />
                                        )
                            }
                        </div>
                        : null
                }
            </section>
        </>
    )
}
