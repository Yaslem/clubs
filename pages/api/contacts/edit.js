import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Contact from "../../../models/Contact";
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
                && session.user.permissions.editContact.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {id, title, user, body, club, status, type} = req.body
                    if(id.toString().length == 0 || title.toString().length == 0 || status.toString().length == 0  || type.toString().length == 0 || user.toString().length == 0 || body.toString().length == 0 || club.toString().length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const contacts = await Contact.findById(id)
                        if(contacts){
                            await Contact.findByIdAndUpdate(id,{
                                title: title,
                                body: body,
                                club: club,
                                status: status,
                                type: type,
                            })
                            return res.status(201).json({ success: true, mess: "تم تحديث الطلب بنجاح" })
                        }else {
                            res.status(200).json({ mess: "هذا الطلب غير موجود." })
                        }
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else if(session.user.permissions.editContact.status){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {id, title, user, body, club, status, type} = req.body
                    if(id.toString().length == 0 || title.toString().length == 0 || status.toString().length == 0  || type.toString().length == 0 || user.toString().length == 0 || body.toString().length == 0 || club.toString().length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const contacts = await Contact.findById(id)
                        if(contacts){
                            await Contact.findByIdAndUpdate(id,{
                                title: title,
                                body: body,
                                club: club,
                                status: status,
                                type: type,
                            })
                            return res.status(201).json({ success: true, mess: "تم تحديث الطلب بنجاح" })
                        }else {
                            res.status(200).json({ mess: "هذا الطلب غير موجود." })
                        }
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else {
                res.status(200).json({ mess: "غير مسموح لك بتعديل هذا الطلب." })
            }
        }
    }
}
