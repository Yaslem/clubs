import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Club from "../../../models/Club";
import Design from "../../../models/Design";
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
                && session.user.permissions.showDesign.status
            ){
                const {by, value} = req.query
                if(by === 'title'){
                    const designs = []
                    await connectMongoDB()
                    const designsNew = await Design.find({})
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
                    designsNew.map(design => {
                        if(design.activity != null){
                            designs.push(design)
                        }
                    })
                    if(designs.length === 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({designs, success: true })
                    }
                }else if(by === 'club'){
                    await connectMongoDB()
                    const club = await Club.findById(value)
                    const designs = await Design.find({ "club": value})
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'activity',
                            },
                        ]).sort({ createdAt: -1 })
                    if(designs.length === 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({designs, club, success: true })
                    }
                }else if(by === 'status'){
                    await connectMongoDB()
                    const designs = await Design.find({ "status": value})
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'activity',
                            },
                        ]).sort({ createdAt: -1 })
                    if(designs.length === 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({designs, success: true })
                    }
                }else if(by === 'type'){
                    const type = await Type.findById(value)
                    const designs = []
                    await connectMongoDB()
                    const designsNew = await Design.find({})
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
                    designsNew.map(design => {
                        if(design.activity != null){
                            designs.push(design)
                        }
                    })
                    if(designs.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({designs, type, success: true })
                    }
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showDesign.status
            ){
                const {by, value} = req.query
                if(by === 'title'){
                    const designs = []
                    await connectMongoDB()
                    const designsNew = await Design.find({club: session.user.club._id})
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
                    designsNew.map(design => {
                        if(design.activity != null){
                            designs.push(design)
                        }
                    })
                    if(designs.length === 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({designs, success: true })
                    }
                }else if(by === 'club'){
                    await connectMongoDB()
                    const club = await Club.findById(value)
                    const designs = await Design.find({club: session.user.club._id})
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'activity',
                            },
                        ]).sort({ createdAt: -1 })
                    if(designs.length === 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({designs, club, success: true })
                    }
                }else if(by === 'status'){
                    await connectMongoDB()
                    const designs = await Design.find({club: session.user.club._id, status: value})
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'activity',
                            },
                        ]).sort({ createdAt: -1 })
                    if(designs.length === 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({designs, success: true })
                    }
                }else if(by === 'type'){
                    const type = await Type.findById(value)
                    const designs = []
                    await connectMongoDB()
                    const designsNew = await Design.find({club: session.user.club._id})
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
                    designsNew.map(design => {
                        if(design.activity != null){
                            designs.push(design)
                        }
                    })
                    if(designs.length === 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({designs, type, success: true })
                    }
                }
            }else {
                res.status(200).json({mess: 'لا يمكنك عرض هذه الصفحة.', success: false })
            }
        }
    }
}
