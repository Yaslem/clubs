import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Comment from "../../../../models/Comment";
import User from "../../../../models/User";
import Club from "../../../../models/Club";
import Post from "../../../../models/Post";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.showComment.status
            ){
                await connectMongoDB()
                const options = {
                    select: "body isPublished createdAt",
                    populate: [
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
                        {
                            path: "post",
                            model: Post,
                            select: "title",
                        },
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const comments = await Comment.paginate({}, options)
                if(comments.totalDocs === 0){
                    res.status(200).json({comments, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({comments, success: true })
                }
            }else if((session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showComment.status)
            {
                await connectMongoDB()
                const options = {
                    select: "body isPublished createdAt",
                    populate: [
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
                        {
                            path: "post",
                            model: Post,
                            select: "title",
                        },
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const comments = await Comment.paginate({club: session.user.id}, options)
                if(comments.totalDocs === 0){
                    res.status(200).json({comments, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({comments, success: true })
                }

            }else {
                res.status(200).json({mess: 'غير مسموح لك بعرض هذه الصفحة.', success: false })
            }
        }
    }
}
