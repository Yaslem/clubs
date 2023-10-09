import connectMongoDB from "../../../libs/mongodb";
import Country from "../../../models/Country";
import Level from "../../../models/Level";
import College from "../../../models/College";
import Club from "../../../models/Club";
export default async function handler(req, res) {
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        await connectMongoDB()
        const countries = await Country.find({}, 'name')
        const levels = await Level.find({}, 'name')
        const colleges = await College.find({}, 'name')
        const clubs = await Club.find({}, 'name')
        res.status(200).json({countries, levels, colleges, clubs, success: true })
    }
}
