import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Contact from "../../../models/Contact";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.showContact.status
            ){
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'user',
                            select: 'name avatar'
                        },
                        {
                            path: 'club',
                            select: 'name'
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const contacts = await Contact.paginate({}, options)
                if(contacts.totalDocs == 0){
                    res.status(200).json({contacts, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({contacts, success: true })
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'officials'
                    || session.user.role === 'deputy')
                && session.user.permissions.showContact.status
            ){
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'user',
                            select: 'name avatar'
                        },
                        {
                            path: 'club',
                            select: 'name'
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const contacts = await Contact.paginate({club: session.user.club._id}, options)
                if(contacts.totalDocs == 0){
                    res.status(200).json({contacts, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({contacts, success: true })
                }
            }else {
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'user',
                            select: 'name avatar'
                        },
                        {
                            path: 'club',
                            select: 'name'
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const contacts = await Contact.paginate({user: session.user.id}, options)
                if(contacts.totalDocs == 0){
                    res.status(200).json({contacts, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({contacts, success: true })
                }
            }
        }
    }
}
