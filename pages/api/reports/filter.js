import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Report from "../../../models/Report";
import Club from "../../../models/Club";
import Type from "../../../models/Type";
import Location from "../../../models/Location";
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
                && session.user.permissions.showReport.status
            ){
                const {by, value} = req.query
                if(by == 'title'){
                    let reports = []
                    const newReports = await Report.find({})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title location type status',
                                populate: [
                                    {
                                        path: "location",
                                        select: "name"
                                    },
                                    {
                                        path: "type",
                                        select: "name"
                                    }
                                ],
                                match: {"title": { $regex: '.*' + value + '.*' }}
                            },
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar',
                            }
                        ]).sort({ createdAt: -1 })
                    newReports.map(report => {
                        if(report.activity != null){
                            reports.push(report)
                        }
                    })
                    if(reports.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reports, success: true })
                    }
                }else if(by == 'club'){
                    let reports = []
                    const club = await Club.findById(value)
                    const newReport = await Report.find({club: value})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title location type status',
                                populate: [
                                    {
                                        path: "location",
                                        select: "name"
                                    },
                                    {
                                        path: "type",
                                        select: "name"
                                    },
                                ]
                            },
                            {
                                path: 'club',
                                select: 'name',
                            },
                            {
                                path: 'user',
                                select: 'name avatar',
                            }
                        ]).sort({ createdAt: -1 })
                    newReport.map(report => {
                        if(report.club != null){
                            reports.push(report)
                        }
                    })
                    if(reports.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reports, club, success: true })
                    }
                }else if(by == 'type'){
                    let reports = []
                    const type = await Type.findById(value)
                    const newReport = await Report.find({})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title location type status',
                                populate: [
                                    {
                                        path: "location",
                                        select: "name"
                                    },
                                    {
                                        path: "type",
                                        select: "name"
                                    }
                                ],
                                match: {"type": value}
                            },
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar',
                            }
                        ]).sort({ createdAt: -1 })
                    newReport.map(report => {
                        if(report.activity != null){
                            reports.push(report)
                        }
                    })
                    if(reports.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reports, type, success: true })
                    }
                }else if(by == 'location'){
                    let reports = []
                    const location = await Location.findById(value)
                    const newReport = await Report.find({})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title location type status',
                                populate: [
                                    {
                                        path: "location",
                                        select: "name"
                                    },
                                    {
                                        path: "type",
                                        select: "name"
                                    }
                                ],
                                match: {"location": value}
                            },
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar',
                            }
                        ]).sort({ createdAt: -1 })
                    newReport.map(report => {
                        if(report.activity != null){
                            reports.push(report)
                        }
                    })
                    if(reports.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reports, location, success: true })
                    }
                }
            }else if(
                (session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showReport.status
            ){
                const {by, value} = req.query
                if(by == 'title'){
                    let reports = []
                    const newReports = await Report.find({})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title location type status',
                                populate: [
                                    {
                                        path: "location",
                                        select: "name"
                                    },
                                    {
                                        path: "type",
                                        select: "name"
                                    },
                                    {
                                        path: 'club',
                                        select: 'name',
                                        match: {"_id": session.user.club._id}
                                    },
                                ],
                                match: {"title": { $regex: '.*' + value + '.*' }}
                            },
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar',
                            }
                        ]).sort({ createdAt: -1 })
                    newReports.map(report => {
                        if(report.activity != null){
                            reports.push(report)
                        }
                    })
                    if(reports.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reports, success: true })
                    }
                }else if(by == 'club'){
                    let reports = []
                    const club = await Club.findById(value)
                    const newReport = await Report.find({club: session.user.club._id})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title location type status',
                                populate: [
                                    {
                                        path: "location",
                                        select: "name"
                                    },
                                    {
                                        path: "type",
                                        select: "name"
                                    },
                                ],
                            },
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar',
                            }
                        ]).sort({ createdAt: -1 })
                    newReport.map(report => {
                        if(report.activity != null){
                            reports.push(report)
                        }
                    })
                    if(reports.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reports, club, success: true })
                    }
                }else if(by == 'type'){
                    let reports = []
                    const type = await Type.findById(value)
                    const newReport = await Report.find({})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title location type status',
                                populate: [
                                    {
                                        path: "location",
                                        select: "name"
                                    },
                                    {
                                        path: "type",
                                        select: "name"
                                    },
                                    {
                                        path: 'club',
                                        select: 'name',
                                        match: {"_id": session.user.club._id}
                                    },
                                ],
                                match: {"type": value}
                            },
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar',
                            }
                        ]).sort({ createdAt: -1 })
                    newReport.map(report => {
                        if(report.activity != null){
                            reports.push(report)
                        }
                    })
                    if(reports.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reports, type, success: true })
                    }
                }else if(by == 'location'){
                    let reports = []
                    const location = await Location.findById(value)
                    const newReport = await Report.find({})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title location type status',
                                populate: [
                                    {
                                        path: "location",
                                        select: "name"
                                    },
                                    {
                                        path: "type",
                                        select: "name"
                                    },
                                    {
                                        path: 'club',
                                        select: 'name',
                                        match: {"_id": session.user.club._id}
                                    },
                                ],
                                match: {"location": value}
                            },
                            {
                                path: 'club',
                                select: 'name'
                            },
                            {
                                path: 'user',
                                select: 'name avatar',
                            }
                        ]).sort({ createdAt: -1 })
                    newReport.map(report => {
                        if(report.activity != null){
                            reports.push(report)
                        }
                    })
                    if(reports.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reports, location, success: true })
                    }
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
