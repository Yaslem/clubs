import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Attend from "../../../models/Attend";
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
                    || session.user.role === 'president')
                && session.user.permissions.editAttend.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {id, benefit, lecturer, attended, suggestions, utility} = req.body
                    if(id.length == 0 || benefit.length == 0 || lecturer.length == 0 || attended.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const attend = await Attend.findById(id)
                        if(attend){
                            await Attend.findByIdAndUpdate(id,{benefit, lecturer, attended, suggestions, utility})
                            res.status(201).json({ success: true, mess: "تم تحديث التقييم بنجاح" })
                        }else {
                            res.status(200).json({ mess: "التقييم غير موجود." })
                        }
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else if (session.user.permissions.editAttend.status){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {id, benefit, lecturer, attended, suggestions, utility} = req.body
                    if(id.length == 0 || benefit.length == 0 || lecturer.length == 0 || attended.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const attend = await Attend.findById(id)
                        if(attend){
                            await Attend.findByIdAndUpdate(id,{benefit, lecturer, attended, suggestions, utility})
                            res.status(201).json({ success: true, mess: "تم تحديث التقييم بنجاح" })
                        }else {
                            res.status(200).json({ mess: "التقييم غير موجود." })
                        }
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else {
                res.status(200).json({ mess: "لا يمكنك التعديل على التقييم." })
            }
        }
    }
}
