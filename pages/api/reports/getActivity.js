import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Activity from "../../../models/Activity";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'POST'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.addReport.status
            ){
                const {clubId} = req.body
                await connectMongoDB()
                const activities = await Activity.find({club: clubId}, 'title date')
                res.status(200).json({activities, success: true })
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showReport.status
            ){
                await connectMongoDB()
                const activities = await Activity.find({club: session.user.club._id}, 'title date')
                res.status(200).json({activities, success: true })
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
