import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Time from "../../../../models/Time";
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
            if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
                const {isFile} = req.body
                await connectMongoDB()
                if (isFile == false){
                    const {start, end} = req.body
                    if(start.length == 0 || end.length == 0){
                        res.status(403).json({ error: 'لا توجد بيانات' })
                    }else {
                        const time = await Time.findOne({start, end})

                        if(time){
                            res.status(200).json({ mess: "الوقت موجود" })
                        }else {
                            await Time.create({start, end})
                            res.status(201).json({ mess: 'تم إضافة الوقت بنجاح' })
                        }
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}