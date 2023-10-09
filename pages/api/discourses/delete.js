import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Discourse from "../../../models/Discourse";
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
                && session.user.permissions.deleteDiscourse.status
            ){
                await connectMongoDB()
                const {id} = req.query
                if(id.length == 0){
                    res.status(204).json({ error: 'لا توجد بيانات' })
                }else {
                    const discourse = await Discourse.findById(id)
                    if(!discourse){
                        res.status(200).json({ mess: "الخطاب غير موجود" })
                    }else {
                        await Discourse.findByIdAndDelete(id)
                        res.status(201).json({ mess: 'تم حذف الخطاب بنجاح' })
                    }
                }
            }else {
                res.status(200).json({ error: 'غير مسموح لك بحذف هذا الخطاب.' })
            }
        }
    }
}
