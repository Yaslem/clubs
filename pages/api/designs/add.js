import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Design from "../../../models/Design";
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
                && session.user.permissions.addDesign.status
            ){
                await connectMongoDB()
                const {notes, club, activity} = req.body
                if(activity.length === 0 || club.length === 0){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    if(await Design.count({activity}) == 0){
                        await Design.create({
                            activity: activity,
                            notes: notes,
                            club: club,
                        })
                        res.status(201).json({ success: true, mess: "تم إنشاء طلب التصميم بنجاح" })
                    }else {
                        res.status(200).json({ mess: "طلب تصميم هذه الفعالية موجود بالفعل." })
                    }
                }
            }else if(session.user.permissions.addDesign.status){
                await connectMongoDB()
                const {notes, activity} = req.body
                if(activity.length === 0){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    if(await Design.count({activity}) === 0){
                        await Design.create({
                            activity: activity,
                            notes: notes,
                            club: session.user.club._id,
                        })
                        res.status(201).json({ success: true, mess: "تم إنشاء طلب التصميم بنجاح" })
                    }else {
                        res.status(200).json({ mess: "طلب تصميم هذه الفعالية موجود بالفعل." })
                    }
                }
            }
        }
    }
}
