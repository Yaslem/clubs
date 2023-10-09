import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Report from "../../../models/Report";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'PUT'){
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
                && session.user.permissions.editReport.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {id, summary, notes, numbers} = req.body
                    if(id.toString().length === 0 || summary.toString().length === 0 || numbers.toString().length === 0 || notes.toString().length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const report = await Report.findById(id)
                        if(report){
                            await Report.findByIdAndUpdate(id,{
                                summary: summary,
                                notes: notes,
                                numbers: numbers,
                            })
                            return res.status(201).json({ success: true, mess: "تم تحديث التقرير بنجاح" })
                        }else {
                            res.status(200).json({ mess: "هذا التقرير غير موجود." })
                        }
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else{
                res.status(200).json({ mess: "غير مسموح لك بتعديل هذا المنشور." })
            }
        }
    }
}
