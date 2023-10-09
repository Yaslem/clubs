import connectMongoDB from "../../libs/mongodb";
import Activity from "../../models/Activity";
import Post from "../../models/Post";
import AwardAndUser from "../../models/AwardAndUser";
import Certificate from "../../models/Certificate";
import {getServerSession} from "next-auth";
import {options} from "./auth/[...nextauth]";
export default async function handler(req, res) {
    let awards = 0
    let certificates = 0
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(session){
        awards = await AwardAndUser.count({user: session.user.id})
        certificates = await Certificate.count({user: session.user.id})
    }
    if(method !== 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        async function getDay(day){
            switch (day) {
                case 1: {
                    return `0${day}`
                    break
                }
                case 2: {
                    return `0${day}`
                    break
                }
                case 3: {
                    return `0${day}`
                    break
                }
                case 4: {
                    return `0${day}`
                    break
                }
                case 5: {
                    return `0${day}`
                    break
                }
                case 6: {
                    return `0${day}`
                    break
                }
                case 7: {
                    return `0${day}`
                    break
                }
                case 8: {
                    return `0${day}`
                    break
                }
                case 9: {
                    return `0${day}`
                    break
                }
                default:
                    return `${day}`
                    break
            }
        }
        async function getMonths(month){
            switch (month) {
                case 1: {
                    return `0${month}`
                    break
                }
                case 2: {
                    return `0${month}`
                    break
                }
                case 3: {
                    return `0${month}`
                    break
                }
                case 4: {
                    return `0${month}`
                    break
                }
                case 5: {
                    return `0${month}`
                    break
                }
                case 6: {
                    return `0${month}`
                    break
                }
                case 7: {
                    return `0${month}`
                    break
                }
                case 8: {
                    return `0${month}`
                    break
                }
                case 9: {
                    return `0${month}`
                    break
                }
                default:
                    return `${month}`
                    break
            }
        }
        const dateNow = now.getFullYear() + '-' + await getMonths(now.getMonth() + 1) + '-' + await getDay(now.getDate())
        const nextTomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        await connectMongoDB()
        const week = await Activity.count({"date": { $gte: now, $lte: nextWeek }})
        const posts = await Post.count({})
        const toDay = await Activity.count({date: dateNow})
        const tomorrow = await Activity.count({"date": { $gte: now, $lte: nextTomorrow }})
        res.status(200).json({count: {week, toDay, tomorrow, posts, awards, certificates}, success: true })
    }
}
