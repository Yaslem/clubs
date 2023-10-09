import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Comment from "../../../../models/Comment";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'POST'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {
            const {postId, user, body} = req.body
            if(session.user.permissions.addComment.status){
                await connectMongoDB()
                if(postId.toString().length == 0 || user.toString().length == 0 || body.toString().length == 0){
                    res.status(200).json({ mess: 'لا توجد بيانات' })
                }else {
                    await Comment.create({post: postId, user, body})
                    res.status(201).json({ mess: 'تم إضافة التعليق بنجاح' })
                }
            }else {
                res.status(200).json({ mess: "لا يمكنك إضافة هذا التعليق." })
            }
        }
    }
}
