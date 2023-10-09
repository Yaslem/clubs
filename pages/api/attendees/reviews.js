import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Attend from "../../../models/Attend";
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
                            path: 'activity',
                            select: 'title ',
                            populate: {
                                path: 'club',
                                select: 'name'
                            }
                        },
                        {
                            path: 'user',
                            select: 'name',
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const reviews = await Attend.paginate({}, options)
                if(reviews.totalDocs === 0){
                    res.status(200).json({reviews, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({reviews, success: true })
                }
            }else if(session.user.role === 'manager' || session.user.role === 'officials' || session.user.role === 'deputy'
            ){
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'activity',
                            select: 'title ',
                            populate: {
                                path: 'club',
                                select: 'name'
                            },
                        },
                        {
                            path: 'user',
                            select: 'name',
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const reviews = await Attend.paginate({club: session.user.club._id}, options)
                if(reviews.totalDocs === 0){
                    res.status(200).json({reviews, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({reviews, success: true })
                }
            }else {
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'activity',
                            select: 'title ',
                            populate: {
                                path: 'club',
                                select: 'name'
                            },
                        },
                        {
                            path: 'user',
                            select: 'name',
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const reviews = await Attend.paginate({user: session.user.id}, options)
                if(reviews.totalDocs === 0){
                    res.status(200).json({reviews, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({reviews, success: true })
                }
            }
        }
    }
}
