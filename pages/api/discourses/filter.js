import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Club from "../../../models/Club";
import Discourse from "../../../models/Discourse";
import Type from "../../../models/Type";
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
                && session.user.permissions.showDiscourse.status
            ){
                const {by, value} = req.query
                if(by == 'title'){
                    const discourses = []
                    await connectMongoDB()
                    const discoursesNew = await Discourse.find({})
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'activity',
                                match: {title: {$regex: '.*' + value + '.*'}}
                            }
                        ]).sort({ createdAt: -1 })
                    discoursesNew.map(discourse => {
                        if(discourse.activity != null){
                            discourses.push(discourse)
                        }
                    })
                    if(discourses.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({discourses, success: true })
                    }
                }else if(by == 'club'){
                    await connectMongoDB()
                    const club = await Club.findById(value)
                    const discourses = await Discourse.find({ "club": value}, )
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'activity',
                            },
                        ]).sort({ createdAt: -1 })
                    if(discourses.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({discourses, club, success: true })
                    }
                }else if(by == 'status'){
                    await connectMongoDB()
                    const discourses = await Discourse.find({ "status": value}, )
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'activity',
                            },
                        ]).sort({ createdAt: -1 })
                    if(discourses.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({discourses, success: true })
                    }
                }else if(by == 'type'){
                    const type = await Type.findById(value)
                    const discourses = []
                    await connectMongoDB()
                    const discoursesNew = await Discourse.find({})
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'activity',
                                match: {type: value}
                            }
                        ]).sort({ createdAt: -1 })
                    discoursesNew.map(discourse => {
                        if(discourse.activity != null){
                            discourses.push(discourse)
                        }
                    })
                    if(discourses.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({discourses, type, success: true })
                    }
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showDiscourse.status
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
                                select: 'name'
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
                                select: 'name'
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
                                select: 'name'
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
                                select: 'name'
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
                                select: 'name'
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
                                select: 'name'
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
                                select: 'name'
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
                                select: 'name'
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
