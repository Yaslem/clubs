import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import CertificateAndActivity from "../../../models/CertificateAndActivity";
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
                    || session.user.role === 'president'
                    || session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.addCertificate.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {activity} = req.body
                    if(activity.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const activityCkeck = await CertificateAndActivity.findOne({activityId: activity})
                        if(activityCkeck){
                            res.status(200).json({ mess: "هذا الشهادة موجودة بالفعل." })
                        }else {
                            await CertificateAndActivity.create({
                                activityId: activity
                            })
                        }
                        res.status(201).json({ success: true, mess: "تم إنشاء الشهادة بنجاح" })
                    }
                }else {
                    res.status(201).json({ success: true, mess: "تم إنشاء الشهادات بنجاح" })
                }
            }else {
                res.status(200).json({ mess: "لا يمكنك إضافة هذه الجائزة." })
            }
        }
    }
}
