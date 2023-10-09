import Styles from "../../styles/FormUser.module.css";
import {useRouter} from "next/router";
import {useState} from "react";
import axios from "axios";
import swal from "sweetalert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage} from "@fortawesome/free-solid-svg-icons";
import {useSelector} from "react-redux";
import * as XLSX from "xlsx";
import useDeviceSize from "../useDeviceSize";

export default (
    {
        session,
        isEdit = false,
        managers = []

    }) => {
    // router
    const router = useRouter()
    // notes
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState()
    const [width, height] = useDeviceSize();
    const isFile = useSelector(state => state.isFile.isFile)
    const clubs = useSelector(state => state.clubs.edit)

    // fields
    const [name, setName] = useState(isEdit ? clubs.name : '')
    const [clubsFile, setClubsFile] = useState('')
    const [avatar, setAvatar] = useState(isEdit ? clubs.avatar : null)
    const [cover, setCover] = useState(isEdit ? clubs.cover : null)
    const [description, setDescription] = useState(isEdit ? clubs.description == "null" ? '' : clubs.description : '---')
    const [goals, setGoals] = useState(isEdit ? clubs.goals == "null" ? '' : clubs.goals : '')
    const [values, setValues] = useState(isEdit ? clubs.values == "null" ? '' :  clubs.values : '')
    const [vision, setVision] = useState(isEdit ? clubs.vision == "null" ? '' :  clubs.vision : '')
    const [message, setMessage] = useState(isEdit ? clubs.message == "null" ? '' :  clubs.message : '')
    const [whatsapp, setWhatsapp] = useState(isEdit ? clubs.whatsapp == "null" ? '' :  clubs.whatsapp : '')
    const [telegram, setTelegram] = useState(isEdit ? clubs.telegram == "null" ? '' :  clubs.telegram : '')
    const [manager, setManager] = useState(isEdit ? clubs.manager : null)
    const [imageAvatar, setImageAvatar] = useState('')
    const [imageCover, setImageCover] = useState('')

    // validation
    const [error, setError] = useState('')
    const [errorFile, setErrorFile] = useState('')
    const [success, setSuccess] = useState('')
    const [errorAvatar, setErrorAvatar] = useState('')
    const [errorCover, setErrorCover] = useState('')
    const [errorDescription, setErrorDescription] = useState('')
    const [errorGoals, setErrorGoals] = useState('')
    const [errorValues, setErrorValues] = useState('')
    const [errorVision, setErrorVision] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [errorWhatsapp, setErrorWhatsapp] = useState('')
    const [errorManager, setErrorManager] = useState('')
    const [errorTelegram, setErrorTelegram] = useState('')
    const [errorName, setErrorName] = useState('')
    const previewAvatar = async event => {
        const file = event.target.files[0];
        setAvatar(file)
        setImageAvatar(event.target.files.length != 0 ? URL.createObjectURL(file) : '')
    };

    const previewCover = async event => {
        const file = event.target.files[0];
        setCover(file)
        setImageCover(event.target.files.length != 0 ? URL.createObjectURL(file) : '')
    };

    // file excel
    function importExcel(eventFile) {
        setDone(false)
        const file = eventFile.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const bstr = event.target.result;
            const workBook = XLSX.read(bstr, { type: 'binary', cellText: false, cellDates: true });
            const workSheetName = workBook.SheetNames[0];
            const workSheet = workBook.Sheets[workSheetName];
            const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' });
            const headers = fileData[0];
            const heads = headers.map(head => ({ title: head, field: head }));
            fileData.splice(0, 1);
            convertToJson(headers, fileData);
        }
        reader.readAsBinaryString(file);
    }
    const convertToJson = async (headers, data) => {
        const rows = [];
        data.forEach(async row => {
            let rowData = {};
            row.forEach(async (element, index) => {
                rowData[headers[index]] = element;
            })
            rows.push({
                clubId: rowData.clubId?.toString().trim(),
                name: rowData.name?.toString().trim(),
                avatar: rowData.avatar?.trim(),
                cover: rowData.cover?.trim(),
                manager: rowData.manager?.trim(),
                description: rowData.description?.trim(),
                goals: rowData.goals?.trim(),
                values: rowData.values?.trim(),
                vision: rowData.vision?.trim(),
                message: rowData.message?.trim(),
                whatsapp: rowData.whatsapp?.trim(),
                telegram: rowData.telegram?.trim(),
            });
        })
        setClubsFile(rows);
        setDone(true)
    }
    const handlerSubmit =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(name.length === 0){
            setErrorName('الاسم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        if(whatsapp.length === 0){
            setErrorWhatsapp('رابط مجموعة النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorWhatsapp('')
            setLoading(false)
        }
        setLoading(true)
        const formData = new FormData();
        formData.append('name', name);
        formData.append('cover', cover);
        formData.append('avatar', avatar);
        formData.append('description', description);
        formData.append('goals', goals);
        formData.append('values', values);
        formData.append('vision', vision);
        formData.append('message', message);
        formData.append('telegram', telegram);
        formData.append('manager', manager);
        formData.append('whatsapp', whatsapp);
        formData.append('isEdit', false);
        axios.post(`/clubs/management/add`,formData)
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
                    setImageCover('')
                    setImageAvatar('')
                    setAvatar(null)
                    setCover(null)
                    await delay(3000);
                    setSuccess('')
                    e.target.reset()
                }else {
                    await swal({
                        title: 'خطأ!',
                        text: res.data.mess,
                        icon: "error",
                        button: false,
                        timer: 2000,
                    });
                    setSuccess("")
                    setError(res.data.mess)
                    setLoading(false)
                }
            })
    }
    const handlerSubmitEdit =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(name.length === 0){
            setErrorName('الاسم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        if(whatsapp.length === 0){
            setErrorWhatsapp('رابط مجموعة النادي مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorWhatsapp('')
            setLoading(false)
        }
        setLoading(true)
        const formData = new FormData();
        formData.append('clubId', clubs.id);
        formData.append('name', name);
        formData.append('cover', cover);
        formData.append('avatar', avatar);
        formData.append('description', description);
        formData.append('goals', goals);
        formData.append('values', values);
        formData.append('vision', vision);
        formData.append('message', message);
        formData.append('telegram', telegram);
        formData.append('manager', manager);
        formData.append('whatsapp', whatsapp);
        formData.append('isEdit', true);
        axios.put(`/clubs/management/edit`,formData)
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
                    setImageCover('')
                    setImageAvatar('')
                    setAvatar(null)
                    setCover(null)
                    await delay(3000);
                    setSuccess('')
                    e.target.reset()
                }else {
                    await swal({
                        title: 'خطأ!',
                        text: res.data.mess,
                        icon: "error",
                        button: false,
                        timer: 2000,
                    });
                    setSuccess("")
                    setError(res.data.mess)
                    setLoading(false)
                }
            })
    }
    const handlerSubmitFile =  (e) => {
        e.preventDefault()
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setLoading(true)
        if(clubsFile.length === 0){
            setErrorFile('الملف مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorFile('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/clubs/management/addFile`,{
            clubs: clubsFile,
            isFile: true
        })
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
                    await delay(3000);
                    setSuccess('')
                    e.target.reset()
                }else {
                    await swal({
                        title: 'خطأ!',
                        text: res.data.mess,
                        icon: "error",
                        button: false,
                        timer: 2000,
                    });
                    setSuccess("")
                    setError(res.data.mess)
                    setLoading(false)
                }
            })
    }
    return (
        <section className={Styles.user}>
            <form onSubmit={isEdit ? handlerSubmitEdit : isFile ? handlerSubmitFile : handlerSubmit} encType={'multipart/form-data'}>
                <div>
                    {
                        isFile
                            ? <div>
                                <label>ملف الأندية (اكسل)</label>
                                <input type={"file"}
                                onChange={e => importExcel(e)}/>
                                {
                                    errorFile.length > 0 &&
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
                                        <span>{errorFile}</span>
                                    </div>
                                }
                            </div>
                            : <>
                                <section>
                                    <div>
                                        <div>
                                            <label>اسم النادي</label>
                                            <input
                                                placeholder={'اكتب اسم النادي'}
                                                type={'text'}
                                                onChange={e => {
                                                    setName(e.target.value)
                                                }}
                                                defaultValue={name}
                                            />
                                            {
                                                errorName.length > 0 &&
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
                                                    <span>{errorName}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>الوصف</label>
                                            <textarea
                                                placeholder={'اكتب معلومات عن النادي'}
                                                onChange={e => {
                                                    setDescription(e.target.value)
                                                }}
                                                defaultValue={description}
                                            ></textarea>
                                            {
                                                errorDescription.length > 0 &&
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
                                                    <span>{errorDescription}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>الرسالة</label>
                                            <textarea
                                                placeholder={'اكتب رسالة النادي'}
                                                onChange={e => {
                                                    setMessage(e.target.value)
                                                }}
                                                defaultValue={message}
                                            ></textarea>
                                            {
                                                errorMessage.length > 0 &&
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
                                                    <span>{errorMessage}</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className={width <= 600 ? Styles.images : null}>
                                        <div>
                                            <label>شعار النادي</label>
                                            {
                                                isEdit
                                                    ? imageAvatar.length > 0
                                                        ? <div>
                                                            <img src={imageAvatar}/>
                                                        </div>
                                                        : <div>
                                                            <img src={`/uploads/files/${avatar}`}/>
                                                        </div>
                                                    : imageAvatar.length > 0
                                                        ? <div>
                                                            <img src={imageAvatar}/>
                                                        </div>
                                                        : <div>
                                                            <FontAwesomeIcon icon={faImage} />
                                                        </div>
                                            }
                                            <input
                                                type={'file'}
                                                onChange={e => {
                                                    previewAvatar(e)
                                                }}
                                            />
                                            {
                                                errorAvatar.length > 0 &&
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
                                                    <span>{errorAvatar}</span>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <label>صورة غلاف النادي</label>
                                            {
                                                isEdit
                                                    ? imageCover.length > 0
                                                        ? <div>
                                                            <img src={imageCover}/>
                                                        </div>
                                                        : <div>
                                                            <img src={`/uploads/files/${cover}`}/>
                                                        </div>
                                                    : imageCover.length > 0
                                                        ? <div>
                                                            <img src={imageCover}/>
                                                        </div>
                                                        : <div>
                                                            <FontAwesomeIcon icon={faImage} />
                                                        </div>
                                            }
                                            <input
                                                type={'file'}
                                                onChange={e => {
                                                    previewCover(e)
                                                }}
                                            />
                                            {
                                                errorCover.length > 0 &&
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
                                                    <span>{errorAvatar}</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </section>
                                <div>
                                    <label>الرؤية</label>
                                    <textarea
                                        placeholder={'اكتب رؤية النادي'}
                                        onChange={e => {
                                            setVision(e.target.value)
                                        }}
                                        defaultValue={vision}
                                    ></textarea>
                                    {
                                        errorVision.length > 0 &&
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
                                            <span>{errorVision}</span>
                                        </div>
                                    }
                                </div>
                                <div>
                                    <label>الأهداف</label>
                                    <input
                                        placeholder={'اكتب أهداف النادي، وافصل بين الأهداف بهذه الفاصلة "،"'}
                                        type={'text'}
                                        onChange={e => {
                                            setGoals(e.target.value)
                                        }}
                                        defaultValue={goals}
                                    />
                                    {
                                        errorGoals.length > 0 &&
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
                                            <span>{errorGoals}</span>
                                        </div>
                                    }
                                </div>
                                <div>
                                    <label>القيم</label>
                                    <input
                                        placeholder={'اكتب قيم النادي وافصل بين القيم بهذه الفاصلة "،"'}
                                        type={'text'}
                                        onChange={e => {
                                            setValues(e.target.value)
                                        }}
                                        defaultValue={values}
                                    />
                                    {
                                        errorValues.length > 0 &&
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
                                            <span>{errorValues}</span>
                                        </div>
                                    }
                                </div>
                                <div>
                                    <label>مجموعة الواتساب</label>
                                    <input
                                        placeholder={'أضف رابط مجموعة النادي'}
                                        type={'text'}
                                        onChange={e => {
                                            setWhatsapp(e.target.value)
                                        }}
                                        defaultValue={whatsapp}
                                    />
                                    {
                                        errorWhatsapp.length > 0 &&
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
                                            <span>{errorWhatsapp}</span>
                                        </div>
                                    }
                                </div>
                                <div>
                                    <label>قناة التيليغرام</label>
                                    <input
                                        placeholder={'أضف رابط قناة النادي'}
                                        type={'text'}
                                        onChange={e => {
                                            setTelegram(e.target.value)
                                        }}
                                        defaultValue={telegram}
                                    />
                                    {
                                        errorTelegram.length > 0 &&
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
                                            <span>{errorTelegram}</span>
                                        </div>
                                    }
                                </div>
                                {
                                    session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
                                        ? <div>
                                            <label>مدير النادي</label>
                                            <select onChange={e => setManager(e.target.value)}>
                                                <option value={''}>اختر مدير النادي</option>
                                                {
                                                    managers.map(student => <option selected={manager == student._id} value={student._id}>{student.name}</option>)
                                                }
                                            </select>
                                            {
                                                errorManager.length > 0 &&
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
                                                    <span>{errorManager}</span>
                                                </div>
                                            }
                                        </div>
                                        : null
                                }
                            </>
                    }
                    {
                        error.length > 0 &&
                        <span style={{
                            textAlign: 'center',
                            color: '#eb5151',
                        }}>{error}</span>
                    }
                    {
                        success.length > 0 &&
                        <span style={{
                            textAlign: 'center',
                            color: 'green',
                        }}>{success}</span>
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
                            isEdit
                                ? <button>تعديل النادي</button>
                                : isFile
                                    ? <button disabled={done == false ? true : false} style={done == false ? {
                                            backgroundColor: "black",
                                            color: "white"
                                        } : null}>
                                        {
                                            done == false
                                                ? "يتم الآن تجهيز الملف..."
                                                : 'حفظ الملف'
                                        }
                                        </button>
                                    : <button>حفظ النادي</button>
                        )

                }
            </form>
        </section>
    )
}
