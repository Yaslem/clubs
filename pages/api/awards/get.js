import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Club from "../../../models/Club";
import Activity from "../../../models/Activity";
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
                && session.user.permissions.addAward.status
            ){
                const {clubId} = req.query
                await connectMongoDB()
                if(clubId){
                    const activities = await Activity.find({club: clubId}, 'title date')
                    res.status(200).json({activities, success: true })
                }else {
                    const clubs = await Club.find({}, 'name')
                    res.status(200).json({clubs, success: true })
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.addAward.status
            ){
                const {clubId} = req.query
                await connectMongoDB()
                if(clubId){
                    const activities = await Activity.find({club: session.user.club._id}, 'title')
                    res.status(200).json({activities, success: true })
                }else {
                    const clubs = await Club.find({_id: session.user.club._id}, 'name')
                    res.status(200).json({clubs, success: true })
                }
            }
        }
    }
}
