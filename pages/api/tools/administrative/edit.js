import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Administrative from "../../../../models/Administrative";
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
                const {id, name} = req.body
                await connectMongoDB()
                if(!(id, name)){
                    res.status(204).json({ error: 'لا توجد بيانات' })
                }else {
                    const administrative = await Administrative.findById(id)
                    if(!administrative){
                        res.status(200).json({ mess: "الوظيفة غير موجود" })
                    }else {
                        await Administrative.updateOne({_id: id}, {name})
                        res.status(201).json({ mess: 'تمت تحديث الوظيفة بنجاح' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
