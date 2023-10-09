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
                const {contactId, status} = req.body
                if(contactId){
                    const contact = await Contact.findById(contactId)
                    if(contact){
                        await Contact.findByIdAndUpdate(contactId,{
                            status: status,
                        })
                        return res.status(201).json({ success: true, mess: "تم تحديث الطلب بنجاح" })
                    }else {
                        res.status(200).json({ mess: "هذا الطلب غير موجود." })
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
