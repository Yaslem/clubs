import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Report from "../../../models/Report";
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
                && session.user.permissions.showReport.status
            ){
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'user',
                            select: 'name avatar'
                        },
                        {
                            path: 'club',
                            select: 'name'
                        },
                        {
                            path: 'activity',
                            select: 'title status',
                            populate: [
                                {
                                    path: "location",
                                    select: "name"
                                },
                                {
                                    path: "type",
                                    select: "name"
                                }
                            ]
                        },
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const reports = await Report.paginate({}, options)
                if(reports.totalDocs == 0){
                    res.status(200).json({reports, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({reports, success: true })
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showReport.status
            ){
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'user',
                            select: 'name avatar'
                        },
                        {
                            path: 'club',
                            select: 'name'
                        },
                        {
                            path: 'activity',
                            select: 'title status',
                            populate: [
                                {
                                    path: "location",
                                    select: "name"
                                },
                                {
                                    path: "type",
                                    select: "name"
                                }
                            ]
                        },
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const reports = await Report.paginate({club: session.user.club._id, user: session.user.id}, options)
                if(reports.totalDocs == 0){
                    res.status(200).json({reports, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({reports, success: true })
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
