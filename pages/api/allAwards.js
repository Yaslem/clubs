import {getServerSession} from "next-auth";
import {options} from "./auth/[...nextauth]";
import connectMongoDB from "../../libs/mongodb";
import Club from "../../models/Club";
import User from "../../models/User";
import AwardAndUser from "../../models/AwardAndUser";
import Country from "../../models/Country";
import Award from "../../models/Award";
import AwardAndActivity from "../../models/AwardAndActivity";
import Activity from "../../models/Activity";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method !== 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            await connectMongoDB()
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
                limit: 6,
            };
            const awards = await AwardAndUser.paginate({user: session.user.id}, options)
            res.status(200).json({awards, success: true })

        }
    }
}
