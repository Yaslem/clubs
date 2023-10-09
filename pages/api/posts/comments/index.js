import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Comment from "../../../../models/Comment";
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
            const {postId} = req.query
            await connectMongoDB()
            if(!postId || postId.toString().length == 0){
                res.status(200).json({comments: {}, mess: 'لا توجد بيانات' })
            }else {

            }
            const comments = await Comment.find({isPublished: true,post: postId}, "body createdAt")
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
            if(comments.length == 0){
                res.status(200).json({comments: {}, mess: 'لا توجد بيانات', success: false })
            }else {
                res.status(200).json({comments, success: true })
            }
        }
    }
}
