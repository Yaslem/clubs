import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Discourse from "../../../models/Discourse";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'PUT'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.editDiscourse.status
            ){
                await connectMongoDB()
                const {notes, id, status, name, side, numbers, surname} = req.body
                if(status.length === 0 || id.length === 0 || name.length === 0 || side.length === 0 || numbers.length === 0 || surname.length === 0){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    if(await Discourse.count({_id: id}) != 0){
                        await Discourse.findByIdAndUpdate(id, {
                            status: status,
                            notes: notes,
                            name: name,
                            side: side,
                            numbers: numbers,
                            surname: surname,
                        })
                        res.status(201).json({ success: true, mess: "تم تحديث الخطاب بنجاح" })
                    }else {
                        res.status(200).json({ mess: "هذا الخطاب غير موجود." })
                    }
                }
            }else if(session.user.permissions.editDiscourse.status){
                await connectMongoDB()
                const {notes, club, activity, name, side, numbers, surname} = req.body
                if(activity.length === 0 || club.length === 0 || name.length === 0 || side.length === 0 || numbers.length === 0 || surname.length === 0){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    if(await Discourse.count({activity}) == 0){
                        await Discourse.create({
                            activity: activity,
                            notes: notes,
                            club: session.user.club._id,
                            name: name,
                            side: side,
                            numbers: numbers,
                            surname: surname,
                        })
                        res.status(201).json({ success: true, mess: "تم رفع الخطاب بنجاح" })
                    }else {
                        res.status(200).json({ mess: "هذا الخطاب موجود بالفعل." })
                    }
                }
            }
        }
    }
}
