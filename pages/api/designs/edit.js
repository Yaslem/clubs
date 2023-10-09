import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Design from "../../../models/Design";
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
                && session.user.permissions.editDesign.status
            ){
                await connectMongoDB()
                const {id, notes, status, club, activity} = req.body
                if(id.length === 0 || activity.length === 0 || club.length === 0){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    if(await Design.count({_id: id}) != 0){
                        await Design.findByIdAndUpdate(id, {
                            status: status,
                            notes: notes,
                        })
                        res.status(201).json({ success: true, mess: "تم تحديث طلب التصميم بنجاح" })
                    }else {
                        res.status(200).json({ mess: "هذا التصميم غير موجود." })
                    }
                }
            }else if(session.user.permissions.editDesign.status){
                await connectMongoDB()
                const {id, notes, status, club, activity} = req.body
                if(id.length === 0 || activity.length === 0 || club.length === 0){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    if(await Design.count({_id: id}) !== 0){
                        await Design.findByIdAndUpdate(id, {
                            status: status,
                            notes: notes,
                        })
                        res.status(201).json({ success: true, mess: "تم تحديث طلب التصميم بنجاح" })
                    }else {
                        res.status(200).json({ mess: "هذا التصميم غير موجود." })
                    }
                }
            }
        }
    }
}
