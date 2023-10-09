import {getServerSession} from "next-auth";
import {options} from "../../../auth/[...nextauth]";
import connectMongoDB from "../../../../../libs/mongodb";
import AdministrativeClub from "../../../../../models/AdministrativeClub";
import User from "../../../../../models/User";
import Administrative from "../../../../../models/Administrative";
import Country from "../../../../../models/Country";
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
                    || session.user.role === 'president'
                    || session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showClub.status
            ){
                const {clubId} = req.query
                if(clubId){
                    await connectMongoDB()
                    const options = {
                        select: "user administrative deputy",
                        populate: [
                            {
                                path: "user",
                                model: User,
                                select: "name username avatar role",
                                populate: {
                                    path: "country",
                                    select: "name",
                                    model: Country
                                }
                            },
                            {
                                path: "administrative",
                                select: "name",
                                model: Administrative
                            },
                            {
                                path: "deputy",
                                model: User,
                                select: "name username avatar role",
                                populate: {
                                    path: "country",
                                    select: "name",
                                    model: Country
                                }
                            }
                        ],
                        sort: { createdAt: -1 },
                        page: req.query.page,
                        limit: 20,
                    };
                    const administrativeClub = await AdministrativeClub.paginate({club: clubId}, options)
                    if(administrativeClub.totalDocs == 0){
                        res.status(200).json({administrativeClub, mess: 'لا توجد بيانات', success: false })
                    }else {
                        res.status(200).json({administrativeClub, success: true })
                    }
                }else {
                    res.status(200).json({administrativeClub: {}, mess: 'لا توجد بيانات', success: false })
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
