import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Location from "../../../../models/Location";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'DELETE'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {
            if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
                await connectMongoDB()
                const {id} = req.query
                if(!id){
                    res.status(204).json({ error: 'لا توجد بيانات' })
                }else {
                    const location = await Location.findById(id)
                    if(!location){
                        res.status(200).json({ mess: "الموقع غير موجود" })
                    }else {
                        await Location.findByIdAndDelete(id)
                        res.status(201).json({ mess: 'تم حذف الموقع بنجاح' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
