import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Attend from "../../../models/Attend";
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
                && session.user.permissions.showAttend.status
            ){
                const {by, value} = req.query
                if(by == 'name'){
                    let reviews = []
                    await connectMongoDB()
                    const newReviews = await Attend.find({})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title ',
                                populate: {
                                    path: 'club',
                                    select: 'name'
                                },
                            },
                            {
                                path: 'user',
                                select: 'name ',
                                match: {"name": { $regex: '.*' + value + '.*' }}
                            }
                        ]).sort({ createdAt: -1 })
                    newReviews.map(review => {
                        if(review.user != null){
                            reviews.push(review)
                        }
                    })
                    if(reviews.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reviews, success: true })
                    }
                }else if(by == 'title'){
                    let reviews = []
                    const newReviews = await Attend.find({})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title ',
                                populate: {
                                    path: 'club',
                                    select: 'name'
                                },
                                match: {"title": { $regex: '.*' + value + '.*' }}
                            },
                            {
                                path: 'user',
                                select: 'name ',
                            }
                        ]).sort({ createdAt: -1 })
                    newReviews.map(review => {
                        if(review.activity != null){
                            reviews.push(review)
                        }
                    })
                    if(reviews.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reviews, success: true })
                    }
                }else if(by == 'club'){
                    const club = await Club.findById(value)
                    const reviews = await Attend.find({club: session.user.club._id})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title ',
                                populate: {
                                    path: 'club',
                                    select: 'name',
                                },
                            },
                            {
                                path: 'user',
                                select: 'name ',
                            }
                        ]).sort({ createdAt: -1 })

                    if(reviews.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reviews, club, success: true })
                    }
                }else if(by == 'type'){
                    let reviews = []
                    const type = await Type.findById(value)
                    const newReviews = await Attend.find({})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title ',
                                populate: {
                                    path: 'club',
                                    select: 'name',
                                },
                                match: {"type": value}
                            },
                            {
                                path: 'user',
                                select: 'name ',
                            }
                        ]).sort({ createdAt: -1 })
                    newReviews.map(review => {
                        if(review.activity != null){
                            reviews.push(review)
                        }
                    })
                    if(reviews.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reviews, type, success: true })
                    }
                }else if(by == 'location'){
                    let reviews = []
                    const location = await Location.findById(value)
                    const newReviews = await Attend.find({})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title ',
                                populate: {
                                    path: 'club',
                                    select: 'name',
                                },
                                match: {"location": value}
                            },
                            {
                                path: 'user',
                                select: 'name ',
                            }
                        ]).sort({ createdAt: -1 })
                    newReviews.map(review => {
                        if(review.activity != null){
                            reviews.push(review)
                        }
                    })
                    if(reviews.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reviews, location, success: true })
                    }
                }
            }else if(
                (session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showAttend.status
            ){
                const {by, value} = req.query
                if(by == 'name'){
                    const reviews = []
                    await connectMongoDB()
                    const newReviews = await Attend.find({club: session.user.club._id})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title ',
                                populate: {
                                    path: 'club',
                                    select: 'name',
                                },
                            },
                            {
                                path: 'user',
                                select: 'name ',
                                match: {"name": { $regex: '.*' + value + '.*' }}
                            }
                        ]).sort({ createdAt: -1 })
                    newReviews.map(review => {
                        if(review.user != null){
                            reviews.push(review)
                        }
                    })
                    if(reviews.length === 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reviews, success: true })
                    }
                }else if(by === 'title'){
                    const reviews = []
                    const newReviews = await Attend.find({club: session.user.club._id})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title ',
                                populate: {
                                    path: 'club',
                                    select: 'name',
                                },
                                match: {"title": { $regex: '.*' + value + '.*' }}
                            },
                            {
                                path: 'user',
                                select: 'name ',
                            }
                        ]).sort({ createdAt: -1 })
                    newReviews.map(review => {
                        if(review.activity != null){
                            reviews.push(review)
                        }
                    })
                    if(reviews.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reviews, success: true })
                    }
                }else if(by == 'club'){
                    const club = await Club.findById(value)
                    const reviews = await Attend.find({club: session.user.club._id})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title ',
                                populate: {
                                    path: 'club',
                                    select: 'name',
                                },
                            },
                            {
                                path: 'user',
                                select: 'name ',
                            }
                        ]).sort({ createdAt: -1 })
                    if(reviews.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reviews, club, success: true })
                    }
                }else if(by == 'type'){
                    const reviews = []
                    const type = await Type.findById(value)
                    const newReviews = await Attend.find({club: session.user.club._id})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title ',
                                populate: {
                                    path: 'club',
                                    select: 'name',
                                },
                                match: {"type": value}
                            },
                            {
                                path: 'user',
                                select: 'name ',
                            }
                        ]).sort({ createdAt: -1 })
                    newReviews.map(review => {
                        if(review.activity != null){
                            reviews.push(review)
                        }
                    })
                    if(reviews.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reviews, type, success: true })
                    }
                }else if(by == 'location'){
                    const reviews = []
                    const location = await Location.findById(value)
                    const newReviews = await Attend.find({club: session.user.club._id})
                        .populate([
                            {
                                path: 'activity',
                                select: 'title ',
                                populate: {
                                    path: 'club',
                                    select: 'name',
                                },
                                match: {"location": value}
                            },
                            {
                                path: 'user',
                                select: 'name ',
                            }
                        ]).sort({ createdAt: -1 })
                    newReviews.map(review => {
                        if(review.activity != null){
                            reviews.push(review)
                        }
                    })
                    if(reviews.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({reviews, location, success: true })
                    }
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
