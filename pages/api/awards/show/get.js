import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Club from "../../../../models/Club";
import Attend from "../../../../models/Attend";
import User from "../../../../models/User";
import Award from "../../../..//models/Award";
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
                    || session.user.role === 'president'
                    || session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.addAward.status
            ){
                const {activity} = req.query
                await connectMongoDB()
                if(activity){
                    const students = []
                    const awards = await Award.find({}, 'name');
                    const coordinators = await User.find({role: 'coordinator'}, 'name');
                    const activities = await Attend.find({activity: activity}, 'user')
                        .populate({
                            path: 'user',
                            model: User
                        })

                    activities.forEach(async activity => {
                        students.push({
                            user: {
                                name: activity.user.name,
                                id: activity.user._id
                            }
                        })
                    })
                    res.status(200).json({students, awards, coordinators, success: true })
                }else {
                    res.status(200).json({success: true })
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
