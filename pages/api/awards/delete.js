import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import AwardAndActivity from "../../../models/AwardAndActivity";
import AwardAndUser from "../../../models/AwardAndUser";
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
                && session.user.permissions.deleteAward.status
            ){
                await connectMongoDB()
                const {id} = req.query
                if(id.toString().length == 0){
                    res.status(200).json({ error: 'لا توجد بيانات' })
                }else {
                    const award = await AwardAndActivity.findById(id)
                    if(!award){
                        res.status(200).json({ mess: "هذه الجائزة غير موجودة." })
                    }else {
                        await AwardAndUser.deleteMany({awardAndActivityId: award._id})
                        await AwardAndActivity.findByIdAndDelete(id)
                        res.status(201).json({ mess: 'تم حذف االجائزة بنجاح.' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بحذف هذه الجائزة.' })
            }
        }
    }
}
