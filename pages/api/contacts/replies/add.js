import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Reply from "../../../../models/Reply";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method !== 'POST'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {
            if(session.user.permissions.addComment.status){
                const {contactId, user, body} = req.body
                await connectMongoDB()
                if(contactId.toString().length === 0 || user.toString().length === 0 || body.toString().length === 0){
                    res.status(200).json({ mess: 'لا توجد بيانات' })
                }else {
                    await Reply.create({contact: contactId, user, body})
                    res.status(201).json({ mess: 'تم إضافة الرد بنجاح' })
                }
            }else {
                res.status(200).json({ mess: 'لا يمكنك إضافة تعليق.' })
            }
        }
    }
}
