import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Discourse from "../../../models/Discourse";
import Location from "../../../models/Location";
import Type from "../../../models/Type";
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
                && session.user.permissions.showDiscourse.status
            ){
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'activity',
                            populate: [
                                {
                                    path: 'type',
                                    model: Type
                                },
                                {
                                    path: 'location',
                                    model: Location
                                }
                            ]
                        },
                        {
                            path: 'club',
                            select: 'name'
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const discourses = await Discourse.paginate({}, options)
                if(discourses.totalDocs == 0){
                    res.status(200).json({discourses, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({discourses, success: true })
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'officials'
                    || session.user.role === 'deputy')
                && session.user.permissions.showDiscourse.status
            ){
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'activity',
                            populate: [
                                {
                                    path: 'type'
                                },
                                {
                                    path: 'location'
                                }
                            ]
                        },
                        {
                            path: 'club',
                            select: 'name'
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const discourses = await Discourse.paginate({club: session.user.club._id}, options)
                if(discourses.totalDocs == 0){
                    res.status(200).json({discourses, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({discourses, success: true })
                }
            }else {
                res.status(200).json({mess: 'لا يمكنك عرض هذه الصفحة.', success: false })
            }
        }
    }
}
