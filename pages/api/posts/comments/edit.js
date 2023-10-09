import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Reply from "../../../../models/Reply";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'PUT'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {
            const {replyId, body} = req.body
            await connectMongoDB()
            if(replyId.toString().length == 0 || body.toString().length == 0){
                res.status(200).json({ mess: 'لا توجد بيانات' })
            }else {
                const reply = await Reply.findById(replyId)
                if(reply){
                    await Reply.findByIdAndUpdate(replyId, {
                        body: body
                    })
                    res.status(201).json({ mess: 'تم تحديث الرد بنجاح' })
                }else {
                    res.status(200).json({ mess: 'لا توجد بيانات.' })
                }
            }
        }
    }
}
