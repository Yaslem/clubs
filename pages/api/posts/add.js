import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Post from "../../../models/Post";
import Club from "../../../models/Club";
import User from "../../../models/User";
import {uploadFiles} from "../../../libs/UploadPostFiles";
export const config = {
    api: {
        bodyParser: false
    }
}
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
                && session.user.permissions.addPost.status
            ){
                await connectMongoDB()
                const {inputs} = await uploadFiles(req);
                const {title, user, body, isEdit, club, image} = inputs
                if(isEdit == "false"){
                    if(title.length == 0 || user.length == 0 || body.length == 0 || club.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        await Post.create({
                            title: title,
                            user: user,
                            image: image,
                            body: body,
                            club: club,
                        })
                        return res.status(201).json({ success: true, mess: "تم إنشاء المنشور بنجاح" })
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.addPost.status
            ){
                await connectMongoDB()
                const {inputs} = await uploadFiles(req);
                const {title, user, body, isEdit, club, image} = inputs
                if(isEdit == "false"){
                    if(title.length == 0 || user.length == 0 || body.length == 0 || club.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        await Post.create({
                            title: title,
                            user: session.user.id,
                            body: body,
                            image: image,
                            club: session.user.club._id,
                        })
                        return res.status(201).json({ success: true, mess: "تم إنشاء المنشور بنجاح" })
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else {
                res.status(200).json({ mess: "لا يمكنك إضافة هذا المنشور." })
            }
        }
    }
}
