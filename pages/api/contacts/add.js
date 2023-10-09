import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Contact from "../../../models/Contact";
import {uploadFiles} from "../../../libs/UploadContactFiles";
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
                && session.user.permissions.addContact.status
            ){
                await connectMongoDB()
                const {inputs} = await uploadFiles(req);
                const {title, user, body, club, isEdit, image, status, type} = inputs
                if(isEdit == "false"){
                    if(title.length == 0 || user.length == 0 || status.toString().length == 0  || type.toString().length == 0 || body.length == 0 || club.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        await Contact.create({
                            title: title,
                            user: user,
                            body: body,
                            image: image,
                            status: status,
                            type: type,
                            club: club,
                        })
                        res.status(201).json({ success: true, mess: "تم إنشاء الطلب بنجاح" })
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else if(session.user.permissions.addContact.status){
                await connectMongoDB()
                const {inputs} = await uploadFiles(req);
                const {title, user, body, club, isEdit, image, status, type} = inputs
                if(isEdit === "false"){
                    if(title.length === 0 || user.length === 0 || status.toString().length === 0  || type.toString().length === 0 || body.length === 0 || club.length === 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        await Contact.create({
                            title: title,
                            user: user,
                            body: body,
                            image: image,
                            status: status,
                            type: type,
                            club: club,
                        })
                        res.status(201).json({ success: true, mess: "تم إنشاء الطلب بنجاح" })
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }
        }
    }
}
