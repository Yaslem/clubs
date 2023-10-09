import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Comment from "../../../../models/Comment";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'PUT'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {
            const {commentId, status} = req.body
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president'
                    || session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showComment.status
            ){
                await connectMongoDB()
                if(status.toString().length === 0 || commentId.toString().length === 0){
                    res.status(200).json({ mess: 'لا توجد بيانات' })
                }else {
                    const comment = await Comment.findById(commentId)
                    if(comment){
                        await Comment.findByIdAndUpdate(commentId, {
                            isPublished: status
                        })
                        res.status(201).json({ mess: 'تم تحديث حالة التعيق بنجاح' })
                    }else {
                        res.status(200).json({ mess: 'لا توجد بيانات.' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'لا يمكنك التعديل على التعليق.' })
            }
        }
    }
}
