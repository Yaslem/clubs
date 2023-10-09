import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import AwardAndActivity from "../../../models/AwardAndActivity";
import Activity from "../../../models/Activity";
import Club from "../../../models/Club";
import Location from "../../../models/Location";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.showAward.status
            ){
                await connectMongoDB()
                const options = {
                    populate: {
                        path: 'activityId',
                        select: "title presenter location date club createdAt",
                        model: Activity,
                        populate: [
                            {
                                path: 'club',
                                select: "name",
                                model: Club,
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: "name",
                            }
                        ]
                    },
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const awards = await AwardAndActivity.paginate({}, options)
                if(awards.totalDocs === 0){
                    res.status(200).json({awards, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({awards, success: true })
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showAward.status
            ){
                await connectMongoDB()
                const options = {
                    populate: {
                        path: 'activityId',
                        select: "title presenter location date club createdAt",
                        model: Activity,
                        populate: [
                            {
                                path: 'club',
                                select: "name",
                                model: Club,
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: "name",
                            }
                        ]
                    },
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const awards = await AwardAndActivity.paginate({club: session.user.club._id}, options)
                if(awards.totalDocs === 0){
                    res.status(200).json({awards, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({awards, success: true })
                }

            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
