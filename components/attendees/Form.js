import Styles from "../../styles/attendees/Form.module.css"
import {useState} from "react";
import axios from "axios";
import swal from "sweetalert";
import {useSelector} from "react-redux";
export default ({session, isEdit = false}) => {
    const activity_id = useSelector(state => state.attendees.edit)
    const review = useSelector(state => state.reviews.edit)
    const [benefit, setBenefit] = useState(isEdit ? review.benefit : '')
    const [lecturer, setLecturer] = useState(isEdit ? review.lecturer : '')
    const [attended, setAttended] = useState(isEdit ? review.attended : '')
    const [suggestions, setSuggestions] = useState(isEdit ? review.suggestions : '')
    const [utility, setUtility] = useState(isEdit ? review.utility : '')
    const activity = isEdit ? review.activity :  activity_id.id
    const user = session.user.id

    const [loading, setLoading] = useState(false)

    const [benefitError, setBenefitError] = useState('')
    const [lecturerError, setLecturerError] = useState('')
    const [attendedError, setAttendedError] = useState('')
    const [suggestionsError, setSuggestionsError] = useState('')
    const [utilityError, setUtilityError] = useState('')
    const [activityError, setActivityError] = useState('')
    const [userError, setUserError] = useState('')
    const handlerSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        if(benefit.length == 0){
            setBenefitError('تقييم مدى الاستفادة مطلوب.')
            setLoading(false)
            return false
        }else {
            setBenefitError('')
        }
        if(lecturer.length == 0){
            setLecturerError('تقييم مقدم الفعالية مطلوب.')
            setLoading(false)
            return false
        }else {
            setLecturerError('')
        }
        if(attended.length == 0){
            setAttendedError('رجاء حدد كم حضرت من الفعالية.')
            setLoading(false)
            return false
        }else {
            setAttendedError('')
        }
        if(user.length == 0){
            setUserError('اسم المقيم مطلوب.')
            setLoading(false)
            return false
        }else {
            setUserError('')
        }
        if(activity.length == 0){
            setActivityError('عنوان الفعالية.')
            setLoading(false)
            return false
        }else {
            setActivityError('')
        }
        setLoading(true)
        if(isEdit){
            axios.put(`/attendees/edit`, {
                id: review.id,
                benefit: benefit.toString().trim(),
                lecturer: lecturer.toString().trim(),
                attended: attended,
                suggestions: suggestions.toString().trim(),
                utility: utility.toString().trim(),
                activity: activity.toString().trim(),
                user: user.toString().trim(),
                isFile: false
            }).then( async (res) => {
                if(res.status === 201){
                    await swal({
                        title: 'تم!',
                        text: res.data.mess,
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                    e.target.reset();
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
        }else {
            axios.post(`/attendees/add`, {
                benefit: benefit.toString().trim(),
                lecturer: lecturer.toString().trim(),
                attended: attended,
                suggestions: suggestions.toString().trim(),
                utility: utility.toString().trim(),
                activity: activity.toString().trim(),
                user: user.toString().trim(),
                isFile: false
            }).then( async (res) => {
                if(res.status === 201){
                    await swal({
                        title: 'تم!',
                        text: res.data.mess,
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                    setLoading(false)
                    e.target.reset();
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

    }
    return (
        <section className={Styles.index}>
            <form onSubmit={handlerSubmit}>
                <div>
                    <label>ما مدى استفادتك من الفعالية</label>
                    <div>
                        <div>
                            <div>
                                <span>1</span>
                                <span>ضعيف</span>
                            </div>
                            <input
                                onChange={e => setBenefit(e.target.value)}
                                name={'benefit'}
                                value={'1'}
                                defaultValue={benefit}
                                checked={benefit == '1'}
                                type={"radio"}/>
                        </div>
                        <div>
                            <div>
                                <span>2</span>
                                <span>مقبول</span>
                            </div>
                            <input
                                onChange={e => setBenefit(e.target.value)}
                                name={'benefit'}
                                value={'2'}
                                defaultValue={benefit}
                                checked={benefit == '2'}
                                type={"radio"}/>
                        </div>
                        <div>
                            <div>
                                <span>3</span>
                                <span>جيد</span>
                            </div>
                            <input
                                onChange={e => setBenefit(e.target.value)}
                                name={'benefit'}
                                value={'3'}
                                defaultValue={benefit}
                                checked={benefit == '3'}
                                type={"radio"}/>
                        </div>
                        <div>
                            <div>
                                <span>4</span>
                                <span>جيد جدا</span>
                            </div>
                            <input
                                onChange={e => setBenefit(e.target.value)}
                                name={'benefit'}
                                value={'4'}
                                defaultValue={benefit}
                                checked={benefit == '4'}
                                type={"radio"}/>
                        </div>
                        <div>
                            <div>
                                <span>5</span>
                                <span>ممتاز</span>
                            </div>
                            <input
                                onChange={e => setBenefit(e.target.value)}
                                name={'benefit'}
                                value={'5'}
                                defaultValue={benefit}
                                checked={benefit == '5'}
                                type={"radio"}/>
                        </div>
                    </div>
                    {
                        benefitError.length > 0 &&
                        <section className={Styles.error}>
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
                            <span>{benefitError}</span>
                        </section>
                    }
                </div>
                <div>
                    <label>ما تقييمك لمقدم الفعالية</label>
                    <div>
                        <div>
                            <div>
                                <span>1</span>
                                <span>ضعيف</span>
                            </div>
                            <input
                                onChange={e => setLecturer(e.target.value)}
                                name={'lecturer'}
                                value={'1'}
                                defaultValue={lecturer}
                                checked={lecturer == '1'}
                                type={"radio"}/>
                        </div>
                        <div>
                            <div>
                                <span>2</span>
                                <span>مقبول</span>
                            </div>
                            <input
                                onChange={e => setLecturer(e.target.value)}
                                name={'lecturer'}
                                value={'2'}
                                defaultValue={lecturer}
                                checked={lecturer == '2'}
                                type={"radio"}/>
                        </div>
                        <div>
                            <div>
                                <span>3</span>
                                <span>جيد</span>
                            </div>
                            <input
                                onChange={e => setLecturer(e.target.value)}
                                name={'lecturer'}
                                value={'3'}
                                defaultValue={lecturer}
                                checked={lecturer == '3'}
                                type={"radio"}/>
                        </div>
                        <div>
                            <div>
                                <span>4</span>
                                <span>جيد جدا</span>
                            </div>
                            <input
                                onChange={e => setLecturer(e.target.value)}
                                name={'lecturer'}
                                value={'4'}
                                defaultValue={lecturer}
                                checked={lecturer == '4'}
                                type={"radio"}/>
                        </div>
                        <div>
                            <div>
                                <span>5</span>
                                <span>ممتاز</span>
                            </div>
                            <input
                                onChange={e => setLecturer(e.target.value)}
                                name={'lecturer'}
                                value={'5'}
                                defaultValue={lecturer}
                                checked={lecturer == '5'}
                                type={"radio"}/>
                        </div>
                    </div>
                    {
                        lecturerError.length > 0 &&
                        <section className={Styles.error}>
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
                            <span>{lecturerError}</span>
                        </section>
                    }
                </div>
                <div>
                    <label>كم حضرت من الفعالية</label>
                    <div>
                        <div>
                            <span>جميعها</span>
                            <input
                                onChange={e => setAttended(e.target.value)}
                                name={'attended'}
                                value={'جميعها'}
                                defaultValue={attended}
                                checked={attended == 'جميعها'}
                                type={"radio"}/>
                        </div>
                        <div>
                            <span>أغلبها</span>
                            <input
                                onChange={e => setAttended(e.target.value)}
                                name={'attended'}
                                value={'أغلبها'}
                                defaultValue={attended}
                                checked={attended == 'أغلبها'}
                                type={"radio"}/>
                        </div>
                        <div>
                            <span>نصفها</span>
                            <input
                                onChange={e => setAttended(e.target.value)}
                                name={'attended'}
                                value={'نصفها'}
                                defaultValue={attended}
                                checked={attended == 'نصفها'}
                                type={"radio"}/>
                        </div>
                        <div>
                            <span>بعضها</span>
                            <input
                                onChange={e => setAttended(e.target.value)}
                                name={'attended'}
                                value={'بعضها'}
                                defaultValue={attended}
                                checked={attended == 'بعضها'}
                                type={"radio"}/>
                        </div>
                        <div>
                            <span>لا شيء منها</span>
                            <input
                                onChange={e => setAttended(e.target.value)}
                                name={'attended'}
                                value={'لا شيء منها'}
                                defaultValue={attended}
                                checked={attended == 'لا شيء منها'}
                                type={"radio"}/>
                        </div>
                    </div>
                    {
                        attendedError.length > 0 &&
                        <section className={Styles.error}>
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
                            <span>{attendedError}</span>
                        </section>
                    }
                </div>
                <div>
                    <label>ما هي الاقتراحات التي تقدمها لإدارة النادي</label>
                    <textarea
                        defaultValue={suggestions}
                        onChange={e => setSuggestions(e.target.value)}
                        placeholder={'اكنب الاقتراحات التي تود إرسالها لإدارة النادي'}></textarea>
                </div>
                <div>
                    <label>اذكر فائدة استفدتها من الفعالية</label>
                    <textarea
                        defaultValue={utility}
                        onChange={e => setUtility(e.target.value)}
                        placeholder={'اكنب الاقتراحات التي استفدتها من حضورك للفعالية'}></textarea>
                </div>
                {
                    loading == true
                        ?(
                            <button style={{
                                width: 'fit-content',
                                margin: "auto",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
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
                        ): isEdit ? <button>تحديث</button> : <button>إرسال</button>
                }
            </form>
        </section>
    )
}
