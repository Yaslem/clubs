import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Club from "../../../../models/Club";
import Management from "../../../../models/Management";
import User from "../../../../models/User";
import Activity from "../../../../models/Activity";
import Post from "../../../../models/Post";
import AdministrativeClub from "../../../../models/AdministrativeClub";
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
                && session.user.permissions.showClub.status
            ){
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'studentsCount',
                            model: User
                        },
                        {
                            path: 'manager',
                            model: User,
                            select: 'name'
                        },
                        {
                            path: 'activitiesCount',
                            model: Activity,
                        },
                        {
                            path: 'managementsCount',
                            model: Management,
                        },
                        {
                            path: 'administrativeCount',
                            model: AdministrativeClub,
                        },
                        {
                            path: 'postsCount',
                            model: Post,
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const clubs = await Club.paginate({}, options)
                if(clubs.totalDocs == 0){
                    res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({clubs, success: true })
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showClub.status
            ){
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'studentsCount',
                            model: User
                        },
                        {
                            path: 'manager',
                            model: User,
                            select: 'name'
                        },
                        {
                            path: 'activitiesCount',
                            model: Activity,
                        },
                        {
                            path: 'managementsCount',
                            model: Management,
                        },
                        {
                            path: 'administrativeCount',
                            model: AdministrativeClub,
                        },
                        {
                            path: 'postsCount',
                            model: Post,
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const clubs = await Club.paginate({_id: session.user.club._id}, options)
                if(clubs.totalDocs == 0){
                    res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({clubs, success: true })
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
