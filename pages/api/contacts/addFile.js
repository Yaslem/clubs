import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Contact from "../../../models/Contact";
import Club from "../../../models/Club";
import User from "../../../models/User";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'POST'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(session.user.role === 'admin'&& session.user.permissions.addContact.status
            ){
                await connectMongoDB()
                const {contacts} = req.body
                contacts.map(async contact => {
                    const userId = await User.findOne({userId: contact.user})
                    const clubId = await Club.findOne({clubId: contact.club})
                    if(userId && clubId){
                        await Contact.create({
                            title: contact.title,
                            user: userId._id,
                            body: contact.body,
                            image: contact.image,
                            status: contact.status,
                            type: contact.type,
                            club: clubId._id,
                        })
                    }
                })
                return res.status(201).json({ success: true, mess: "تم إضافة الطلبات بنجاح" })
            }else {
                res.status(200).json({ mess: "لا يمكنك إضافة هذا الطلب." })
            }
        }
    }
}
