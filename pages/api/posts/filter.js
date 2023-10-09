import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import User from "../../../models/User";
import Club from "../../../models/Club";
import Post from "../../../models/Post";
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
                && session.user.permissions.showPost.status
            ){
                const {by, value} = req.query
                if(by == 'title'){
                    await connectMongoDB()
                    const posts = await Post.find({ "title": { $regex: '.*' + value + '.*' } })
                        .populate([
                            {
                                path: 'club',
                                select: 'name avatar'
                            },
                            {
                                path: 'user',
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(posts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({posts, success: true })
                    }
                }else if(by == 'club'){
                    await connectMongoDB()
                    const club = await Club.findById(value)
                    const posts = await Post.find({ "club": value}, )
                        .populate([
                            {
                                path: 'club',
                                select: 'name avatar'
                            },
                            {
                                path: 'user',
                                select: 'name'
                            },
                        ]).sort({ createdAt: -1 })
                    if(posts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({posts, club, success: true })
                    }
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showPost.status
            ){
                const {by, value} = req.query
                if(by == 'title'){
                    await connectMongoDB()
                    const posts = await Post.find({club: session.user.club._id, "title": { $regex: '.*' + value + '.*' }})
                        .populate([
                            {
                                path: 'club',
                                select: 'name avatar'
                            },
                            {
                                path: 'user',
                                select: 'name'
                            }
                        ]).sort({ createdAt: -1 })
                    if(posts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({posts, success: true })
                    }
                }else if(by == 'club'){
                    await connectMongoDB()
                    const club = await Club.findById(value)
                    const posts = await Post.find({club: session.user.club._id})
                        .populate([
                            {
                                path: 'club',
                                select: 'name avatar'
                            },
                            {
                                path: 'user',
                                select: 'name'
                            },
                        ]).sort({ createdAt: -1 })
                    if(posts.length == 0){
                        res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({posts, club, success: true })
                    }
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
