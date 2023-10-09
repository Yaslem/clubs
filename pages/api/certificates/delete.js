import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Certificate from "../../../models/Certificate";
import CertificateAndActivity from "../../../models/CertificateAndActivity";
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
                && session.user.permissions.deleteCertificate.status
            ){
                await connectMongoDB()
                const {id} = req.query
                if(id.toString().length == 0){
                    res.status(200).json({ error: 'لا توجد بيانات' })
                }else {
                    const certificate = await CertificateAndActivity.findById(id)
                    if(!certificate){
                        res.status(200).json({ mess: "هذه الشهادة غير موجودة." })
                    }else {
                        await Certificate.deleteMany({certificateActivityId: certificate._id})
                        await CertificateAndActivity.findByIdAndDelete(id)
                        res.status(201).json({ mess: 'تم حذف الشهادة بنجاح.' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بحذف هذه الشهادة.' })
            }
        }
    }
}
