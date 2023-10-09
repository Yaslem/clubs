import connectMongoDB from "../../libs/mongodb";
import Activity from "../../models/Activity";
import Location from "../../models/Location";
import Club from "../../models/Club";
export default async function handler(req, res) {
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        const now = new Date();
        await connectMongoDB()
        const options = {
            populate: [
                {
                    path: "location",
                    model: Location,
                    select: "name"
                },
                {
                    path: "club",
                    model: Club,
                    select: "name"
                }
            ],
            select: "title presenter location club date from to",
            sort: { date: -1 },
            page: req.query.page,
            limit: 100,
        };
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
        const activities = await Activity.paginate({date: dateNow}, options)
        if(activities.totalDocs != 0){
            res.status(200).json({activities, success: true })
        }else {
            res.status(200).json({mess: "لا توجد بيانات.", success: false })
        }
    }
}
