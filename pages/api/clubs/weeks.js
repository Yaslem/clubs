import connectMongoDB from "../../../libs/mongodb";
import Club from "../../../models/Club";
import Activity from "../../../models/Activity";
import User from "../../../models/User";
import Location from "../../../models/Location";
export default async function handler(req, res) {
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        const {club} = req.query
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        await connectMongoDB()
        const options = {
            populate: [
                {
                    path: "location",
                    model: Location,
                    select: "name"
                },
                {
                    path: "club",
                    model: Club,
                    select: "name"
                }
            ],
            select: "title presenter location club date from to",
            sort: { date: -1 },
            page: req.query.page,
            limit: 4,
        };
        const activities = await Activity.paginate({club, "date": { $gte: now, $lte: nextWeek }}, options)
        res.status(200).json({activities, success: true })
    }
}
