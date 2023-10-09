import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Club from "../../../../models/Club";
import User from "../../../../models/User";
import AwardAndUser from "../../../../models/AwardAndUser";
import Country from "../../../../models/Country";
import Award from "../../../../models/Award";
import AwardAndActivity from "../../../../models/AwardAndActivity";
import Activity from "../../../../models/Activity";
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
                const {student} = req.query
                await connectMongoDB()
                if(student){
                    const options = {
                        populate: [
                            {
                                path: 'user',
                                select: 'name username',
                                model: User,
                                populate: {
                                    path: 'country',
                                    model: Country,
                                    select: 'name'
                                }
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
                            {
                                path: 'awardAndActivityId',
                                select: 'awardAndActivityId',
                                model: AwardAndActivity,
                                populate: [
                                    {
                                        path: 'activityId',
                                        model: Activity,
                                        select: 'club title',
                                        populate: {
                                            path: 'club',
                                            model: Club,
                                            select: 'name'
                                        },
                                    },
                                ]
                            },
                        ],
                        select: "awardId awardAndActivityId status coordinator user award",
                        sort: { createdAt: -1 },
                        page: req.query.page,
                        limit: 20,
                    };
                    const students = await AwardAndUser.paginate({user: student}, options)
                    res.status(200).json({students, success: true })
                }else {
                    res.status(200).json({success: true })
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showAward.status
            ){
                const {student} = req.query
                await connectMongoDB()
                if(student){
                    const options = {
                        populate: [
                            {
                                path: 'user',
                                select: 'name username',
                                model: User,
                                populate: {
                                    path: 'country',
                                    model: Country,
                                    select: 'name'
                                }
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
                            {
                                path: 'awardAndActivityId',
                                select: 'awardAndActivityId',
                                model: AwardAndActivity,
                                populate: [
                                    {
                                        path: 'activityId',
                                        model: Activity,
                                        select: 'club title',
                                        populate: {
                                            path: 'club',
                                            model: Club,
                                            select: 'name'
                                        },
                                    },
                                ]
                            },
                        ],
                        select: "awardId awardAndActivityId status coordinator user award",
                        sort: { createdAt: -1 },
                        page: req.query.page,
                        limit: 20,
                    };
                    const students = await AwardAndUser.paginate({user: student}, options)
                    res.status(200).json({students, success: true })
                }else {
                    res.status(200).json({success: true })
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
