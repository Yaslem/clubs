import connectMongoDB from "../../../libs/mongodb";
import AdministrativeClub from "../../../models/AdministrativeClub";
import User from "../../../models/User";
import Club from "../../../models/Club";
import Administrative from "../../../models/Administrative";
export default async function handler(req, res) {
    const {method} = req
    if(method !== 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        const {club: clubId} = req.query
        await connectMongoDB()
        const club = await Club.findById(clubId).select('manager').populate({
            path: "manager",
            model: User,
            select: "name avatar"
        })
        const administrative = await AdministrativeClub.find({club: clubId}, "user administrative deputy")
            .populate([
                {
                    path: "user",
                    model: User,
                    select: "name avatar"
                },
                {
                    path: "deputy",
                    model: User,
                    select: "name avatar"
                },
                {
                    path: "administrative",
                    model: Administrative,
                    select: "name"
                },
            ])

        res.status(200).json({administrative, club, success: true })
    }
}
