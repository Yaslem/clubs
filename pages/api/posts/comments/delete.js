import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Comment from "../../../../models/Comment";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'DELETE'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {

            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.deleteComment.status
            ){
                await connectMongoDB()
                const {id} = req.query
                if(id.length == 0){
                    res.status(204).json({ error: 'لا توجد بيانات' })
                }else {
                    const comment = await Comment.findById(id)
                    if(!comment){
                        res.status(200).json({ mess: "التعليق غير موجود" })
                    }else {
                        await Comment.findByIdAndDelete(id)
                        res.status(201).json({ mess: 'تم حذف التعليق بنجاح' })
                    }
                }
            }else {
                res.status(200).json({ error: 'غير مسموح لك بحذف هذا التعليق.' })
            }
        }
    }
}
