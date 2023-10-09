import connectMongoDB from "../../libs/mongodb";
import Activity from "../../models/Activity";
import Club from "../../models/Club";
import Location from "../../models/Location";
export default async function handler(req, res) {
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        const now = new Date();
        const nextTomorrow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
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
        const activities = await Activity.paginate({"date": { $gte: now, $lte: nextTomorrow }}, options)
        if(activities.totalDocs != 0){
            res.status(200).json({activities, success: true })
        }else {
            res.status(200).json({mess: "لا توجد بيانات.", success: false })
        }
    }
}
