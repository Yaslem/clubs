import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Time from "../../../../models/Time";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'PUT'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {
            if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
                await connectMongoDB()
                const {id, start, end} = req.body
                if(id.length == 0 || start.length == 0 || end.length == 0){
                    res.status(204).json({ error: 'لا توجد بيانات' })
                }else {
                    const time = await Time.findById(id)
                    if(!time){
                        res.status(200).json({ mess: "الوقت غير موجود" })
                    }else {
                        await Time.updateOne({_id: id}, {start, end})
                        res.status(201).json({ mess: 'تمت تحديث الوقت بنجاح' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
