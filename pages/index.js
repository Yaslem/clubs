import Head from 'next/head'
import Styles from '../styles/Home.module.css'
import {useSession} from "next-auth/react";
import ToDay from "../components/ToDay";
import useSWR from "swr";
import axios from "axios";
import Image from 'next/image';
import Loading from "../components/Loading";
import {NextSeo} from "next-seo";
const fetcher = url => axios.get(url).then(res => res.data);
export default function Home() {
    const { data: count, isError, isLoading } = useSWR(`/count`, fetcher)
    const title = "الرئيسية";
    const {data: session} = useSession()

    function getRole(role, club = ''){
        switch (role) {
            case "admin":
                return "مدير الموقع"
                break
            case "president":
                return "المشرف على الأندية"
                break
            case "coordinator":
                return `منسق في ${club}`
                break
            case "manager":
                return `مدير ${club}`
                break
            case "student":
                return `عضو في ${club}`
                break
            case "officials":
                return `مسؤول في ${club}`
                break
            case "deputy":
                return `نائب مسؤول في ${club}`
                break
        }
    }

  return (
      <>
          <NextSeo
              title={`${title} | ${process.env.SITE_TITLE}`}
              description="تعرض الصفحة الرئيسية لموقع الأندية الطلابية بالجامعة الإسلامية فعاليات اليوم، والغد، والأسبوع المقبل، بالإضافة إلى عرض سريع لبيانات الطالب."
          />
          {
              isLoading
                ? <Loading />
                : <section className={Styles.index}>
                      {
                          session
                              ? <div className={Styles.info}>
                                  <div>
                                      <span>{getRole(session.user.role, session.user.club.name)}</span>
                                      <div>
                                          <Image src={`/uploads/files/${session.user.avatar}`} width={100} height={100}/>
                                          <div>
                                              <span>{session.user.name}</span>
                                              <span>{session.user.username}@stu.iu.edu.sa</span>
                                              <span>{session.user.email}</span>
                                          </div>
                                      </div>
                                  </div>
                                  <ul>
                                      <li>
                                          <span>الجنسية:</span>
                                          <span>{`${session.user.country.name}`}</span>
                                      </li>
                                      <hr />
                                      <li>
                                          <span>الكلية، المستوى:</span>
                                          <span>{`${session.user.college.name}، ${session.user.level.name}`}</span>
                                      </li>
                                      <hr />
                                      <li>
                                          <span>الشهادات:</span>
                                          <span>{count.count.certificates}</span>
                                      </li>
                                      <hr />
                                      <li>
                                          <span>الجوائز:</span>
                                          <span>{count.count.awards}</span>
                                      </li>
                                  </ul>
                              </div>
                              : null
                      }
                      <div className={Styles.card}>
                          <div>
                              <span style={{
                                  backgroundColor: "rgba(47, 73, 209, 0.1)"
                              }}>
                                  <svg fill="#636ba1" width="60px" height="60px" viewBox="-4.8 -4.8 33.60 33.60" xmlns="http://www.w3.org/2000/svg" stroke="#636ba1"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="package-sended"> <path d="M18.5,3H5.5A2.503,2.503,0,0,0,3,5.5v13A2.5026,2.5026,0,0,0,5.5,21h7a.5.5,0,0,0,0-1h-7A1.5017,1.5017,0,0,1,4,18.5V5.5A1.5017,1.5017,0,0,1,5.5,4H9V9.5a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5V4h3.5A1.5017,1.5017,0,0,1,20,5.5v8a.5.5,0,0,0,1,0v-8A2.503,2.503,0,0,0,18.5,3ZM14,9H10V4h4Z"></path> <path d="M20.8535,16.8535l-3.5,3.5a.5.5,0,0,1-.707,0l-1.5-1.5a.5.5,0,0,1,.707-.707L17,19.293l3.147-3.1465a.5.5,0,0,1,.707.707Z"></path> </g> </g></svg>
                              </span>
                              <div>
                                  <span>{count.count.toDay}</span>
                                  <p>عدد فعاليات اليوم</p>
                              </div>
                          </div>
                          <div>
                              <span style={{
                                  backgroundColor: "rgba(255, 182, 72, 0.1)"
                              }}>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={60}
                                      height={60}
                                      fill="#c19a9a"
                                      viewBox="-10 -10 70 70"
                                  >
                                    <path d="M7.906 1.969c-.043.008-.086.02-.125.031A1.002 1.002 0 0 0 7 3v9h9c.36.004.695-.184.879-.496a1.01 1.01 0 0 0 0-1.008c-.184-.312-.52-.5-.879-.496h-5.688C14.102 6.293 19.277 4 25 4c11.61 0 21 9.39 21 21s-9.39 21-21 21S4 36.61 4 25c0-3.473.855-6.742 2.344-9.625l-1.782-.906A22.863 22.863 0 0 0 2 25c0 12.691 10.309 23 23 23s23-10.309 23-23S37.691 2 25 2C18.773 2 13.14 4.504 9 8.531V3a1 1 0 0 0-1.094-1.031ZM25 5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1Zm9.5 2.531c-.55 0-1 .45-1 1 0 .551.45 1 1 1s1-.449 1-1c0-.55-.45-1-1-1Zm6.969 6.969c-.551 0-1 .45-1 1s.449 1 1 1c.55 0 1-.45 1-1s-.45-1-1-1Zm-23.094 2.406c-2.773 0-4.75 1.809-4.75 4.407v.03h2.063v-.03c0-1.504 1.039-2.5 2.593-2.5 1.453 0 2.563.96 2.563 2.25 0 1.035-.457 1.785-2.344 3.75l-4.75 4.937v1.594h9.5v-1.969h-6.469v-.156l3.157-3.188C22.3 23.641 23 22.43 23 20.938c0-2.325-1.95-4.032-4.625-4.032Zm13.219.344c-2.512 3.762-4.614 7.04-5.875 9.344v2.031h6.875v2.719h2.093v-2.719h1.97v-1.969h-1.97V17.25Zm.906 1.938h.125v7.53h-4.813v-.155a105.999 105.999 0 0 1 4.688-7.375ZM6 24c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1Zm38 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1ZM8.531 33.5c-.55 0-1 .45-1 1s.45 1 1 1c.551 0 1-.45 1-1s-.449-1-1-1Zm32.938 0c-.551 0-1 .45-1 1s.449 1 1 1c.55 0 1-.45 1-1s-.45-1-1-1ZM15.5 40.469c-.55 0-1 .449-1 1 0 .55.45 1 1 1s1-.45 1-1c0-.551-.45-1-1-1Zm19 0c-.55 0-1 .449-1 1 0 .55.45 1 1 1s1-.45 1-1c0-.551-.45-1-1-1ZM25 43c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1Z" />
                                  </svg>
                              </span>
                              <div>
                                  <span>{count.count.tomorrow}</span>
                                  <p>عدد فعاليات الغد</p>
                              </div>
                          </div>
                          <div>
                              <span style={{
                                  backgroundColor: "rgba(95, 46, 234, 0.1)"
                              }}>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlSpace="preserve"
                                      width={50}
                                      height={50}
                                      fill="#efeafd"
                                      viewBox="-9.03 -9.03 63.23 63.23"
                                  >
                                    <path
                                        d="M38.255 7.859v2.597c0 2.414-1.964 4.378-4.378 4.378s-4.378-1.964-4.378-4.378V7.5H15.5v2.956c0 2.414-1.964 4.378-4.378 4.378s-4.378-1.964-4.378-4.378v-2.53A4.997 4.997 0 0 0 3.75 12.5v27.667a5 5 0 0 0 5 5h27.667a5 5 0 0 0 5-5V12.5a4.995 4.995 0 0 0-3.162-4.641zm-.917 32.813H7.828V19h29.51v21.672z"
                                        style={{
                                            fill: "#756a95",
                                        }}
                                    />
                                    <path
                                        d="M11.122 12.834a2.378 2.378 0 0 0 2.378-2.378V2.378a2.378 2.378 0 0 0-4.756 0v8.078a2.378 2.378 0 0 0 2.378 2.378zM33.877 12.834a2.378 2.378 0 0 0 2.378-2.378V2.378a2.378 2.378 0 0 0-4.756 0v8.078a2.378 2.378 0 0 0 2.378 2.378zM35.338 21H9.828v17.672h25.51V21zm-8.814 5.893-4.681 8.495c-.333.617-.733.866-1.233.866-.683 0-1.316-.417-1.316-1.15 0-.216.1-.565.233-.799l4.331-7.596h-4.464a1.102 1.102 0 0 1-1.116-1.1c0-.616.499-1.116 1.116-1.116h6.33c.717 0 1.166.417 1.166 1.15 0 .383-.15.85-.366 1.25z"
                                        style={{
                                            fill: "#756a95",
                                        }}
                                    />
                                  </svg>
                              </span>
                              <div>
                                  <span>{count.count.week}</span>
                                  <p>عدد فعاليات الأسبوع</p>
                              </div>
                          </div>
                          <div>
                  <span style={{
                      backgroundColor: "rgba(75, 222, 151, 0.1)"
                  }}>
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={50}
                          height={50}
                          fill="#edfcf4"
                          style={{
                              marginRight: "-7px",
                          }}
                          viewBox="-9.6 -9.6 67.2 67.2"
                      >
                        <path
                            fill="#619479"
                            d="M5 48a5.005 5.005 0 0 1-5-5V5a5.006 5.006 0 0 1 5-5h21.07a.9.9 0 0 1 .489.138.876.876 0 0 1 .219.157l8.908 8.977a1 1 0 0 1 .314.7v33.025a5.006 5.006 0 0 1-5 5ZM2 5v38a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3V10h-4a3.626 3.626 0 0 1-4-4V2H5a3 3 0 0 0-3 3Zm25 1a3 3 0 0 0 3 3h3l-6-6ZM7 38a1 1 0 1 1 0-2h12a1 1 0 0 1 0 2Zm0-7a1 1 0 1 1 0-2h22a1 1 0 1 1 0 2Zm0-7a1 1 0 1 1 0-2h22a1 1 0 1 1 0 2Zm0-7a1 1 0 0 1 0-2h22a1 1 0 0 1 0 2Z"
                        />
                      </svg>
                  </span>
                              <div>
                                  <span>{count.count.posts}</span>
                                  <p>عدد المنشورات</p>
                              </div>
                          </div>
                      </div>
                      <ToDay />
                  </section>
          }
      </>
  )
}
