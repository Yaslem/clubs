import {getServerSession} from "next-auth";
import {options} from "../../../auth/[...nextauth]";
import connectMongoDB from "../../../../../libs/mongodb";
import User from "../../../../../models/User";
import Administrative from "../../../../../models/Administrative";
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
                && session.user.permissions.showClub.status
            ){
                const {clubId} = req.query
                if(clubId){
                    await connectMongoDB()
                    const students = await User.find({club: clubId, role: "officials"})
                    const deputy = await User.find({club: clubId, role: "deputy"})
                    const administrative = await Administrative.find({})
                    if(students.length == 0 && administrative.length == 0){
                        res.status(200).json({students: {}, administrative: {}, deputy: {}, mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, administrative, deputy, success: true })
                    }
                }else {
                    res.status(200).json({students: {}, administrative: {}, deputy: {}, mess: 'لا توجد بيانات', success: false })
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
