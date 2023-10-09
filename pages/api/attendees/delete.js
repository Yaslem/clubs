import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Attend from "../../../models/Attend";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'DELETE'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {

            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.deleteAttend.status
            ){
                await connectMongoDB()
                const {id} = req.query
                if(id.length == 0){
                    res.status(204).json({ error: 'لا توجد بيانات' })
                }else {
                    const attend = await Attend.findById(id)
                    if(!attend){
                        res.status(200).json({ mess: "التقييم غير موجود" })
                    }else {
                        await Attend.findByIdAndDelete(id)
                        res.status(201).json({ mess: 'تم حذف التقييم بنجاح' })
                    }
                }
            }else {
                res.status(200).json({ mess: "لا يمكنك حذف هذا التقييم." })
            }
        }
    }
}
