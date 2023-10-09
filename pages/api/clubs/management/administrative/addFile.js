import {getServerSession} from "next-auth";
import {options} from "../../../auth/[...nextauth]";
import connectMongoDB from "../../../../../libs/mongodb";
import AdministrativeClub from "../../../../../models/AdministrativeClub";
import User from "../../../../../models/User";
import Club from "../../../../../models/Club";
import Administrative from "../../../../../models/Administrative";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'POST'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {

            if(session.user.role === 'admin' && session.user.permissions.showClub.status
            ){
                const {administrativeClubs} = req.body
                if(administrativeClubs.length === 0){
                    res.status(200).json({ error: 'لا توجد بيانات' })
                }else {
                    await connectMongoDB()
                    administrativeClubs.map(async administrativeClub => {
                        const club = await Club.findOne({clubId: administrativeClub.club})
                        const user = await User.findOne({userId: administrativeClub.user})
                        const administrative = await Administrative.findOne({administrativeId: administrativeClub.administrative})
                        if(club && user && administrative){
                            await AdministrativeClub.create({
                                club: club._id,
                                user: user._id,
                                administrative: administrative._id
                            })
                        }
                    })
                    res.status(201).json({ mess: 'تمت إضافة الإداريين بنجاح' })
                }
            }else {
                res.status(200).json({mess: 'عفوا، غير مسموح لك بفعل هذا الإجراء.'})
            }
        }
    }
}
