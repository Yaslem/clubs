import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Report from "../../../models/Report";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'DELETE'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {

            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president'
                    || session.user.role === 'manager'
                    || session.user.role === 'officials')
                && session.user.permissions.deleteReport.status
            ){
                await connectMongoDB()
                const {id} = req.query
                if(id.length == 0){
                    res.status(204).json({ error: 'لا توجد بيانات' })
                }else {
                    const report = await Report.findById(id)
                    if(!report){
                        res.status(200).json({ mess: "التقرير غير موجود" })
                    }else {
                        await Report.findByIdAndDelete(id)
                        res.status(201).json({ mess: 'تم حذف التقرير بنجاح' })
                    }
                }
            }else {
                res.status(200).json({ error: 'غير مسموح لك بحذف هذا المشنور.' })
            }
        }
    }
}
