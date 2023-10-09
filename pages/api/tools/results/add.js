import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Result from "../../../../models/Result";
import Club from "../../../../models/Club";
import Year from "../../../../models/Year";
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
                await connectMongoDB()
                const {isFile} = req.body
                if (isFile === false){
                    const {number, name, result, year, club} = req.body
                    if((number === undefined || number.toString().length === 0) || (name === undefined || name.toString().length === 0) || (result === undefined || result.toString().length === 0) || (year === undefined || year.toString().length === 0) || (club === undefined || club.toString().length === 0)){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const resultCkeck = await Result.findOne({number, name, result, year, club})
                        if(resultCkeck){
                            res.status(200).json({ mess: "النتيجة موجودة" })
                        }else {
                            await Result.create({number, name, result, year, club})
                            res.status(201).json({ mess: 'تمت إضافة النتيجة بنجاح' })
                        }
                    }
                }else {
                    if (session.user.role === 'admin'){
                        const {results} = req.body
                        if(!results){
                            res.status(200).json({ error: 'لا توجد بيانات' })
                        }else {
                            results.map(async result => {
                                const clubId = await Club.findOne({clubId: result.club})
                                const yearId = await Year.findOne({_id: result.year})
                                await Result.create(
                                    {
                                        number: result.number,
                                        name: result.name,
                                        result: result.result,
                                        year: yearId._id,
                                        club: clubId._id
                                    })
                            })
                            res.status(201).json({ mess: 'تمت إضافة النتائج بنجاح' })
                        }
                    }else {
                        res.status(200).json({ mess: 'لا يمكنك إضافة النتائج.' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
