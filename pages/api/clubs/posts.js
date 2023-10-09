import connectMongoDB from "../../../libs/mongodb";
import Club from "../../../models/Club";
import Post from "../../../models/Post";
import User from "../../../models/User";
import Location from "../../../models/Location";
export default async function handler(req, res) {
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        const {club} = req.query
        await connectMongoDB()
        const options = {
            populate: [
                {
                    path: "user",
                    model: User,
                    select: "name avatar"
                },
                {
                    path: "club",
                    model: Club,
                    select: "name"
                }
            ],
            sort: { date: -1 },
            page: req.query.page,
            limit: 4,
        };
        const posts = await Post.paginate({club}, options)

        res.status(200).json({posts, success: true })
    }
}
