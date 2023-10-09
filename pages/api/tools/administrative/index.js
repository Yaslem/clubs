import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Administrative from "../../../../models/Administrative";
import AdministrativeClub from "../../../../models/AdministrativeClub";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {
            if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
                await connectMongoDB()
                const options = {
                    sort: { createdAt: -1 },
                    select: 'name studentsCount',
                    populate: {
                        path: 'studentsCount',
                        model: AdministrativeClub
                    },
                    page: req.query.page,
                    limit: 20,
                };
                const administrative = await Administrative.paginate({}, options)
                if(administrative.length == 0){
                    res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                }
                res.status(200).json({administrative, success: true })
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
