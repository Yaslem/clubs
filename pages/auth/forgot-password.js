import Styles from "../../styles/auth/register.module.css";
import StylesUser from "../../styles/FormUser.module.css";
import Link from "next/link";
import Head from "next/head";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {signIn, useSession} from "next-auth/react";
import {getServerSession} from "next-auth";
import {options} from "../api/auth/[...nextauth]";
import {NextSeo} from "next-seo";
import axios from "axios";
import swal from "sweetalert";
export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, options)
    if (!session) {
        return { props: {} }
    }else {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

}
export default () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    // fields
    const [username, setUsername] = useState('')
    const [errorUsername, setErrorUsername] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handlerSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if(username.length == 0) {
            setErrorUsername('الرقم الجامعي مطلوب.')
            setLoading(false)
            return false
        }else if(username.length < 9) {
            setErrorUsername('الرقم الجامعي يجب أن يكون أطول من 8 أرقام.')
            setLoading(false)
            return false
        }else if(username.length > 9) {
            setErrorUsername('الرقم الجامعي يجب أن يكون أصغر من 10 أرقام.')
            setLoading(false)
            return false
        }else {
            setErrorUsername('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/auth/forgot-password`, {username})
            .then( async (res) => {
                if(res.status === 201){
                    await swal({
                        title: 'تم!',
                        text: res.data.mess,
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                    setSuccess(res.data.mess)
                    setError("")
                    setLoading(false)
                }else {
                    await swal({
                        title: 'تم!',
                        text: res.data.mess,
                        icon: "error",
                        button: false,
                        timer: 2000,
                    });
                    setSuccess("")
                    setError(res.data.mess)
                    setLoading(false)
                }
            }).catch(err => {
            setError("")
            setSuccess("")
            setLoading(false)
        })

    }
    const title = "نسيت كلمة المرور"
    return (
        <>
            <NextSeo
                title={`${title} | ${process.env.SITE_TITLE}`}
                description="نسيت كلمة المرور على موقع الأندية الطلابية بالجامعة الإسلامية."
            />
            <section className={Styles.register}>
                <img src={'/uploads/files/default/site-logo.png'}/>
                <div className={Styles.login}>
                    <section>
                        <div className={StylesUser.user}>
                            <form onSubmit={handlerSubmit}>
                                <div style={{
                                    gridTemplateColumns: "repeat(1, 1fr)"
                                }}>
                                    <label>الرقم الجامعي</label>
                                    <input
                                        placeholder={'اكتب رقمك الجامعي'} type={'number'}
                                        onChange={e => {
                                            setUsername(e.target.value)
                                        }}
                                    />
                                    {
                                        errorUsername.length > 0 &&
                                        <div className={StylesUser.error}>
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
                                            <span>{errorUsername}</span>
                                        </div>
                                    }
                                </div>
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
                                        ):(
                                            <button>إرسال</button>
                                        )

                                }
                            </form>
                        </div>
                        <div className={Styles.footer}>
                            <p>لديك حساب؟ <Link href={'/auth/signin'}>سجل الدخول</Link></p>
                        </div>
                    </section>
                </div>
            </section>
        </>
    );
}
