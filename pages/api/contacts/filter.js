import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Club from "../../../models/Club";
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
                const {by, value} = req.query
                if(by == 'title'){
                    await connectMongoDB()
                    const contacts = await Contact.find({ "title": { $regex: '.*' + value + '.*' } })
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar'
                            }
                        ]).sort({ createdAt: -1 })
                    if(contacts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({contacts, success: true })
                    }
                }else if(by == 'club'){
                    await connectMongoDB()
                    const club = await Club.findById(value)
                    const contacts = await Contact.find({ "club": value}, )
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar'
                            },
                        ]).sort({ createdAt: -1 })
                    if(contacts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({contacts, club, success: true })
                    }
                }else if(by == 'status'){
                    await connectMongoDB()
                    const contacts = await Contact.find({ "status": value}, )
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar'
                            },
                        ]).sort({ createdAt: -1 })
                    if(contacts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({contacts, success: true })
                    }
                }else if(by == 'type'){
                    await connectMongoDB()
                    const contacts = await Contact.find({ "type": value}, )
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar'
                            },
                        ]).sort({ createdAt: -1 })
                    if(contacts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({contacts, success: true })
                    }
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showContact.status
            ){
                const {by, value} = req.query
                if(by == 'title'){
                    await connectMongoDB()
                    const contacts = await Contact.find({club: session.user.club._id, "title": { $regex: '.*' + value + '.*' } })
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar'
                            }
                        ]).sort({ createdAt: -1 })
                    if(contacts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({contacts, success: true })
                    }
                }else if(by == 'club'){
                    await connectMongoDB()
                    const club = await Club.findById(value)
                    const contacts = await Contact.find({ "club": session.user.club._id}, )
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar'
                            },
                        ]).sort({ createdAt: -1 })
                    if(contacts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({contacts, club, success: true })
                    }
                }else if(by == 'status'){
                    await connectMongoDB()
                    const contacts = await Contact.find({club: session.user.club._id, "status": value}, )
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar'
                            },
                        ]).sort({ createdAt: -1 })
                    if(contacts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({contacts, success: true })
                    }
                }else if(by == 'type'){
                    await connectMongoDB()
                    const contacts = await Contact.find({club: session.user.club._id, "type": value}, )
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar'
                            },
                        ]).sort({ createdAt: -1 })
                    if(contacts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({contacts, success: true })
                    }
                }
            }else {
                const {by, value} = req.query
                if(by == 'title'){
                    await connectMongoDB()
                    const contacts = await Contact.find({user: session.user.id, "title": { $regex: '.*' + value + '.*' } })
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar'
                            }
                        ]).sort({ createdAt: -1 })
                    if(contacts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({contacts, success: true })
                    }
                }else if(by == 'club'){
                    await connectMongoDB()
                    const club = await Club.findById(value)
                    const contacts = await Contact.find({ "club": value, user: session.user.id}, )
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar'
                            },
                        ]).sort({ createdAt: -1 })
                    if(contacts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({contacts, club, success: true })
                    }
                }else if(by == 'status'){
                    await connectMongoDB()
                    const contacts = await Contact.find({user: session.user.id, "status": value}, )
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar'
                            },
                        ]).sort({ createdAt: -1 })
                    if(contacts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({contacts, success: true })
                    }
                }else if(by == 'type'){
                    await connectMongoDB()
                    const contacts = await Contact.find({user: session.user.id, "type": value}, )
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar'
                            },
                        ]).sort({ createdAt: -1 })
                    if(contacts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({contacts, success: true })
                    }
                }
            }
        }
    }
}
