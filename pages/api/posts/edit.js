import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Post from "../../../models/Post";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'PUT'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.editPost.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {id, title, user, body, club} = req.body
                    if(id.toString().length == 0 || title.toString().length == 0 || user.toString().length == 0 || body.toString().length == 0 || club.toString().length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const post = await Post.findById(id)
                        if(post){
                            await Post.findByIdAndUpdate(id,{
                                title: title,
                                body: body,
                                club: club,
                            })
                            return res.status(201).json({ success: true, mess: "تم تحديث المنشور بنجاح" })
                        }else {
                            res.status(200).json({ mess: "هذا المنشور غير موجود." })
                        }
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.editPost.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {id, title, user, body, club} = req.body
                    if(id.toString().length == 0 || title.toString().length == 0 || user.toString().length == 0 || body.toString().length == 0 || club.toString().length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const post = await Post.findById(id)
                        if(post){
                            await Post.findByIdAndUpdate(id,{
                                title: title,
                                body: body,
                                club: session.user.club._id,
                            })
                            return res.status(201).json({ success: true, mess: "تم تحديث المنشور بنجاح" })
                        }else {
                            res.status(200).json({ mess: "هذا المنشور غير موجود." })
                        }
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else {
                res.status(200).json({ mess: "غير مسموح لك بتعديل هذا المنشور." })
            }
        }
    }
}
