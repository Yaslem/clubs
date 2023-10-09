import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import UserClub from "../../../../models/UserClub";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'POST'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            const {club} = req.body
            await connectMongoDB()
            if(club.toString().length == 0){
                res.status(200).json({mess: "لا توجد بيانات", success: false })
            }else {
                const userCheck = await UserClub.findOne({club, user: session.user.id})
                if(userCheck){
                    await UserClub.deleteOne({club, user: session.user.id})
                    res.status(201).json({mess: " تم إلغاء الاشتراك بنجاح.", success: true })
                }else {
                    res.status(200).json({mess: "النادي غير موجود", success: false })
                }
            }
        }
    }
}
