import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import UserClub from "../../../../models/UserClub";
import Club from "../../../../models/Club";
import User from "../../../../models/User";
import Activity from "../../../../models/Activity";
import Post from "../../../../models/Post";
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
            const clubs = await UserClub.find({user: session.user.id}, 'club')
                .populate([
                    {
                        path: "club",
                        model: Club,
                        populate: [
                            {
                                path: 'studentsCount',
                                model: User
                            },
                            {
                                path: 'activitiesCount',
                                model: Activity,
                            },
                            {
                                path: 'postsCount',
                                model: Post,
                            }
                        ]
                    }
                ])
            res.status(200).json({clubs, success: true })
        }
    }
}
