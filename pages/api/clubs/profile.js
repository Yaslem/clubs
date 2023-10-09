import connectMongoDB from "../../../libs/mongodb";
import Club from "../../../models/Club";
import Activity from "../../../models/Activity";
import User from "../../../models/User";
export default async function handler(req, res) {
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        const {name} = req.query
        await connectMongoDB()
        const club = await Club.findOne({name})
            .populate([
                {
                    path: "studentsCount",
                    model: User
                },
                {
                    path: "manager",
                    model: User,
                    select: "name"
                },
                {
                    path: "activitiesCount",
                    model: Activity
                }
            ])
        res.status(200).json({club, success: true })
    }
}
