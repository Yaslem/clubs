import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import AwardAndActivity from "../../../../models/AwardAndActivity";
import AwardAndUser from "../../../../models/AwardAndUser";
import Club from "../../../../models/Club";
import Activity from "../../../../models/Activity";
import User from "../../../../models/User";
import Award from "../../../../models/Award";
import Country from "../../../../models/Country";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            await connectMongoDB()
            const {awardId} = req.query
            if(awardId){
                if(
                    (session.user.role === 'admin'
                        || session.user.role === 'coordinator'
                        || session.user.role === 'president')
                    && session.user.permissions.showAward.status
                ){
                    const award = await AwardAndActivity.findById(awardId)
                        .populate({
                            path: 'activityId',
                            select: 'title',
                            model: Activity,
                            populate: [
                                {
                                    path: 'club',
                                    model: Club,
                                    select: 'name'
                                }
                            ]
                        })
                    if(award){
                        const options = {
                            populate: [
                                {
                                    path: 'user',
                                    select: 'name username',
                                    model: User,
                                    populate: [
                                        {
                                            path: 'club',
                                            model: Club,
                                            select: 'name'
                                        },
                                        {
                                            path: 'country',
                                            model: Country,
                                            select: 'name'
                                        }
                                    ]
                                },
                                {
                                    path: 'coordinator',
                                    select: 'name',
                                    model: User,
                                },
                                {
                                    path: 'award',
                                    select: 'name',
                                    model: Award,
                                },
                            ],
                            sort: { createdAt: -1 },
                            page: req.query.page,
                            limit: 20,
                        };
                        const students = await AwardAndUser.paginate({awardAndActivityId: award._id}, options)
                        if(students.length == 0){
                            res.status(200).json({awards: {students, award}, success: false })
                        }else {
                            res.status(200).json({awards: {students, award}, success: true })
                        }

                    }else {
                        return res.status(404).redirect('/')
                    }
                }else if(
                    (session.user.role === 'manager'
                        || session.user.role === 'deputy'
                        || session.user.role === 'officials')
                    && session.user.permissions.showAward.status
                ) {
                    const award = await AwardAndActivity.findById(awardId)
                        .populate({
                            path: 'activityId',
                            select: 'title',
                            model: Activity,
                            populate: [
                                {
                                    path: 'club',
                                    model: Club,
                                    select: 'name'
                                }
                            ]
                        })
                    if(award){
                        const options = {
                            populate: [
                                {
                                    path: 'user',
                                    select: 'name username',
                                    model: User,
                                    populate: [
                                        {
                                            path: 'club',
                                            model: Club,
                                            select: 'name',

                                        },
                                        {
                                            path: 'country',
                                            model: Country,
                                            select: 'name'
                                        }
                                    ]
                                },
                                {
                                    path: 'coordinator',
                                    select: 'name',
                                    model: User,
                                },
                                {
                                    path: 'award',
                                    select: 'name',
                                    model: Award,
                                },
                            ],
                            sort: { createdAt: -1 },
                            page: req.query.page,
                            limit: 20,
                        };
                        const students = await AwardAndUser.paginate({awardAndActivityId: award._id}, options)
                        if(students.length == 0){
                            res.status(200).json({awards: {students, award}, success: false })
                        }else {
                            res.status(200).json({awards: {students, award}, success: true })
                        }

                    }else {
                        return res.status(404).redirect('/')
                    }
                }
            }else {
                return res.status(404).redirect('/')
            }
        }
    }
}
