import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import User from "../../../../models/User";
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
                && session.user.permissions.addClub.status
            ){
                await connectMongoDB()
                const students = await User.find({role: "manager"}, 'name')
                if(students.length == 0){
                    res.status(200).json({students, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({students, success: true })
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
