import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Country from "../../../../models/Country";
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
    if(method != 'PUT'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {
            if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
                await connectMongoDB()
                const {id, name, code} = req.body
                if(!(id, name && code)){
                    res.status(204).json({ error: 'لا توجد بيانات' })
                }else {
                    const country = await Country.findById(id)
                    if(!country){
                        res.status(200).json({ mess: "الدولة غير موجودة" })
                    }else {
                        await Country.updateOne({_id: id}, {name, code})
                        res.status(201).json({ mess: 'تمت تحديث الدولة بنجاح' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
