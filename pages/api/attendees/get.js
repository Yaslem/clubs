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
            const {clubId} = req.query
            await connectMongoDB()
            if(clubId){
                const activities = await Activity.find({club: clubId}, 'title')
                res.status(200).json({activities, success: true })
            }else {
                const clubs = await Club.find({}, 'name')
                res.status(200).json({clubs, success: true })
            }
        }
    }
}
