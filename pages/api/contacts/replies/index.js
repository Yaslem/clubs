import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Reply from "../../../../models/Reply";
import User from "../../../../models/User";
import Club from "../../../../models/Club";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {
            if(session.user.permissions.showComment.status){
                const {contactId} = req.query
                await connectMongoDB()
                if(!contactId || contactId.toString().length === 0){
                    res.status(200).json({replies: {}, mess: 'لا توجد بيانات' })
                }else {

                }
                const replies = await Reply.find({contact: contactId}, "body createdAt")
                    .populate([
                        {
                            path: "user",
                            model: User,
                            select: "name club avatar",
                            populate: {
                                path: "club",
                                model: Club,
                                select: "name"
                            }
                        },
                    ])
                if(replies.length === 0){
                    res.status(200).json({replies: {}, mess: 'لا توجد بيانات', success: false})
                }else {
                    res.status(200).json({replies, success: true })
                }
            }else {
                res.status(200).json({replies: {}, mess: 'لا يمكنك عرض الردود', success: false})
            }
        }
    }
}
