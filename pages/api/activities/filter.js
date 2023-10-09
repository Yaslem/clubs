import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Type from "../../../models/Type";
import Location from "../../../models/Location";
import Club from "../../../models/Club";
import Activity from "../../../models/Activity";
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
                && session.user.permissions.showActivity.status
            ){
                const {by, value} = req.query
                const {start, end} = req.query
                if(by == 'title'){
                    await connectMongoDB()
                    const activities = await Activity.find({ "title": { $regex: '.*' + value + '.*' } })
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, success: true })
                    }
                }else if(by == 'club'){
                    await connectMongoDB()
                    const club = await Club.findById(value)
                    const activities = await Activity.find({ "club": value}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, club, success: true })
                    }
                }else if(by == 'location'){
                    await connectMongoDB()
                    const location = await Location.findById(value)
                    const activities = await Activity.find({ "location": value}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, location, success: true })
                    }
                }else if(by == 'type'){
                    await connectMongoDB()
                    const type = await Type.findById(value)
                    const activities = await Activity.find({ "type": value}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, type, success: true })
                    }
                }else if(by == 'status'){
                    await connectMongoDB()
                    const activities = await Activity.find({ "status": value}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, success: true })
                    }
                }else if(by == 'isShare'){
                    await connectMongoDB()
                    const activities = await Activity.find({ "isShare": value}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, success: true })
                    }
                }else if(by == 'date'){
                    await connectMongoDB()
                    const activities = await Activity.find({ "date": value}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        console.log(activities)
                        res.status(200).json({activities, success: true })
                    }
                }else if(by == 'between'){
                    const newStartDate = new Date(start);
                    const newEndDate = new Date(end);
                    await connectMongoDB()
                    const activities = await Activity.find({ "date": { $gte: newStartDate, $lte: newEndDate }}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, success: true })
                    }
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showActivity.status
            ){
                const {by, value} = req.query
                const {start, end} = req.query
                if(by == 'title'){
                    await connectMongoDB()
                    const activities = await Activity.find({club: session.user.club._id, "title": { $regex: '.*' + value + '.*' } })
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, success: true })
                    }
                }else if(by == 'club'){
                    await connectMongoDB()
                    const club = await Club.findById(session.user.club._id)
                    const activities = await Activity.find({"club": session.user.club._id}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, club, success: true })
                    }
                }else if(by == 'location'){
                    await connectMongoDB()
                    const location = await Location.findById(value)
                    const activities = await Activity.find({club: session.user.club._id, "location": value}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, location, success: true })
                    }
                }else if(by == 'type'){
                    await connectMongoDB()
                    const type = await Type.findById(value)
                    const activities = await Activity.find({club: session.user.club._id, "type": value}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, type, success: true })
                    }
                }else if(by == 'status'){
                    await connectMongoDB()
                    const activities = await Activity.find({club: session.user.club._id, "status": value}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, success: true })
                    }
                }else if(by == 'isShare'){
                    await connectMongoDB()
                    const activities = await Activity.find({club: session.user.club._id, "isShare": value}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, success: true })
                    }
                }else if(by == 'date'){
                    await connectMongoDB()
                    const activities = await Activity.find({club: session.user.club._id, "date": value}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        console.log(activities)
                        res.status(200).json({activities, success: true })
                    }
                }else if(by == 'between'){
                    const newStartDate = new Date(start);
                    const newEndDate = new Date(end);
                    await connectMongoDB()
                    const activities = await Activity.find({club: session.user.club._id, "date": { $gte: newStartDate, $lte: newEndDate }}, )
                        .populate([
                            {
                                path: 'club',
                                model: Club,
                                select: 'name'
                            },
                            {
                                path: 'location',
                                model: Location,
                                select: 'name'
                            },
                            {
                                path: 'type',
                                model: Type,
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(activities.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({activities, success: true })
                    }
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
