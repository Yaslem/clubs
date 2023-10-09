import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Result from "../../../../models/Result";
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
                const {id, number, name, result, year, club} = req.body
                if((id === undefined || id.toString().length === 0) || (number === undefined || number.toString().length === 0) || (name === undefined || name.toString().length === 0) || (result === undefined || result.toString().length === 0) || (year === undefined || year.toString().length === 0) || (club === undefined || club.toString().length === 0)){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    const resultCkeck = await Result.findById(id)
                    if(!resultCkeck){
                        res.status(200).json({ mess: "النتيجة غير موجودة" })
                    }else {
                        await Result.updateOne({_id: id},
                            {
                                number,
                                name,
                                result,
                                year,
                                club,
                            })
                        res.status(201).json({ mess: 'تمت تحديث النتيجة بنجاح' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
