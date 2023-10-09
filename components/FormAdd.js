"use client"

import Styles from '../styles/FormUser.module.css';
import {useRef, useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import swal from 'sweetalert';
import * as XLSX from "xlsx";
import {countriesActions} from "../redux/slices/countriesSlice";
import useSWR from "swr";
import {useRouter} from "next/router";
const fetcher = url => axios.get(url).then(res => res.data);
export default (
    {
        isCountry = false,
        isStudent = false,
        clubId = '',
        isCertificate = false,
        isAwardAndActivity = false,
        isCertificateAndActivity = false,
        isAwardAndUser = false,
        isCertificateAndUser = false,
        activities = [],
        clubs = [],
        yearsLis = [],
        students = [],
        administrativeList = [],
        deputyLists = [],
        awardsList = [],
        coordinators = [],
        isCollege = false,
        isResult = false,
        isYear = false,
        isAward = false,
        isLevel = false,
        isLocation = false,
        isAdministrative = false,
        isAdministrativeClub = false,
        isType = false,
        isDate = false,
        isTime = false,
        isEdit = false,
    }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // redusers
    const countries = useSelector(state => state.countries.edit)
    const colleges = useSelector(state => state.colleges.edit)
    const awards = useSelector(state => state.awards.edit)
    const levels = useSelector(state => state.levels.edit)
    const locations = useSelector(state => state.locations.edit)
    const types = useSelector(state => state.types.edit)
    const results = useSelector(state => state.results.edit)
    const dates = useSelector(state => state.dates.edit)
    const times = useSelector(state => state.times.edit)
    const years = useSelector(state => state.years.edit)
    // const students = useSelector(state => state.students.edit)
    const administrative = useSelector(state => state.administrative.edit)
    // is File
    const isFile = useSelector(state => state.isFile.isFile)
    const [activitiesAndAwards, setActivitiesAndAwards] = useState([])
    const [activitiesAndCertificates, setActivitiesAndCertificates] = useState([])
    const isDeputy = useRef()
    const [isClickDeputy, setIsClickDeputy] = useState(false)
    const awardAndActivityId = router.query.awardId
    const certificateAndActivityId = router.query.certificateId
    function getAuthorElements(){
        return (
            isFile
                ? <div style={{
                        gridColumn: "span 3"
                    }}>
                    <label>ملف اكسل</label>
                    <input
                        type={'file'}
                        onChange={e => importExcel(e)}
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
                : isEdit
                    ? <div style={{
                        gridColumn: "span 3"
                    }}>
                        <label>الاسم</label>
                        <input
                            type={isDate ? 'date' : isTime ? 'time' : 'text'}
                            placeholder={'اكتب الاسم كاملا'}
                            onChange={e => setName(e.target.value)}
                            defaultValue={
                                isCollege
                                    ? colleges.name
                                    : isAward
                                        ? awards.name
                                        : isLevel
                                            ? levels.name
                                            : isLocation
                                                ? locations.name
                                                : isType
                                                    ? types.name
                                                    : isAdministrative
                                                        ? administrative.name
                                                        : null
                            }
                        />
                    </div>
                    : <div style={{
                        gridColumn: "span 3"
                    }}>
                        <label>الاسم</label>
                        <input
                            type={'text'}
                            placeholder={'اكتب الاسم كاملا'}
                            onChange={e => setName(e.target.value)}
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
        )
    }

    // files
    const [countriesFile, setCountriesFile] = useState([]);
    const [awardsFile, setAwardsFile] = useState([]);
    const [awardAndActivityFile, setAwardAndActivityFile] = useState([]);
    const [awardAndUserFile, setAwardAndUserFile] = useState([]);
    const [levelsFile, setLevelsFile] = useState([]);
    const [resultsFile, setResultsFile] = useState([]);
    const [administrativeClubFile, setAdministrativeClubFile] = useState([]);
    const [collegesFile, setCollegesFile] = useState([]);
    const [locationsFile, setLocationsFile] = useState([]);
    const [typesFile, setTypesFile] = useState([]);
    const [administrativeFile, setAdministrativeFile] = useState([]);
    const [datesFile, setDatesFile] = useState([]);
    const [timesFile, setTimesFile] = useState([]);
    //
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState()
    // fields
    const [start, setStart] = useState(isDate ? dates.start !== undefined ? dates.start : '' : isTime ? times.start != undefined ? times.start : '' : '')
    const [end, setEnd] = useState(isDate ? dates.end !== undefined ? dates.end : '' : isTime ? times.end != undefined ? times.end : '' : '')
    const [name, setName] = useState(isResult && isEdit ? results.name : '')
    const [result, setResult] = useState(isResult && isEdit ? results.result : '')
    const [number, setNumber] = useState(isResult && isEdit ? results.number : '')
    const [year, setYear] = useState(isResult && isEdit ? results.year : '')
    const [image, setImage] = useState('')
    const [studentsAdministrative, setStudentAdministrative] = useState('')
    const [deputyAdministrative, setDeputyAdministrative] = useState('')
    const [newAdministrative, setNewAdministrative] = useState('')
    const [type, setType] = useState('')
    const [coordinator, setCoordinator] = useState('')
    const [nameH, setNameH] = useState('')
    const [nameM, setNameM] = useState('')
    const [activity, setActivity] = useState('')
    const [club, setClub] = useState(isResult && isEdit ? results.club : '')

    // country
    const [code, setCode] = useState('')

    // validation
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [errorStart, setErrorStart] = useState('')
    const [errorResult, setErrorResult] = useState('')
    const [errorNumber, setErrorNumber] = useState('')
    const [errorYear, setErrorYear] = useState('')
    const [errorEnd, setErrorEnd] = useState('')
    const [errorStudentsAdministrative, setErrorStudentsAdministrative] = useState('')
    const [errorDeputyAdministrative, setErrorDeputyAdministrative] = useState('')
    const [errorNewAdministrative, setErrorNewAdministrative] = useState('')
    const [errorAdministrative, setErrorAdministrative] = useState('')
    const [errorType, setErrorType] = useState('')
    const [errorCoordinator, setErrorCoordinator] = useState('')
    const [errorActivity, setErrorActivity] = useState('')
    const [errorClub, setErrorClub] = useState('')
    const [errorName, setErrorName] = useState('')
    const [errorImage, setErrorImage] = useState('')
    const [errorNameH, setErrorNameH] = useState('')
    const [errorNameM, setErrorNameM] = useState('')
    const [errorCode, setErrorCode] = useState('')


    function getCountryElements(){
        return (
            isFile
                ? <div style={{
                        gridColumn: "span 3"
                    }}>
                    <label>ملف اكسل</label>
                    <input
                        type={'file'}
                        onChange={e => importExcel(e)}
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
                : isEdit
                    ? <>
                        <div>
                            <label>الاسم</label>
                            <input
                                type={'text'}
                                placeholder={'اكتب الاسم كاملا'}
                                onChange={e => setName(e.target.value)}
                                defaultValue={countries.name}
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
                            <label>كود الدولة</label>
                            <input
                                type={'text'}
                                placeholder={'اكتب كود الدولة'}
                                onChange={e => setCode(e.target.value)}
                                defaultValue={countries.code}
                            />
                            {
                                errorCode.length > 0 &&
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
                                    <span>{errorCode}</span>
                                </div>
                            }
                        </div>
                    </>
                    : <>
                        <div>
                            <label>الاسم</label>
                            <input
                                type={'text'}
                                placeholder={'اكتب الاسم كاملا'}
                                onChange={e => setName(e.target.value)}
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
                            <label>كود الدولة</label>
                            <input
                                type={'text'}
                                placeholder={'اكتب كود الدولة'}
                                onChange={e => setCode(e.target.value)}
                            />
                            {
                                errorCode.length > 0 &&
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
                                    <span>{errorCode}</span>
                                </div>
                            }
                        </div>
                    </>
        )
    }
    function getYearElements(){
        return (
            isEdit
                ? <>
                    <div>
                        <label>اسم السنة بالهجري</label>
                        <input
                            type={'text'}
                            placeholder={'اكتب الاسم كاملا'}
                            onChange={e => setNameH(e.target.value)}
                            defaultValue={years.nameH}
                        />
                        {
                            errorNameH.length > 0 &&
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
                                <span>{errorNameH}</span>
                            </div>
                        }
                    </div>
                    <div>
                        <label>اسم السنة بالهجري</label>
                        <input
                            type={'text'}
                            placeholder={'اكتب كود الدولة'}
                            onChange={e => setNameM(e.target.value)}
                            defaultValue={years.nameM}
                        />
                        {
                            errorNameM.length > 0 &&
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
                                <span>{errorNameM}</span>
                            </div>
                        }
                    </div>
                </>
                : <>
                    <div>
                        <label>اسم السنة بالهجري</label>
                        <input
                            type={'text'}
                            placeholder={'اكتب اسم السنة بالهجري'}
                            onChange={e => setNameH(e.target.value)}
                        />
                        {
                            errorNameH.length > 0 &&
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
                                <span>{errorNameH}</span>
                            </div>
                        }
                    </div>
                    <div>
                        <label>اسم السنة بالميلادي</label>
                        <input
                            type={'text'}
                            placeholder={'اكتب اسم السنة بالميلادي'}
                            onChange={e => setNameM(e.target.value)}
                        />
                        {
                            errorNameM.length > 0 &&
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
                                <span>{errorNameM}</span>
                            </div>
                        }
                    </div>
                </>
        )
    }
    function getAdministrativeClubElements(){
        return (
            !isFile
                ? <>
                    <div style={{
                        gridColumn: "span 3"
                    }}>
                        <label>اسم الإداري</label>
                        <select onChange={e => setStudentAdministrative(e.target.value)}>
                            <option value={''}>اختر اسم الإداري</option>
                            {
                                students.map(student =>
                                    <option value={student._id}>{student.name}</option>
                                )
                            }
                        </select>
                        {
                            errorStudentsAdministrative.length > 0 &&
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
                                <span>{errorStudentsAdministrative}</span>
                            </div>
                        }
                    </div>
                    <section style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--gap)",
                        fontSize: "14px",
                        color: "gray",
                        justifyContent: "flex-start"
                    }}>
                        <span>هل له نائب؟</span>
                        <input onChange={e => setIsClickDeputy(!isClickDeputy)} ref={isDeputy} style={{
                            width: "20px",
                            cursor: "pointer"
                        }} type={"checkbox"}/>
                    </section>
                    {
                        isClickDeputy &&
                        isDeputy.current.checked &&
                        <div>
                            <label>اسم النائب</label>
                            <select onChange={e => setDeputyAdministrative(e.target.value)}>
                                <option value={''}>اختر اسم النائب</option>
                                {
                                    deputyLists.map(deputyList =>
                                        <option value={deputyList._id}>{deputyList.name}</option>
                                    )
                                }
                            </select>
                            {
                                errorDeputyAdministrative.length > 0 &&
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
                                    <span>{errorDeputyAdministrative}</span>
                                </div>
                            }
                        </div>
                    }
                    <div>
                        <label>اسم الوظيفة</label>
                        <select onChange={e => setNewAdministrative(e.target.value)}>
                            <option value={''}>اختر اسم الوظيفة</option>
                            {
                                administrativeList.map(administrative =>
                                    <option value={administrative._id}>{administrative.name}</option>
                                )
                            }
                        </select>
                        {
                            errorNewAdministrative.length > 0 &&
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
                                <span>{errorNewAdministrative}</span>
                            </div>
                        }
                    </div>
                </>
                : <div style={{
                    gridColumn: "span 3"
                }}>
                    <label>ملف اكسل</label>
                    <input
                        type={"file"}
                        onChange={e => importExcel(e)}
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
        )
    }
    function getCertificateElements(){
        return (
            isEdit
                ? <>
                    <div>
                        <label>عنوان الفعالية</label>
                        <select>
                            <option value={''}></option>
                            {
                                activities.map(activityList => <option selected={activityList._id == activity} value={activityList._id}>{activityList.title}</option>)
                            }
                        </select>
                        {
                            errorActivity.length > 0 &&
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
                                <span>{errorActivity}</span>
                            </div>
                        }
                    </div>
                </>
                : <>
                    <div>
                        <label>عنوان الفعالية</label>
                        <select>
                            <option value={''}></option>
                            {
                                activities.map(activityList => <option value={activityList._id}>{activityList.title}</option>)
                            }
                        </select>
                        {
                            errorActivity.length > 0 &&
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
                                <span>{errorActivity}</span>
                            </div>
                        }
                    </div>
                </>
        )
    }
    function getCertificatesElements(){
        return (
            !isFile
                ? <>
                    <div>
                        <label>اسم النادي</label>
                        <select onChange={e => {
                            setActivitiesAndCertificates([])
                            if(e.target.value != 0) {
                                setClub(e.target.value)
                                axios.get(`/certificates/get?clubId=${e.target.value}`).then(res => setActivitiesAndCertificates(res.data.activities));
                            }else {
                                setErrorClub('اسم النادي مطلوب.')
                            }
                        }}>
                            <option value={''}>اختر اسم النادي</option>
                            {
                                clubs.map(clubList => clubList.name != "---" && clubList.name != "فريق الإدارة" && <option value={clubList._id}>{clubList.name}</option>)
                            }
                        </select>
                        {
                            errorClub.length > 0 &&
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
                                <span>{errorClub}</span>
                            </div>
                        }
                    </div>
                    {
                        activitiesAndCertificates.length > 0 &&
                        <div>
                            <label>عنوان الفعالية</label>
                            <select onChange={e => setActivity(e.target.value)}>
                                <option value={''}>اختر عنوان الفعالية</option>
                                {
                                    activitiesAndCertificates.map(activityAndCertificates => <option value={activityAndCertificates._id}>{activityAndCertificates.title + ' ' + `{${activityAndCertificates.date.split('T')[0]}}`}</option>)
                                }
                            </select>
                            {
                                errorActivity.length > 0 &&
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
                                    <span>{errorActivity}</span>
                                </div>
                            }
                        </div>
                    }
                </>
                : <div style={{
                        gridColumn: "span 3"
                    }}>
                    <label>ملف اكسل</label>
                    <input
                        type={"file"}
                        onChange={e => importExcel(e)}
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
        )
    }
    function getAwardsElements(){
        return (
            !isFile
                ? <>
                    <div>
                        <label>اسم النادي</label>
                        <select onChange={e => {
                            setActivitiesAndAwards([])
                            setClub(e.target.value)
                            axios.get(`/awards/get?clubId=${e.target.value}`).then(res => setActivitiesAndAwards(res.data.activities));
                        }}>
                            <option value={''}>اختر اسم النادي</option>
                            {
                                clubs.map(clubList => <option value={clubList._id}>{clubList.name}</option>)
                            }
                        </select>
                        {
                            errorClub.length > 0 &&
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
                                <span>{errorClub}</span>
                            </div>
                        }
                    </div>
                    {
                        activitiesAndAwards.length > 0 &&
                        <div>
                            <label>عنوان الفعالية</label>
                            <select onChange={e => setActivity(e.target.value)}>
                                <option value={''}>اختر عنوان الفعالية</option>
                                {
                                    activitiesAndAwards.map(activityAndAwards => <option value={activityAndAwards._id}>{activityAndAwards.title + ' ' + `{${activityAndAwards.date.split('T')[0]}}`}</option>)
                                }
                            </select>
                            {
                                errorActivity.length > 0 &&
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
                                    <span>{errorActivity}</span>
                                </div>
                            }
                        </div>
                    }
                </>
                : <div style={{
                        gridColumn: "span 3"
                    }}>
                    <label>ملف اكسل</label>
                    <input
                        type={"file"}
                        onChange={e => importExcel(e)}
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
        )
    }
    function getResultsElements(){
        return (
            !isFile
                ? isEdit
                    ? <>
                        <div>
                            <label>اسم النادي</label>
                            <select onChange={e => setClub(e.target.value)}>
                                <option value={''}>اختر اسم النادي</option>
                                {
                                    clubs.map(clubList => <option selected={club === clubList._id} value={clubList._id}>{clubList.name}</option>)
                                }
                            </select>
                            {
                                errorClub.length > 0 &&
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
                                    <span>{errorClub}</span>
                                </div>
                            }
                        </div>
                        <div>
                            <label>مدير النادي</label>
                            <input
                                type={'text'}
                                onChange={e => setName(e.target.value)}
                                placeholder={'اكتب اسم مدير النادي'}
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
                            <label>النتيجة</label>
                            <input
                                type={'text'}
                                onChange={e => setResult(e.target.value)}
                                placeholder={'اكتب نتيجة النادي'}
                                defaultValue={result}
                            />
                            {
                                errorResult.length > 0 &&
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
                                    <span>{errorResult}</span>
                                </div>
                            }
                        </div>
                        <div>
                            <label>الرتبة</label>
                            <input
                                type={'text'}
                                onChange={e => setNumber(e.target.value)}
                                placeholder={'اكتب نتيجة النادي'}
                                defaultValue={number}
                            />
                            {
                                errorNumber.length > 0 &&
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
                                    <span>{errorNumber}</span>
                                </div>
                            }
                        </div>
                        <div>
                            <label>السنة</label>
                            <select onChange={e => setYear(e.target.value)}>
                                <option value={''}>اختر السنة</option>
                                {
                                    yearsLis.map(yearList => <option selected={year === yearList._id} value={yearList._id}>{yearList.nameH}</option>)
                                }
                            </select>
                            {
                                errorYear.length > 0 &&
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
                                    <span>{errorYear}</span>
                                </div>
                            }
                        </div>
                    </>
                    : <>
                        <div>
                            <label>اسم النادي</label>
                            <select onChange={e => setClub(e.target.value)}>
                                <option value={''}>اختر اسم النادي</option>
                                {
                                    clubs.map(clubList => <option value={clubList._id}>{clubList.name}</option>)
                                }
                            </select>
                            {
                                errorClub.length > 0 &&
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
                                    <span>{errorClub}</span>
                                </div>
                            }
                        </div>
                        <div>
                            <label>مدير النادي</label>
                            <input
                                type={'text'}
                                onChange={e => setName(e.target.value)}
                                placeholder={'اكتب اسم مدير النادي'}
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
                            <label>النتيجة</label>
                            <input
                                type={'text'}
                                onChange={e => setResult(e.target.value)}
                                placeholder={'اكتب نتيجة النادي'}
                            />
                            {
                                errorResult.length > 0 &&
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
                                    <span>{errorResult}</span>
                                </div>
                            }
                        </div>
                        <div>
                            <label>الرتبة</label>
                            <input
                                type={'text'}
                                onChange={e => setNumber(e.target.value)}
                                placeholder={'اكتب نتيجة النادي'}
                            />
                            {
                                errorNumber.length > 0 &&
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
                                    <span>{errorNumber}</span>
                                </div>
                            }
                        </div>
                        <div>
                            <label>السنة</label>
                            <select onChange={e => setYear(e.target.value)}>
                                <option value={''}>اختر السنة</option>
                                {
                                    yearsLis.map(yearList => <option value={yearList._id}>{yearList.nameH}</option>)
                                }
                            </select>
                            {
                                errorYear.length > 0 &&
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
                                    <span>{errorYear}</span>
                                </div>
                            }
                        </div>
                    </>
                : <div style={{
                    gridColumn: "span 3"
                }}>
                    <label>ملف اكسل</label>
                    <input
                        type={"file"}
                        onChange={e => importExcel(e)}
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
        )
    }
    function getAwardAndUserElements(){
        return (
            !isFile
                ? <>
                    <div>
                        <label>اسم الطالب</label>
                        <select onChange={e => setName(e.target.value)}>
                            <option value={''}>اختر اسم الطالب</option>
                            {
                                students.map(studentList => <option value={studentList.user.id}>{studentList.user.name}</option>)
                            }
                        </select>
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
                        <label>نوع الجائزة</label>
                        <select onChange={e => setType(e.target.value)}>
                            <option value={''}>اختر نوع الجائزة</option>
                            {
                                awardsList.map(awardList => <option value={awardList._id}>{awardList.name}</option>)
                            }
                        </select>
                        {
                            errorType.length > 0 &&
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
                                <span>{errorType}</span>
                            </div>
                        }
                    </div>
                    <div>
                        <label>اسم المنسق</label>
                        <select onChange={e => setCoordinator(e.target.value)}>
                            <option value={''}>اختر اسم المنسق</option>
                            {
                                coordinators.map(coordinatorList => <option value={coordinatorList._id}>{coordinatorList.name}</option>)
                            }
                        </select>
                        {
                            errorCoordinator.length > 0 &&
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
                                <span>{errorCoordinator}</span>
                            </div>
                        }
                    </div>
                </>
                : <div style={{
                        gridColumn: "span 3"
                    }}>
                    <label>ملف اكسل</label>
                    <input
                        type={"file"}
                        onChange={e => importExcel(e)}
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
        )
    }
    function getCertificateAndUserElements(){
        return (
            !isFile
                ? <>
                    <div>
                        <label>اسم الطالب</label>
                        <select onChange={e => setName(e.target.value)}>
                            <option value={''}>اختر اسم الطالب</option>
                            {
                                students.map(studentList => <option value={studentList.user.id}>{studentList.user.name}</option>)
                            }
                        </select>
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
                        <label>صورة الشهادة</label>
                        <input onChange={ e => setImage(e.target.files[0])}
                            type={'file'}
                            defaultValue={image}
                        />
                        {
                            errorImage.length > 0 &&
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
                                <span>{errorImage}</span>
                            </div>
                        }
                    </div>
                </>
                : <div style={{
                        gridColumn: "span 3"
                    }}>
                    <label>ملف اكسل</label>
                    <input
                        type={"file"}
                        onChange={e => importExcel(e)}
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
        )
    }
    function getDateAndTimeElements(){
        return (
            isEdit
                ? <>
                    <div>
                        <label>{isDate ? 'بداية التاريخ' : 'بداية الوقت'}</label>
                        <input
                            type={isDate ? 'date' : 'time'}
                            onChange={e => setStart(e.target.value)}
                            defaultValue={start}
                        />
                        {
                            errorStart.length > 0 &&
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
                                <span>{errorStart}</span>
                            </div>
                        }
                    </div>
                    <div>
                        <label>{isDate ? 'نهاية التاريخ' : 'نهاية الوقت'}</label>
                        <input
                            type={isDate ? 'date' : 'time'}
                            onChange={e => setEnd(e.target.value)}
                            defaultValue={end}
                        />
                        {
                            errorEnd.length > 0 &&
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
                                <span>{errorEnd}</span>
                            </div>
                        }
                    </div>
                </>
                : <>
                    <div>
                        <label>{isDate ? 'بداية التاريخ' : 'بداية الوقت'}</label>
                        <input
                            type={isDate ? 'date' : 'time'}
                            onChange={e => setStart(e.target.value)}
                        />
                        {
                            errorStart.length > 0 &&
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
                                <span>{errorStart}</span>
                            </div>
                        }
                    </div>
                    <div>
                        <label>{isDate ? 'نهاية التاريخ' : 'نهاية الوقت'}</label>
                        <input
                            type={isDate ? 'date' : 'time'}
                            onChange={e => setEnd(e.target.value)}
                        />
                        {
                            errorEnd.length > 0 &&
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
                                <span>{errorEnd}</span>
                            </div>
                        }
                    </div>
                </>
        )
    }
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
            if(isCountry){
                rows.push({
                    name: rowData.name?.toString().trim(),
                    code: rowData.code?.trim(),
                    countryId: rowData.countryId?.toString().trim(),
                });
            }else if(isDate || isTime){
                rows.push({
                    start: rowData.start?.toString().trim(),
                    end: rowData.end?.toString().trim(),
                });
            }else if(isAdministrative){
                rows.push({
                    administrativeId: rowData.administrativeId?.toString().trim(),
                    name: rowData.name?.toString().trim(),
                });
            }else if(isAward){
                rows.push({
                    awardId: rowData.awardId?.toString().trim(),
                    name: rowData.name?.toString().trim(),
                });
            }else if(isLevel){
                rows.push({
                    levelId: rowData.levelId?.toString().trim(),
                    name: rowData.name?.toString().trim(),
                });
            }else if(isLocation){
                rows.push({
                    locationId: rowData.locationId?.toString().trim(),
                    name: rowData.name?.toString().trim(),
                });
            }else if(isType){
                rows.push({
                    typeId: rowData.typeId?.toString().trim(),
                    name: rowData.name?.toString().trim(),
                });
            }else if(isCollege){
                rows.push({
                    collegeId: rowData.collegeId?.toString().trim(),
                    name: rowData.name?.toString().trim(),
                });
            }else if(isAwardAndActivity){
                rows.push({
                    awardId: rowData.awardId?.toString().trim(),
                    activityId: rowData.activityId?.toString().trim(),
                    createdAt: rowData.createdAt?.toString().trim(),
                });
            }else if(isAwardAndUser){
                rows.push({
                    awardId: rowData.awardId?.toString().trim(),
                    status: rowData.status?.toString().trim(),
                    coordinator: rowData.coordinator?.toString().trim(),
                    user: rowData.user?.toString().trim(),
                    awardAndActivityId: rowData.awardAndActivityId?.toString().trim(),
                    award: rowData.award?.toString().trim(),
                    createdAt: rowData.createdAt?.toString().trim(),
                });
            }else if(isAdministrativeClub){
                rows.push({
                    club: rowData.club?.toString().trim(),
                    user: rowData.user?.toString().trim(),
                    deputy: rowData.deputy?.toString().trim(),
                    administrative: rowData.administrative?.toString().trim(),
                });
            }else if(isResult){
                rows.push({
                    number: rowData.number?.toString().trim(),
                    name: rowData.name?.toString().trim(),
                    result: rowData.result?.toString().trim(),
                    year: rowData.year?.toString().trim(),
                    club: rowData.club?.toString().trim(),
                });
            }
        })
        if(isCountry) setCountriesFile(rows);
        if(isCollege) setCollegesFile(rows);
        if(isAward) setAwardsFile(rows);
        if(isLevel) setLevelsFile(rows);
        if(isLevel) setLevelsFile(rows);
        if(isLocation) setLocationsFile(rows);
        if(isType) setTypesFile(rows);
        if(isDate) setDatesFile(rows);
        if(isTime) setTimesFile(rows);
        if(isAdministrative) setAdministrativeFile(rows);
        if(isAwardAndActivity) setAwardAndActivityFile(rows);
        if(isAwardAndUser) setAwardAndUserFile(rows);
        if(isResult) setResultsFile(rows);
        if(isAdministrativeClub) setAdministrativeClubFile(rows);
        setDone(true)
    }

    // countries
    const handelSubmitCountriesIsFile = async (e) => {
        e.preventDefault();
        if(countriesFile.length == 0){
            setErrorName('الملف مطلوب')
            setLoading(false)
            return false
        }
        setLoading(true)
        axios.post(`/tools/countries/add`, {countries: countriesFile, isFile: true})
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
    const handelSubmitCountryEdit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if(name.length === 0){
            setErrorName('الاسم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        if(code.length === 0){
            setErrorCode('كود الدولة مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorCode('')
            setLoading(false)
        }
        setLoading(true)
        axios.put(`/tools/countries/edit`, {id: countries.id, name: name, code: code})
            .then( async (res) => {
                if(res.status === 201 ){
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
                    dispatch(countriesActions.isEdit(false))
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
            }).catch(err => {
            setError("")
            setSuccess("")
            setLoading(false)
        })

    }
    const handelSubmitCountry = async (e) => {
        e.preventDefault();
        setLoading(true)
        if(name.length === 0){
            setErrorName('الاسم مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        if(code.length === 0){
            setErrorCode('كود الدولة مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorCode('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/tools/countries/add`, {name: name, code: code, isFile: false})
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
            }).catch(err => {
            setError("")
            setSuccess("")
            setLoading(false)
        })

    }
    const handelSubmitAdministrativeClub = async (e) => {
        e.preventDefault();
        setLoading(true)
        if(studentsAdministrative.length === 0){
            setErrorStudentsAdministrative('اسم الإداري مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorStudentsAdministrative('')
            setLoading(false)
        }
        if(newAdministrative.length === 0){
            setErrorNewAdministrative('اسم الوظيفة مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorNewAdministrative('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/clubs/management/administrative/add`, {
            club: clubId,
            student: studentsAdministrative,
            administrative: newAdministrative,
            deputy: deputyAdministrative
        }).then( async (res) => {
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
            }).catch(err => {
            setError("")
            setSuccess("")
            setLoading(false)
        })

    }
    const handelSubmitAdministrativeClubFile = async (e) => {
        e.preventDefault();
        setLoading(true)
        if(administrativeClubFile.length === 0){
            setErrorName('الملف مطلوب.')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/clubs/management/administrative/addFile`, {
            administrativeClubs: administrativeClubFile,
        }).then( async (res) => {
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
            }).catch(err => {
            setError("")
            setSuccess("")
            setLoading(false)
        })

    }

    const handelSubmitAddCertificateAndUser = async (e) => {
        e.preventDefault();
        setLoading(true)
        if(name.length == 0){
            setErrorName('اسم الطالب مطلوب')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        if(image.length == 0){
            setErrorImage('صورة الشهادة مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorImage('')
            setLoading(false)
        }
        setLoading(true)
        const formData = new FormData();
        formData.append('certificateAndActivityId', certificateAndActivityId.trim(),);
        formData.append('image', image);
        formData.append('user', name.trim());
        axios.post(`/certificates/show/add`, formData).then( async (res) => {
            if(res.status === 201){
                await swal({
                    title: 'تم!',
                    text: res.data.mess,
                    icon: "success",
                    button: false,
                    timer: 2000,
                });
                setLoading(false)
                setSuccess(res.data.mess)
                setError('')
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
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handelSubmitAddResult = async (e) => {
        e.preventDefault();
        setLoading(true)
        if(club.length == 0){
            setErrorClub('اسم النادي مطلوب')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        if(name.length == 0){
            setErrorName('اسم مدير النادي مطلوب')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        if(result.length == 0){
            setErrorResult('النتيجة مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorResult('')
            setLoading(false)
        }
        if(number.length == 0){
            setErrorNumber('الرتبة مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorNumber('')
            setLoading(false)
        }
        if(year.length == 0){
            setErrorYear('السنة مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorYear('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/tools/results/add`, {
            club: club,
            name: name,
            result: result,
            number: number,
            year: year,
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
                setSuccess(res.data.mess)
                setError('')
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
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handelSubmitEditResult = async (e) => {
        e.preventDefault();
        setLoading(true)
        if(club.length == 0){
            setErrorClub('اسم النادي مطلوب')
            setLoading(false)
            return false
        }else {
            setErrorClub('')
            setLoading(false)
        }
        if(name.length == 0){
            setErrorName('اسم مدير النادي مطلوب')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        if(result.length == 0){
            setErrorResult('النتيجة مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorResult('')
            setLoading(false)
        }
        if(number.length == 0){
            setErrorNumber('الرتبة مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorNumber('')
            setLoading(false)
        }
        if(year.length === 0){
            setErrorYear('السنة مطلوبة.')
            setLoading(false)
            return false
        }else {
            setErrorYear('')
            setLoading(false)
        }
        setLoading(true)
        axios.put(`/tools/results/edit`, {
            id: results.id,
            club: club,
            name: name,
            result: result,
            number: number,
            year: year,
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
                setSuccess(res.data.mess)
                setError('')
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
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    const handelSubmitAddResultFile = async (e) => {
        e.preventDefault();
        setLoading(true)
        if(resultsFile.length == 0){
            setErrorName('الملف مطلوب')
            setLoading(false)
            return false
        }else {
            setErrorName('')
            setLoading(false)
        }
        setLoading(true)
        axios.post(`/tools/results/add`, {
            results: resultsFile,
            isFile: true
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
                setSuccess(res.data.mess)
                setError('')
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
                setLoading(false)
                setSuccess("")
                setError(res.data.mess)
                await delay(3000);
                setError("")
            }
        }).catch(err => {
            setLoading(false)
            setSuccess('')
            setError(err.response.data.error)
        })
    }
    // colleges and awards
    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if(isYear){
            if(nameH.length === 0){
                setErrorNameH('اسم السنة بالهجري مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorNameH('')
                setLoading(false)
            }
            if(nameM.length === 0){
                setErrorNameM('اسم السنة بالميلادي مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorNameM('')
                setLoading(false)
            }
        }else if(isDate || isTime){
            if(start.length == 0){
                setErrorStart('البداية مطلوبة')
                setLoading(false)
                return false
            }else {
                setErrorStart('')
                setLoading(false)
            }
            if(end.length === 0){
                setErrorEnd('النهاية مطلوبة')
                setLoading(false)
                return false
            }else {
                setErrorEnd('')
                setLoading(false)
            }
        }else if(isCertificate){
            if(activity.length == 0){
                setErrorActivity('عنوان الفعالية مطلوب')
                setLoading(false)
                return false
            }else {
                setErrorActivity('')
                setLoading(false)
            }
        }else if(isAwardAndActivity){
            if(club.length == 0){
                setErrorClub('النادي مطلوب')
                setLoading(false)
                return false
            }else {
                setErrorClub('')
                setLoading(false)
            }
            if(activity.length == 0){
                setErrorActivity('عنوان الفعالية مطلوب')
                setLoading(false)
                return false
            }else {
                setErrorActivity('')
                setLoading(false)
            }
        }else if(isCertificateAndActivity){
            if(club.length == 0){
                setErrorClub('النادي مطلوب')
                setLoading(false)
                return false
            }else {
                setErrorClub('')
                setLoading(false)
            }
            if(activity.length == 0){
                setErrorActivity('عنوان الفعالية مطلوب')
                setLoading(false)
                return false
            }else {
                setErrorActivity('')
                setLoading(false)
            }
        }else if(isAwardAndUser){
            if(name.length == 0){
                setErrorName('اسم الطالب مطلوب')
                setLoading(false)
                return false
            }else {
                setErrorName('')
                setLoading(false)
            }
            if(type.length == 0){
                setErrorType('نوع الجائزة مطلوب')
                setLoading(false)
                return false
            }else {
                setErrorType('')
                setLoading(false)
            }
            if(coordinator.length == 0){
                setErrorCoordinator('اسم المنسق مطلوب')
                setLoading(false)
                return false
            }else {
                setErrorCoordinator('')
                setLoading(false)
            }
        }else {
            if(name.length === 0){
                setErrorName('الاسم مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorName('')
                setLoading(false)
            }
        }
        setLoading(true)
        axios.post(
            isAward
                    ? `/tools/awards/add`
                    : isCollege
                        ? `/tools/colleges/add`
                        : isLevel
                            ? `/tools/levels/add`
                            : isLocation
                                ? `/tools/locations/add`
                                : isType
                                    ? `/tools/types/add`
                                    : isAdministrative
                                        ? `/tools/administrative/add`
                                        : isDate
                                            ? `/tools/dates/add`
                                            : isTime
                                                ? `/tools/times/add`
                                                :  isYear
                                                    ? `/tools/years/add`
                                                    : isCertificate
                                                        ? `/certificates/add`
                                                        : isAwardAndActivity
                                                            ? `/awards/add`
                                                            : isAwardAndUser
                                                                ? `/awards/show/add`
                                                                : isCertificateAndActivity
                                                                    ? `/certificates/add`
                                                                    : null,
                                                                isYear
                                                                        ? {nameH: nameH, nameM: nameM, isFile: false}
                                                                        : isDate || isTime
                                                                            ? {start: start, end: end, isFile: false}
                                                                            : isCertificateAndActivity
                                                                                ? {activity: activity, isFile: false}
                                                                                : isAwardAndActivity
                                                                                    ? {activity: activity, isFile: false}
                                                                                    : isAwardAndUser
                                                                                        ? {awardAndActivityId: awardAndActivityId, coordinator: coordinator, user: name, award: type, isFile: false}
                                                                                        : {name: name, isFile: false})
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
                    e.target.reset();
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
            }).catch(err => {
            setError("")
            setSuccess("")
            setLoading(false)
        })

    }
    const handelSubmitEdit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if(isYear){
            if(nameH.length === 0){
                setErrorNameH('اسم السنة بالهجري مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorNameH('')
                setLoading(false)
            }
            if(nameM.length === 0){
                setErrorNameM('اسم السنة بالميلادي مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorNameM('')
                setLoading(false)
            }
        }else if(isDate || isTime){
            if(start.length === 0){
                setErrorStart('البداية مطلوبة')
                setLoading(false)
                return false
            }else {
                setErrorStart('')
                setLoading(false)
            }
            if(end.length === 0){
                setErrorEnd('النهاية مطلوبة')
                setLoading(false)
                return false
            }else {
                setErrorEnd('')
                setLoading(false)
            }
        }else if(isCertificate){
            if(activity.length == 0){
                setErrorActivity('عنوان الفعالية مطلوب')
                setLoading(false)
                return false
            }else {
                setErrorActivity('')
                setLoading(false)
            }
        }else {
            if(name.length === 0){
                setErrorName('الاسم مطلوب.')
                setLoading(false)
                return false
            }else {
                setErrorName('')
                setLoading(false)
            }
        }
        setLoading(true)
        axios.put( isAward
                        ? `/tools/awards/edit`
                        : isCollege
                            ? `/tools/colleges/edit`
                            : isLevel
                                ? `/tools/levels/edit`
                                : isLocation
                                    ? `/tools/locations/edit`
                                    : isType
                                        ? `/tools/types/edit`
                                        : isAdministrative
                                            ? `/tools/administrative/edit`
                                            : isDate
                                                ? `/tools/dates/edit`
                                                : isTime
                                                    ? `/tools/times/edit`
                                                    : isYear
                                                        ? `/tools/years/edit`
                                                        : null, isAward
                                                            ? {id: awards.id, name: name}
                                                            : isCollege
                                                                ? {id: colleges.id, name: name}
                                                                : isLevel
                                                                    ? {id: levels.id, name: name}
                                                                    : isLocation
                                                                        ? {id: locations.id, name: name}
                                                                        : isType
                                                                            ? {id: types.id, name: name}
                                                                            : isAdministrative
                                                                                ? {id: administrative.id, name: name}
                                                                                : isDate
                                                                                    ? {id: dates.id, start: start, end: end}
                                                                                    : isTime
                                                                                        ? {id: times.id, start: start, end: end}
                                                                                        : isYear
                                                                                            ? {id: years.id, nameH: nameH, nameM: nameM}
                                                                                            : null)
            .then( async (res) => {
                if(res.status === 201 ){
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
                    dispatch(countriesActions.isEdit(false))
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
            }).catch(err => {
            setError("")
            setSuccess("")
            setLoading(false)
        })

    }
    const handelSubmitIsFile = async (e) => {
        e.preventDefault();
        if(isAward){
            if(awardsFile.length == 0){
                setErrorName('الملف مطلوب')
                setLoading(false)
                return false
            } else {
                setErrorName('')
                setLoading(true)
            }
        }else if(isCollege){
            if(collegesFile.length == 0){
                setErrorName('الملف مطلوب')
                setLoading(false)
                return false
            } else {
                setErrorName('')
                setLoading(true)
            }
        }else if(isLevel){
            if(levelsFile.length == 0){
                setErrorName('الملف مطلوب')
                setLoading(false)
                return false
            } else {
                setErrorName('')
                setLoading(true)
            }
        }else if(isLocation){
            if(locationsFile.length == 0){
                setErrorName('الملف مطلوب')
                setLoading(false)
                return false
            } else {
                setErrorName('')
                setLoading(true)
            }
        }else if(isType){
            if(typesFile.length == 0){
                setErrorName('الملف مطلوب')
                setLoading(false)
                return false
            } else {
                setErrorName('')
                setLoading(true)
            }
        }else if(isAdministrative){
            if(administrativeFile.length == 0){
                setErrorName('الملف مطلوب')
                setLoading(false)
                return false
            } else {
                setErrorName('')
                setLoading(true)
            }
        }else if(isDate){
            if(datesFile.length == 0){
                setErrorName('الملف مطلوب')
                setLoading(false)
                return false
            } else {
                setErrorName('')
                setLoading(true)
            }
        }else if(isAwardAndActivity){
            if(awardAndActivityFile.length == 0){
                setErrorName('الملف مطلوب')
                setLoading(false)
                return false
            } else {
                setErrorName('')
                setLoading(true)
            }
        }else if(isAwardAndUser){
            if(awardAndUserFile.length == 0){
                setErrorName('الملف مطلوب')
                setLoading(false)
                return false
            } else {
                setErrorName('')
                setLoading(true)
            }
        }else {
            return false
        }
        setLoading(true)
        axios.post(isAward
                            ? `/tools/awards/add`
                            : isCollege
                                ? `/tools/colleges/add`
                                : isLevel
                                    ? `/tools/levels/add`
                                    : isLocation
                                        ? `/tools/locations/add`
                                        : isType
                                            ? `/tools/types/add`
                                            : isAdministrative
                                                ? `/tools/administrative/add`
                                                : isDate
                                                    ? `/tools/dates/add`
                                                    : isAwardAndActivity
                                                        ? `/awards/add`
                                                            : isAwardAndUser
                                                                ? `/awards/show/add`
                                                                : null, isAward
                                                                    ? {awards: awardsFile, isFile: true}
                                                                    : isCollege
                                                                        ? {colleges: collegesFile, isFile: true}
                                                                        : isLevel
                                                                            ? {levels: levelsFile, isFile: true}
                                                                            : isLocation
                                                                                ? {locations: locationsFile, isFile: true}
                                                                                : isType
                                                                                    ? {types: typesFile, isFile: true}
                                                                                    : isAdministrative
                                                                                        ? {administrative: administrativeFile, isFile: true}
                                                                                        : isDate
                                                                                            ? {dates: datesFile, isFile: true}
                                                                                            : isAwardAndActivity
                                                                                                ? {awardAndActivities: awardAndActivityFile, isFile: true}
                                                                                                : isAwardAndUser
                                                                                                    ? {awardAndUsers: awardAndUserFile, isFile: true}
                                                                                                    : null)
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
                    e.target.reset();
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
            }).catch(err => {
            setError("")
            setSuccess("")
            setLoading(false)
        })
    }

    return (
        <section className={Styles.user}>
            <form onSubmit={
                isCountry
                    ? isFile
                        ? handelSubmitCountriesIsFile
                        : isEdit
                            ? handelSubmitCountryEdit
                            : handelSubmitCountry
                    : isCollege || isAward || isLevel || isLocation || isType || isAdministrative || isDate || isTime || isYear || isCertificate || isAwardAndActivity || isAwardAndUser || isCertificateAndActivity
                        ? isFile
                            ? handelSubmitIsFile
                            : isEdit
                                ? handelSubmitEdit
                                : handelSubmit
                        : isAdministrativeClub
                            ? isFile
                                ? handelSubmitAdministrativeClubFile
                                : handelSubmitAdministrativeClub
                            : isCertificateAndUser
                                ? handelSubmitAddCertificateAndUser
                                : isResult
                                    ? isFile
                                        ? handelSubmitAddResultFile
                                        : isEdit
                                            ? handelSubmitEditResult
                                            : handelSubmitAddResult
                                    : null
            }>
                <div>
                    {
                        isCountry && getCountryElements()
                    }
                    {
                        isCollege || isAward || isLevel || isLocation || isType || isAdministrative ? getAuthorElements() : null
                    }
                    {
                        isDate || isTime ? getDateAndTimeElements() : null
                    }
                    {
                        isAwardAndActivity && getAwardsElements()
                    }
                    {
                        isResult && getResultsElements()
                    }
                    {
                        isCertificateAndActivity && getCertificatesElements()
                    }
                    {
                        isAwardAndUser && getAwardAndUserElements()
                    }
                    {
                        isCertificateAndUser && getCertificateAndUserElements()
                    }
                    {
                        isYear && getYearElements()
                    }
                    {
                        isAdministrativeClub && getAdministrativeClubElements()
                    }
                    {
                        error.length > 0 &&
                        <span className={Styles.mess} style={{
                            color: "rgb(235, 81, 81)",
                            gridColumn: "span 3"
                        }}>{error}</span>
                    }
                    {
                        success.length > 0 &&
                        <span className={Styles.mess} style={{
                            color: "green",
                            gridColumn: "span 3"
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
                            isCountry
                                ? isFile
                                    ? <button disabled={done == false ? true : false} style={done == false ? {
                                        backgroundColor: "black",
                                        color: "white"
                                    } : null}>{
                                        done == false
                                            ? "يتم الآن تجهيز الملف..."
                                            : "حفظ الدول"}</button>
                                    : isEdit
                                        ? <button>تحديث الدولة</button>
                                        : <button>حفظ الدولة</button>
                                : isCollege || isAward || isLevel || isLocation || isType || isAdministrative || isDate || isTime || isYear || isAwardAndActivity || isAwardAndUser || isAdministrativeClub || isCertificateAndActivity || isCertificateAndUser || isResult
                                    ? isFile
                                        ? <button disabled={done == false ? true : false} style={done == false ? {
                                            backgroundColor: "black",
                                            color: "white"
                                        } : null}>{
                                            done == false
                                                ? "يتم الآن تجهيز الملف..."
                                                : isCollege
                                                    ? "حفظ الكليات"
                                                    : isAward
                                                        ? "حفظ الجوائز"
                                                        : isLevel
                                                            ? "حفظ المستويات"
                                                            : isLocation
                                                                ? "حفظ المواقع"
                                                                : isType
                                                                    ? "حفظ الأنواع"
                                                                    : isAdministrative
                                                                        ? "حفظ الوظائف"
                                                                        : isDate
                                                                            ? "حفظ التواريخ"
                                                                            : isTime
                                                                                ? "حفظ الأوقات"
                                                                                :  isAwardAndUser || isAwardAndActivity
                                                                                    ? "حفظ الجوائز"
                                                                                    : isAdministrativeClub
                                                                                        ? "حفظ المسؤولين"
                                                                                        : isResult
                                                                                            ? "حفظ النتائج"
                                                                                            : null
                                        }</button>
                                        : isEdit
                                            ? <button>{
                                                isCollege
                                                    ? "تحديث الكلية"
                                                    : isAward
                                                        ? "تحديث الجائزة"
                                                        : isLevel
                                                            ? "تحديث المستوى"
                                                            : isLocation
                                                                ? "تحديث الموقع"
                                                                : isType
                                                                    ? "تحديث النوع"
                                                                    : isAdministrative
                                                                        ? "تحديث الوظيفة"
                                                                        : isDate
                                                                            ? "تحديث التاريخ"
                                                                            : isTime
                                                                                ? "تحديث الوقت"
                                                                                : isYear
                                                                                    ? "تحديث السنة"
                                                                                    : isAwardAndUser
                                                                                        ? "تحديث الجائزة"
                                                                                        : isCertificateAndActivity || isCertificateAndUser
                                                                                            ? "تحديث الشهادة"
                                                                                            : isResult
                                                                                                ? "تحديث النتيجة"
                                                                                                : null
                                            }</button>
                                            : <button>{
                                                isCollege
                                                    ? "حفظ الكلية"
                                                    : isAward
                                                        ? "حفظ الجائزة"
                                                        : isLevel
                                                            ? "حفظ المستوى"
                                                            : isLocation
                                                                ? "حفظ الموقع"
                                                                : isType
                                                                    ? "حفظ النوع"
                                                                    : isAdministrative
                                                                        ? "حفظ الوظيفة"
                                                                        : isDate
                                                                            ? "حفظ التاريخ"
                                                                            : isTime
                                                                                ? "حفظ الوقت"
                                                                                : isYear
                                                                                    ? "حفظ السنة"
                                                                                    : isAwardAndActivity || isAwardAndUser
                                                                                        ? "حفظ الجائزة"
                                                                                        : isAdministrativeClub
                                                                                            ? "إضافة الإداري"
                                                                                            : isCertificateAndActivity || isCertificateAndUser
                                                                                                ? "حفظ الشهادة"
                                                                                                : isResult
                                                                                                    ? "حفظ النتيجة"
                                                                                                    : null
                                            }</button>
                                    : null
                        )

                }
            </form>
        </section>
    )
}
