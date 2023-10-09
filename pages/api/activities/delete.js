import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Activity from "../../../models/Activity";
import Attend from "../../../models/Attend";
import AwardAndActivity from "../../../models/AwardAndActivity";
import CertificateAndActivity from "../../../models/CertificateAndActivity";
import Design from "../../../models/Design";
import Discourse from "../../../models/Discourse";
import Report from "../../../models/Report";
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
                && session.user.permissions.deleteActivity.status
            ){
                await connectMongoDB()
                const {id} = req.query
                if(id.length == 0){
                    res.status(204).json({ error: 'لا توجد بيانات' })
                }else {
                    const activity = await Activity.findById(id)
                    if(!activity){
                        res.status(200).json({ mess: "الفعالية غير موجود" })
                    }else {
                        await Attend.deleteMany({activity: id})
                        await AwardAndActivity.deleteMany({activityId: id})
                        await CertificateAndActivity.deleteMany({activityId: id})
                        await Design.deleteMany({})
                        await Discourse.deleteMany({activity: id})
                        await Report.deleteMany({activity: id})

                        await Activity.findByIdAndDelete(id)
                        res.status(201).json({ mess: 'تم حذف الفعالية بنجاح' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بحذف هذه الفعالية.' })
            }
        }
    }
}
