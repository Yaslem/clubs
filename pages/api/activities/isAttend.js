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
                && session.user.permissions.showActivity.status
            ){
                const {activityId, statusActivity} = req.body
                if(activityId.toString().length == 0 || statusActivity.toString().length == 0){
                    res.status(200).json({mess: "لا توجد بيانات", success: false })
                }else {
                    await connectMongoDB()
                    const activity = await Activity.findById(activityId)
                    if(statusActivity == true){
                        await Activity.findByIdAndUpdate(activityId, {isAttend: true})
                        res.status(201).json({mess: `تم فتح التحضير في فعالية ${activity.title}`, success: true })
                    }else {
                        await connectMongoDB()
                        await Activity.findByIdAndUpdate(activityId, {isAttend: false})
                        res.status(201).json({mess: `تم إغلاق التحضير في فعالية ${activity.title}`, success: true })
                    }
                }
            }else {
                res.status(200).json({mess: "غير مسموج لك بتعديل حالة التحضير في الفعالية.", success: false })
            }
        }
    }
}
