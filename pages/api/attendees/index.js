import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Activity from "../../../models/Activity";
import Location from "../../../models/Location";
import Type from "../../../models/Type";
import Club from "../../../models/Club";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
            ){
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'club',
                            model: Club,
                            select: 'name'
                        },
                        {
                            path: 'location',
                            model: Location,
                            select: 'name'
                        },
                        {
                            path: 'type',
                            model: Type,
                            select: 'name'
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const activities = await Activity.paginate({isAttend: true}, options)
                if(activities.totalDocs == 0){
                    res.status(200).json({activities, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({activities, success: true })
                }
            }else {
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'club',
                            model: Club,
                            select: 'name',
                        },
                        {
                            path: 'location',
                            model: Location,
                            select: 'name'
                        },
                        {
                            path: 'type',
                            model: Type,
                            select: 'name'
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const activities = await Activity.paginate({isAttend: true, club: session.user.club._id}, options)
                if(activities.totalDocs == 0){
                    res.status(200).json({activities, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({activities, success: true })
                }
            }
        }
    }
}
