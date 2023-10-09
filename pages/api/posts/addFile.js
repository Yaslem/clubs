import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Post from "../../../models/Post";
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
            if(session.user.role === 'admin' && session.user.permissions.addPost.status
            ){
                await connectMongoDB()
                const {posts} = req.body
                posts.map(async post => {
                    const userId = await User.findOne({userId: post.user})
                    const clubId = await Club.findOne({clubId: post.club})
                    await Post.create({
                        postId: parseInt(post.postId),
                        title: post.title,
                        body: post.body,
                        image: post.image,
                        club: clubId._id,
                        user: userId._id,
                    })
                })
                return res.status(201).json({ success: true, mess: "تم إضافة المنشورات بنجاح" })
            }else {
                res.status(200).json({ mess: "لا يمكنك إضافة هذا المنشور." })
            }
        }
    }
}
