import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import College from "../../../models/College";
import Level from "../../../models/Level";
import Country from "../../../models/Country";
import User from "../../../models/User";
import Club from "../../../models/Club";
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
                && session.user.permissions.showStudent.status
            ){
                const {by, value} = req.query
                if(by == 'name'){
                    await connectMongoDB()
                    const students = await User.find({name: { $regex: '.*' + value + '.*' } })
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            },
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, success: true })
                    }
                }else if(by == 'username'){
                    await connectMongoDB()
                    const students = await User.find({username: value})
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            },
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, success: true })
                    }
                }else if(by == 'clubUser'){
                    await connectMongoDB()
                    const club = await Club.findById(value)
                    const students = await User.find({ "club": value}, )
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, club, success: true })
                    }
                }else if(by == 'country'){
                    await connectMongoDB()
                    const country = await Country.findById(value)
                    const students = await User.find({ "country": value}, )
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, country, success: true })
                    }
                }else if(by == 'level'){
                    await connectMongoDB()
                    const level = await Level.findById(value)
                    const students = await User.find({ "level": value})
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, level, success: true })
                    }
                }else if(by == 'college'){
                    await connectMongoDB()
                    const college = await College.findById(value)
                    const students = await User.find({ "college": value})
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, college, success: true })
                    }
                }else if(by == 'role'){
                    await connectMongoDB()
                    const students = await User.find({ "role": value})
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, success: true })
                    }
                }
            }else if(
                (session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showStudent.status
            ){
                const {by, value} = req.query
                if(by == 'name'){
                    await connectMongoDB()
                    const students = await User.find({club: session.user.club._id, "name": { $regex: '.*' + value + '.*' } })
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            },
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, success: true })
                    }
                }else if(by == 'username'){
                    await connectMongoDB()
                    const students = await User.find({club: session.user.club._id, username: value})
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            },
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, success: true })
                    }
                }else if(by == 'clubUser'){
                    await connectMongoDB()
                    const club = await Club.findById(session.user.club._id)
                    const students = await User.find({ "club": session.user.club._id})
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, club, success: true })
                    }
                }else if(by == 'country'){
                    await connectMongoDB()
                    const country = await Country.findById(value)
                    const students = await User.find({club: session.user.club._id, "country": value})
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, country, success: true })
                    }
                }else if(by == 'level'){
                    await connectMongoDB()
                    const level = await Level.findById(value)
                    const students = await User.find({club: session.user.club._id, "level": value})
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, level, success: true })
                    }
                }else if(by == 'college'){
                    await connectMongoDB()
                    const college = await College.findById(value)
                    const students = await User.find({club: session.user.club._id, "college": value})
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, college, success: true })
                    }
                }else if(by == 'role'){
                    await connectMongoDB()
                    const students = await User.find({club: session.user.club._id, "role": value})
                        .select('name whatsapp username role idNumber permissions password type avatar email club level college country')
                        .populate([
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'level',
                                select: 'name'
                            },
                            {
                                path: 'country',
                                select: 'name'
                            },
                            {
                                path: 'college',
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(students.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({students, success: true })
                    }
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
