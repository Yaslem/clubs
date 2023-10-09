import {getServerSession} from "next-auth";
import {options} from "../../../auth/[...nextauth]";
import connectMongoDB from "../../../../../libs/mongodb";
import AdministrativeClub from "../../../../../models/AdministrativeClub";
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '100mb',
        },
    },
}
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'POST'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {

            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president'
                    || session.user.role === 'manager')
                && session.user.permissions.showClub.status
            ){
                const {student, club, administrative, deputy} = req.body
                if(student.toString().length == 0 || club.toString().length == 0 || administrative.toString().length == 0){
                    res.status(200).json({ error: 'لا توجد بيانات' })
                }else {
                    await connectMongoDB()
                    const administrativeClubCount = await AdministrativeClub.count({club, user: student})
                    if(administrativeClubCount == 0){
                        await AdministrativeClub.create({
                            club: club,
                            user: student,
                            deputy: deputy.toString().length == 0 ? null : deputy,
                            administrative: administrative
                        })
                        res.status(201).json({ mess: 'تم إضافة الإداري بنجاح' })
                    }else {
                        res.status(200).json({ mess: 'هذا الإداري موجود بالفعل.' })
                    }
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
