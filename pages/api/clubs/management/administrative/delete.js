import {getServerSession} from "next-auth";
import {options} from "../../../auth/[...nextauth]";
import connectMongoDB from "../../../../../libs/mongodb";
import AdministrativeClub from "../../../../../models/AdministrativeClub";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'DELETE'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {

            if(session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president'
                    || session.user.role === 'manager'
            ){
                await connectMongoDB()
                const {id, isDeputy} = req.query
                if(id.toString().length == 0){
                    res.status(204).json({ error: 'لا توجد بيانات' })
                }else {
                    if(isDeputy == "true"){
                        const administrativeClub = await AdministrativeClub.findById(id)
                        if(!administrativeClub){
                            res.status(200).json({ mess: "هذه الوظيفة غير موجودة" })
                        }else {
                            await AdministrativeClub.findByIdAndUpdate(id, {
                                deputy: null
                            });
                            res.status(201).json({ mess: 'تم حذف وظيفة النائب بنجاح' })
                        }
                    }else {
                        const administrativeClub = await AdministrativeClub.findById(id)
                        if(!administrativeClub){
                            res.status(200).json({ mess: "هذه الوظيفة غير موجودة" })
                        }else {
                            await AdministrativeClub.findByIdAndDelete(id);
                            res.status(201).json({ mess: 'تم حذف وظيفة الإداري بنجاح' })
                        }
                    }
                }
            }else {
                res.status(200).json({mess: 'عفوا، غير مسموح لك بحذف هذه الوظيفة.'})
            }
        }
    }
}
