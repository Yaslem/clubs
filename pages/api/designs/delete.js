import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Design from "../../../models/Design";
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
                && session.user.permissions.deleteDesign.status
            ){
                await connectMongoDB()
                const {id} = req.query
                if(id.length == 0){
                    res.status(204).json({ error: 'لا توجد بيانات' })
                }else {
                    const design = await Design.findById(id)
                    if(!design){
                        res.status(200).json({ mess: "التصميم غير موجود" })
                    }else {
                        await Design.findByIdAndDelete(id)
                        res.status(201).json({ mess: 'تم حذف التصميم بنجاح' })
                    }
                }
            }else {
                res.status(200).json({ error: 'غير مسموح لك بحذف هذا التصميم.' })
            }
        }
    }
}
