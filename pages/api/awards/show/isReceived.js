import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import AwardAndUser from "../../../../models/AwardAndUser";
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
                    || session.user.role === 'president')
                && session.user.permissions.showAward.status
            ){
                const {awardId, statusAward} = req.body
                if(awardId.toString().length == 0 || statusAward.toString().length == 0){
                    return  res.status(200).json({mess: "لا توجد بيانات", success: false })
                }else {
                    await connectMongoDB()
                    if(statusAward === true){
                        await AwardAndUser.findByIdAndUpdate(awardId, {status: "استلم"})
                        res.status(201).json({mess: `تم تغيير حالة الجائزة بنجاح.`, success: true })
                    }else {
                        await connectMongoDB()
                        await AwardAndUser.findByIdAndUpdate(awardId, {status: "لم يستلم"})
                        res.status(201).json({mess: `تم تغيير حالة الجائزة بنجاح.`, success: true })
                    }
                }
            }else {
                res.status(200).json({mess: "غير مسموج لك بتعديل حالة استلام الجائزة.", success: false })
            }
        }
    }
}
